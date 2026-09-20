export interface GuideFaq {
  question: string;
  answer: string;
}

export interface GuideSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  codeBlock?: {
    language: string;
    code: string;
    caption?: string;
  };
  keyTakeaways?: string[];
  architectureCallout?: {
    title: string;
    points: { label: string; value: string }[];
  };
}

export interface GuideCta {
  heading: string;
  subtext: string;
  buttonText: string;
  actionUrl: string;
  badge: string;
}

export interface Guide {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  category: "System Design" | "Java" | "Data Structures" | "Backend Architecture";
  readingTimeMinutes: number;
  difficulty: "Intermediate" | "Advanced" | "All Levels";
  lastUpdated: string;
  author: {
    name: string;
    role: string;
  };
  summary: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  cta: GuideCta;
}

export const GUIDES: Guide[] = [
  {
    slug: "system-design-tinyurl",
    title: "System Design: How to Design TinyURL (Architecture, Capacity & SPOF)",
    seoTitle: "System Design: How to Design TinyURL | Interview Architecture & Capacity Guide",
    metaDescription:
      "Comprehensive system design interview guide for TinyURL / URL shortener. Learn capacity estimation, Base62 vs hashing, Key Generation Service (KGS), caching, and SPOF analysis.",
    keywords: [
      "how to design tinyurl",
      "system design url shortener interview",
      "tinyurl system design high level architecture",
      "base62 encoding tinyurl",
      "key generation service kgs",
      "system design interview questions",
    ],
    category: "System Design",
    readingTimeMinutes: 20,
    difficulty: "Advanced",
    lastUpdated: "2026-09-18",
    author: {
      name: "PrepVisor Systems Engineering Team",
      role: "Staff Infrastructure Engineers & Interview Evaluators",
    },
    summary:
      "Designing a URL shortening service like TinyURL or Bitly is one of the most classic system design interview problems asked at Google, Meta, and Amazon. This guide walks you through requirements, capacity estimation formulas, database schema, Base62 key generation, caching strategies, and failover design.",
    sections: [
      {
        id: "requirements",
        title: "1. Functional & Non-Functional Requirements",
        subtitle: "Clarifying scope before drawing a single box",
        content: `In an interview, never jump into drawing architecture without clarifying requirements with the interviewer.
        
**Functional Requirements:**
1. **URL Shortening**: Given a long URL, generate a unique, short alias (e.g. \`https://prepvisor.in/u/a8F9k2Z\`).
2. **Redirection**: When accessing a short URL, immediately redirect the user to the original long URL with high availability.
3. **Custom Aliases (Optional)**: Users should optionally pick a custom alias if available.
4. **Link Expiration (Optional)**: Short URLs expire after a default TTL (e.g., 2 or 5 years) or custom user timestamp.

**Non-Functional Requirements:**
- **Ultra-Low Latency**: Redirection lookup must complete in under **20 milliseconds**.
- **High Availability (99.99%)**: Redirection must never drop; reading is far more critical than writing.
- **Read-Heavy System**: Assume a **100:1 to 500:1 read-to-write ratio**.
- **Non-Predictable URLs**: Short links must not be easily guessable to prevent enumeration attacks.`,
        keyTakeaways: [
          "Always confirm read/write ratio early in the interview (100:1 or 500:1).",
          "Distinguish HTTP 301 (Permanent Redirect - browser caches) vs HTTP 302 (Temporary Redirect - allows analytics tracking).",
          "Ensure short tokens are non-guessable to protect private shared links.",
        ],
      },
      {
        id: "capacity-estimation",
        title: "2. Capacity Estimation & Back-of-the-Envelope Calculations",
        subtitle: "Quantifying traffic, storage, and memory bottlenecks",
        content: `Let's formulate realistic scale numbers for a 5-year production horizon:

**Traffic Calculations:**
- **Write QPS**: Assume **100 Million** new short URLs generated per month:
  $$\\text{Writes per second} = \\frac{100,000,000}{30 \\times 24 \\times 3600} \\approx 40 \\text{ URLs/sec}$$
- **Read QPS (100:1 Ratio)**:
  $$\\text{Reads per second} = 40 \\times 100 = 4,000 \\text{ redirections/sec}$$
- **Peak Traffic**: Assume a $2\\times$ peak multiplier: Peak Read QPS = **8,000 QPS**.

**Storage Calculations (5 Years):**
- Total URLs in 5 years = $100\\text{M}/\\text{month} \\times 12 \\times 5 = 6 \\text{ Billion URLs}$.
- Assume average original URL size = 500 bytes; metadata + short key + timestamp = 100 bytes. Total per record = **600 bytes**.
- Total Storage in 5 years:
  $$6\\text{ Billion} \\times 600 \\text{ Bytes} = 3.6 \\text{ Terabytes}$$
  *(3.6 TB is easily manageable on modern distributed databases with replication).*

**Cache Estimation (80/20 Rule):**
- 20% of the URLs generate 80% of read traffic.
- Daily read requests = $4,000 \\times 86,400 \\approx 345 \\text{ Million requests/day}$.
- Daily cache requirement (20% of daily reads):
  $$0.20 \\times 345\\text{M} \\times 600 \\text{ Bytes} \\approx 41.4 \\text{ GB RAM}$$
  *(Can comfortably fit in a single Redis cluster node with 64 GB RAM).*`,
        architectureCallout: {
          title: "Capacity Estimation Cheat Sheet",
          points: [
            { label: "Write QPS", value: "~40 writes/sec (Normal), ~100 writes/sec (Peak)" },
            { label: "Read QPS", value: "4,000 reads/sec (Normal), 8,000 reads/sec (Peak)" },
            { label: "5-Year Storage", value: "3.6 TB (6 Billion URL records)" },
            { label: "Redis Cache RAM", value: "~42 GB (80/20 rule, LRU eviction)" },
            { label: "Read Bandwidth", value: "4,000 * 600 bytes = 2.4 MB/second" },
          ],
        },
      },
      {
        id: "key-generation",
        title: "3. Key Generation Strategy: Base62 vs Hashing",
        subtitle: "Why MD5/SHA-256 collisions fail and how a Key Generation Service (KGS) wins",
        content: `A critical technical differentiator in this interview is how you generate the 7-character short token.

### Option A: Hashing (MD5 / SHA-256) + Base62
- Hash long URL using MD5 $\\rightarrow$ 128-bit hash $\\rightarrow$ Base62 encode $\\rightarrow$ take first 7 chars.
- **Flaw**: Two different URLs might collide on the first 7 characters. Handling collisions requires database lookups or appending salts, resulting in unpredictable write latencies.

### Option B: Dedicated Key Generation Service (KGS) with Pre-Generated Keys (Recommended)
- **Why 7 characters?**
  Using Base62 characters (\`[a-z, A-Z, 0-9]\`):
  $$62^7 = 3,521,614,606,208 \\approx 3.52 \\text{ Trillion unique URLs}$$
  *(Sufficient for hundreds of years of growth).*
- A standalone Key Generation Service generates random Base62 tokens offline and loads them in batches into memory.
- When an API server needs keys, it requests a block of 10,000 keys from the KGS. Even if an API server crashes, at most a small block is orphaned without any collision risk!`,
        codeBlock: {
          language: "java",
          caption: "Base62 Encoding Utility in Java",
          code: `public class Base62Encoder {
    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final int BASE = ALPHABET.length(); // 62

    public static String encode(long id) {
        StringBuilder sb = new StringBuilder();
        while (id > 0) {
            sb.append(ALPHABET.charAt((int) (id % BASE)));
            id /= BASE;
        }
        while (sb.length() < 7) {
            sb.append('0'); // Pad to 7 characters
        }
        return sb.reverse().toString();
    }
}`,
        },
        keyTakeaways: [
          "Base62 is preferred over Base64 because '+' and '/' require URL encoding in browser address bars.",
          "Pre-generating keys with a KGS removes hash collision overhead and guarantees O(1) instantaneous writes.",
          "Partitioning KGS keys across two tables ('used_keys' and 'unused_keys') ensures atomic allocations.",
        ],
      },
      {
        id: "high-level-architecture",
        title: "4. High-Level Architecture & End-to-End Flow",
        subtitle: "Connecting Load Balancer, Application Nodes, Redis Cache & Database",
        content: `### Read Flow (Redirection - 99% of Traffic):
1. User clicks \`https://prepvisor.in/u/x8Kp2L9\`.
2. Request hits Route 53 (DNS) and resolves to an Application Load Balancer (ALB).
3. ALB forwards to stateless **Redirection API Workers**.
4. Worker checks **Redis Cache** by key \`x8Kp2L9\`:
   - **Cache Hit (90%+)**: Returns 302 redirect with original URL in **< 5ms**.
   - **Cache Miss (10%)**: Queries database replica, populates Redis, returns 302 redirect.

### Write Flow (Creating Short URL - 1% of Traffic):
1. Client POSTs long URL to \`/api/v1/shorten\`.
2. Auth & Rate Limiter verifies client quota.
3. Service grabs pre-allocated Base62 key from local worker memory (fetched from KGS).
4. Inserts mapping into Primary Database and async-populates Redis.
5. Returns short URL to candidate immediately.`,
        architectureCallout: {
          title: "System Component Topology",
          points: [
            { label: "DNS / CDN", value: "Cloudflare / Route53 with Anycast IP routing" },
            { label: "Load Balancer", value: "NGINX / AWS ALB with round-robin health checks" },
            { label: "API Workers", value: "Stateless Golang / Java Spring Boot instances (Autoscaled)" },
            { label: "Cache Layer", value: "Redis Cluster with LRU eviction and replication" },
            { label: "Primary Database", value: "PostgreSQL (or MongoDB/DynamoDB) with Multi-AZ Replication" },
            { label: "Offline KGS", value: "Standby Key Generation cluster feeding worker memory queues" },
          ],
        },
      },
      {
        id: "database-schema",
        title: "5. Database Schema & Storage Engine Choice",
        subtitle: "SQL vs NoSQL trade-offs for 6 Billion rows",
        content: `Because TinyURL does not require complex relational joins or multi-table ACID transactions, both **NoSQL (DynamoDB/Cassandra)** and **Partitioned SQL (PostgreSQL)** are valid choices.

**Recommended Schema:**
\`\`\`sql
CREATE TABLE url_mappings (
    short_key VARCHAR(7) PRIMARY KEY,
    original_url VARCHAR(2048) NOT NULL,
    user_id UUID NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NULL
);

-- Index for expiration cleanup worker
CREATE INDEX idx_url_mappings_expires_at ON url_mappings(expires_at) 
WHERE expires_at IS NOT NULL;
\`\`\`

**Sharding Strategy:**
- Since 3.6 TB exceeds standard single-node memory comfortably, we can shard by **Hash of Short Key**:
  $$\\text{Shard ID} = \\text{Murmur3}(\\text{short\\_key}) \\pmod N$$
- This guarantees even distribution across $N$ database shards without hot spots.`,
      },
      {
        id: "fault-tolerance-spof",
        title: "6. Single Point of Failure (SPOF) & Fault Tolerance",
        subtitle: "What interviewers look for when testing your senior architectural maturity",
        content: `A common interview pitfall is presenting a happy-path architecture without disaster recovery.

1. **Redis Cache Crash**:
   - If Redis fails, 4,000 QPS will flood the database and cause cascading failure.
   - **Mitigation**: Deploy Redis in Master-Replica Sentinel with auto-failover, and implement circuit breakers in API workers to gracefully throttle if DB connection pools saturate.
2. **KGS Crash**:
   - Standby KGS instance using ZooKeeper / Raft consensus takes over immediately.
3. **Database Write Master Failure**:
   - Multi-AZ automatic failover promotes read replica to master in under 30 seconds. Because reads continue from remaining replicas, redirection is unaffected!`,
        keyTakeaways: [
          "Redirection must use HTTP 302 if you want server analytics (click count, geography, device type).",
          "LRU (Least Recently Used) is the optimal cache eviction policy for viral URLs.",
          "Lazy deletion is best for expired URLs: check expiry on lookup, rather than continuous full-table sweeps.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why use Base62 instead of Base64 for short URLs?",
        answer:
          "Base64 includes characters like '+' and '/', which carry special meanings in URL query strings and path segments and require percent-encoding (%2B, %2F). Base62 consists strictly of alphanumeric characters [a-z, A-Z, 0-9], making it safe for all browsers, SMS, and messaging apps.",
      },
      {
        question: "Should TinyURL return HTTP 301 or HTTP 302 status code?",
        answer:
          "HTTP 301 is a Permanent Redirect, which instructs browsers to cache the destination URL locally. This reduces server load, but prevents the URL shortener from tracking click analytics. HTTP 302 is a Temporary Redirect, which forces all clicks through your server, enabling real-time analytics, rate-limiting, and scam link deactivation.",
      },
      {
        question: "How do you handle expired short links efficiently?",
        answer:
          "Rather than running continuous expensive background scans over billions of rows, use lazy deletion combined with a low-priority nightly batch job. When a user requests an expired link, verify the timestamp, return 404, and mark for cleanup.",
      },
      {
        question: "How do you prevent two users from receiving the same short URL?",
        answer:
          "By employing a Key Generation Service (KGS) that pre-generates unique Base62 tokens offline and stores them in memory. API workers pull blocks of unique keys, guaranteeing zero collision and eliminating optimistic lock retries.",
      },
      {
        question: "How do you protect the service from malicious spam and DDoS?",
        answer:
          "Implement Token Bucket rate limiting per IP address / API key, integrate Google Safe Browsing API on the write path to block phishing URLs, and enforce CAPTCHA on unauthenticated link creation.",
      },
      {
        question: "What is the storage requirement for 6 billion short URLs?",
        answer:
          "At an average of 600 bytes per record (500 bytes for original URL + 100 bytes for short key, metadata, and timestamps), 6 billion URLs require approximately 3.6 Terabytes of total database storage.",
      },
    ],
    cta: {
      heading: "Design TinyURL on PrepVisor AI Studio",
      subtext:
        "Practice drawing this exact architecture on our interactive canvas. Get instant AI evaluation of your capacity math, SPOF bottlenecks, and latency.",
      buttonText: "Launch Interactive System Design Studio",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=system_design_tinyurl",
      badge: "Interactive Practice Challenge Available",
    },
  },

  {
    slug: "java-concurrency-interview-questions",
    title: "Top 50 Java Concurrency Interview Questions (2026 Edition)",
    seoTitle: "Top 50 Java Concurrency Interview Questions | 2026 Senior Developer Guide",
    metaDescription:
      "Master modern Java concurrency and multithreading interview questions. Explanations of JVM memory model, Virtual Threads, ThreadPoolExecutor, ReentrantLock, and thread-safety traps.",
    keywords: [
      "java concurrency interview questions",
      "java multithreading interview questions",
      "threadpool executor interview questions",
      "volatile vs synchronized java",
      "virtual threads java interview",
      "concurrenthashmap internal working",
    ],
    category: "Java",
    readingTimeMinutes: 24,
    difficulty: "Intermediate",
    lastUpdated: "2026-09-19",
    author: {
      name: "PrepVisor Technical Curriculum Lead",
      role: "Ex-Staff Engineer & Java Platform Specialist",
    },
    summary:
      "Java concurrency is the #1 filter for intermediate and senior engineering candidates. This curated guide covers the Java Memory Model, happens-before consistency, synchronization internals, concurrent collections, and modern Virtual Threads in Java with verified code patterns.",
    sections: [
      {
        id: "jvm-memory-model",
        title: "1. Java Memory Model (JMM) & Thread Safety Fundamentals",
        subtitle: "Volatile, Atomicity, Visibility, and the Happens-Before Relationship",
        content: `Understanding how modern CPU architectures (L1/L2/L3 caches) interact with the JVM is mandatory for senior technical interviews.

### Core Concepts You Must Explain:
- **Visibility**: When Thread A updates a shared variable, Thread B may continue reading the stale value from its local CPU register or cache line unless a memory barrier is established.
- **Atomicity**: Operations like \`count++\` look atomic but actually compile to three bytecode instructions: **read, modify, write**. Without synchronization, increments will be lost.
- **Ordering (Instruction Reordering)**: Both the Java compiler and the CPU reorder instructions for maximum instruction pipeline efficiency as long as single-threaded semantics are preserved.

### \`volatile\` vs \`synchronized\` vs \`AtomicInteger\`
1. \`volatile\`: Guarantees **visibility** and **ordering** (via memory fence preventing instruction reordering), but does **NOT guarantee atomicity**.
2. \`synchronized\`: Guarantees **visibility**, **atomicity**, and mutual exclusion by acquiring the intrinsic object monitor lock.
3. \`AtomicInteger\` / \`AtomicReference\`: Uses CPU hardware-level **Compare-And-Swap (CAS)** instructions (e.g. \`LOCK CMPXCHG\` on x86) for non-blocking, lock-free atomicity.`,
        codeBlock: {
          language: "java",
          caption: "Double-Checked Locking Singleton Pattern (Correct with volatile)",
          code: `public class ThreadSafeSingleton {
    // Crucial: volatile prevents instruction reordering during instantiation!
    private static volatile ThreadSafeSingleton instance;

    private ThreadSafeSingleton() {}

    public static ThreadSafeSingleton getInstance() {
        if (instance == null) { // First check (no lock penalty)
            synchronized (ThreadSafeSingleton.class) {
                if (instance == null) { // Second check (under lock)
                    instance = new ThreadSafeSingleton();
                }
            }
        }
        return instance;
    }
}`,
        },
        keyTakeaways: [
          "Without 'volatile', line 'instance = new ThreadSafeSingleton()' can reorder memory allocation before constructor execution, causing other threads to read a half-initialized object.",
          "Happens-Before guarantee: An unlock on a monitor happens-before every subsequent lock on that same monitor.",
        ],
      },
      {
        id: "locks-and-synchronization",
        title: "2. Modern Locks: ReentrantLock, ReadWriteLock & StampedLock",
        subtitle: "Beyond the synchronized keyword: advanced lock constructs",
        content: `Why use \`java.util.concurrent.locks.ReentrantLock\` over native \`synchronized\`?

### Key Advantages of \`ReentrantLock\`:
1. **Try-Lock with Timeout**: Can attempt lock acquisition without blocking indefinitely (\`tryLock(500, TimeUnit.MILLISECONDS)\`), preventing deadlocks.
2. **Fairness Policy**: Can enforce FIFO lock acquisition to prevent thread starvation (\`new ReentrantLock(true)\`).
3. **Interruptible Locks**: A thread waiting for a lock can be interrupted via \`lockInterruptibly()\`.
4. **Multiple Condition Variables**: Supports multiple wait-sets per lock (\`lock.newCondition()\`).

### \`ReentrantReadWriteLock\` vs \`StampedLock\` (Java 8+)
- \`ReentrantReadWriteLock\` allows multiple concurrent readers, but readers block writers and can cause writer starvation.
- \`StampedLock\` introduces **Optimistic Reading** (\`tryOptimisticRead()\`), allowing readers to validate state without acquiring a read lock unless a write occurred!`,
        codeBlock: {
          language: "java",
          caption: "Bounded Buffer using ReentrantLock and Condition variables",
          code: `import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BoundedBuffer<T> {
    private final Object[] items = new Object[10];
    private int count, putptr, takeptr;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull  = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();

    public void put(T x) throws InterruptedException {
        lock.lock();
        try {
            while (count == items.length) notFull.await();
            items[putptr] = x;
            if (++putptr == items.length) putptr = 0;
            count++;
            notEmpty.signal();
        } finally {
            lock.unlock();
        }
    }
}`,
        },
      },
      {
        id: "threadpool-executor",
        title: "3. ThreadPoolExecutor Internals & Production Sizing",
        subtitle: "How task queues, core pools, and rejection policies really work",
        content: `Many candidates fail to explain the lifecycle of a task submitted to \`ThreadPoolExecutor\`.

### Task Execution Order:
1. If running threads < \`corePoolSize\`, executor spawns a **new worker thread** immediately.
2. If running threads >= \`corePoolSize\`, executor puts the task into the **WorkQueue** (e.g. \`ArrayBlockingQueue\` or \`LinkedBlockingQueue\`).
3. **Only when the queue is FULL** does the executor spawn threads up to \`maximumPoolSize\`!
4. If threads == \`maximumPoolSize\` and the queue is full, the **RejectedExecutionHandler** triggers.

### Saturation Rejection Policies:
- \`AbortPolicy\` (Default): Throws \`RejectedExecutionException\`.
- \`CallerRunsPolicy\`: Runs the task on the submitting thread (naturally throttles producer).
- \`DiscardPolicy\`: Silently drops the task.
- \`DiscardOldestPolicy\`: Discards the oldest unhandled task in the queue and retries.

### Pool Sizing Formula:
- **CPU-Bound Tasks**: Optimal Threads = $\\text{Number of CPU Cores} + 1$.
- **I/O-Bound Tasks** (DB/HTTP calls):
  $$\\text{Optimal Threads} = \\text{CPU Cores} \\times \\left(1 + \\frac{\\text{Wait Time}}{\\text{Compute Time}}\\right)$$`,
      },
      {
        id: "concurrenthashmap-internals",
        title: "4. ConcurrentHashMap Internal Working (Java 8+ vs Java 7)",
        subtitle: "From Segment Locks to CAS + Synchronized Node Bins",
        content: `\`ConcurrentHashMap\` is the single most frequently asked collections question in Java interviews.

### Java 7 Architecture:
- Used **Segment-level locking** (default 16 segments). Each segment was a subclass of \`ReentrantLock\`.
- Concurrency level was fixed at creation time.

### Java 8+ Redesign:
- Eliminated Segment locks in favor of **Node-level bucket locking**.
- Uses **CAS** (\`compareAndSwapObject\`) for insertion when the bucket head is null.
- Uses fine-grained \`synchronized\` **only on the first node of the bucket** when resolving hash collisions.
- Converts bucket from Linked List ($O(n)$) to a Red-Black Balanced Tree (\`TreeBin\` - $O(\\log n)$) when bucket threshold exceeds **8 elements** and total table capacity $\\ge 64$.
- Reads (\`get()\`) are **100% lock-free** because node values and next pointers are marked \`volatile\`.`,
        keyTakeaways: [
          "ConcurrentHashMap never locks for read operations; volatile semantics guarantee visibility.",
          "Size calculation uses LongAdder (CounterCell array) to avoid CAS contention bottlenecks across threads.",
          "ConcurrentHashMap does not allow null keys or null values to eliminate ambiguity between absent keys and null values.",
        ],
      },
      {
        id: "virtual-threads-java21",
        title: "5. Virtual Threads (Project Loom) in Java",
        subtitle: "How 1 Million lightweight user-mode threads change concurrency",
        content: `In 2026, every senior Java interview will ask you about Virtual Threads.

### Traditional Platform Threads vs Virtual Threads:
- **Platform Threads**: 1:1 mapped to OS threads. Heavyweight (~1 MB stack memory each). Creating 5,000 threads will exhaust JVM memory and crash with \`OutOfMemoryError: unable to create native thread\`.
- **Virtual Threads**: M:N mapped to carrier OS threads. Extremely lightweight (~few hundred bytes). You can comfortably run **1,000,000 virtual threads** on a standard laptop!

### How Virtual Threads Work:
- When a virtual thread executes blocking I/O (e.g. \`Socket.read()\`, \`Thread.sleep()\`), the JVM automatically **unmounts** the virtual thread from its carrier thread and parks its continuation in heap memory.
- The carrier OS thread immediately processes another runnable virtual thread.
- When the I/O event completes, the JVM remounts the virtual thread onto an available carrier thread!

### Interview Warning: The Pinning Trap!
- A virtual thread becomes **pinned** to its carrier thread if it blocks inside a \`synchronized\` block or calls a native JNI method.
- **Rule for Java**: Replace \`synchronized\` with \`ReentrantLock\` in I/O-intensive codebases to avoid pinning carrier threads!`,
        codeBlock: {
          language: "java",
          caption: "Launching Virtual Threads using Java Structured Concurrency",
          code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1)); // Does NOT block OS thread!
            return i;
        });
    });
} // Automatically waits for all 10,000 virtual threads to finish!`,
        },
      },
    ],
    faqs: [
      {
        question: "What is the difference between volatile and synchronized in Java?",
        answer:
          "volatile guarantees visibility and ordering across threads by preventing CPU cache staleness and instruction reordering, but it does NOT provide atomicity for compound operations (e.g. count++). synchronized provides full mutual exclusion, guaranteeing atomicity, visibility, and ordering, but incurs thread blocking overhead.",
      },
      {
        question: "Why does ConcurrentHashMap not allow null keys or null values?",
        answer:
          "In a concurrent environment, if map.get(key) returned null, you could not distinguish whether the key was absent or the key was mapped to null without calling map.containsKey(key). In multithreaded systems, the key could be inserted or removed between the two calls, creating a critical race condition.",
      },
      {
        question: "What is thread pinning in Java Virtual Threads?",
        answer:
          "Thread pinning occurs when a virtual thread enters a synchronized block or calls a native method and then attempts blocking I/O. The JVM cannot unmount the virtual thread from its underlying OS carrier thread, blocking the carrier thread and limiting throughput. Use ReentrantLock instead of synchronized in virtual-thread applications.",
      },
      {
        question: "What is the difference between CountDownLatch and CyclicBarrier?",
        answer:
          "A CountDownLatch cannot be reset once its count reaches zero; it is used when one or more threads wait for N operations to complete. A CyclicBarrier can be reset and reused after all waiting threads are released, making it ideal for iterative parallel algorithms where threads sync at barrier points.",
      },
      {
        question: "How does the Happens-Before relationship work in the Java Memory Model?",
        answer:
          "The happens-before relationship guarantees that memory writes by one thread are visible to subsequent reads by another thread. Critical rules include: monitor unlock happens-before subsequent lock on the same monitor, write to volatile variable happens-before subsequent read of that variable, and Thread.start() happens-before any action in the started thread.",
      },
      {
        question: "What happens when the work queue in a ThreadPoolExecutor is full?",
        answer:
          "When the task queue is full and active threads are less than maximumPoolSize, the executor allocates additional worker threads up to maximumPoolSize. If the active threads already equal maximumPoolSize, the configured RejectedExecutionHandler (AbortPolicy, CallerRunsPolicy, DiscardPolicy, or DiscardOldestPolicy) is invoked.",
      },
    ],
    cta: {
      heading: "Practice Java Concurrency in PrepVisor AI Studio",
      subtext:
        "Code multithreaded patterns, run concurrency unit tests, and receive real-time Big-O and thread-safety feedback from our AI evaluator.",
      buttonText: "Solve Concurrency Challenges Now",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=java_concurrency_top50",
      badge: "Hands-On Java Code Sandbox Included",
    },
  },
  {
    slug: "system-design-rate-limiter",
    title: "System Design: How to Design an API Rate Limiter (Token Bucket vs Leaky Bucket)",
    seoTitle: "System Design: How to Design an API Rate Limiter | Token Bucket & Redis Architecture",
    metaDescription:
      "Comprehensive system design interview guide for an API Rate Limiter. Compare Token Bucket, Leaky Bucket, and Sliding Window with distributed Redis Lua scripts, memory sizing, and fail-open resilience.",
    keywords: [
      "how to design an api rate limiter",
      "system design rate limiter interview",
      "token bucket vs leaky bucket",
      "redis rate limiter lua script",
      "distributed rate limiting architecture",
      "sliding window counter rate limit",
      "api gateway rate limiting envoy kong",
    ],
    category: "System Design",
    readingTimeMinutes: 22,
    difficulty: "Advanced",
    lastUpdated: "2026-09-20",
    author: {
      name: "PrepVisor Systems Engineering Team",
      role: "Staff Infrastructure Engineers & Interview Evaluators",
    },
    summary:
      "Designing a distributed API Rate Limiter is a staple system design interview question at Google, Stripe, Cloudflare, and Uber. This deep-dive covers core algorithms (Token Bucket, Leaky Bucket, Sliding Window Counter), distributed synchronization race conditions, Redis Lua script execution, memory capacity sizing, and fail-open resilience.",
    sections: [
      {
        id: "requirements",
        title: "1. Functional & Non-Functional Requirements",
        subtitle: "Clarifying limits, granularity, and failure modes",
        content: `Before architecting a rate limiter, interviewers expect you to clearly pin down the granularity of limits and what happens when components fail.

**Functional Requirements:**
1. **Granular Rate Limiting**: Limit requests based on client identifier (authenticated user ID, API token) or IP address for unauthenticated traffic.
2. **Configurable Tiers**: Support multiple rate limiting tiers (e.g. Free Tier: 100 req/min; Enterprise: 5,000 req/min; Login Endpoint: 5 attempts/min to prevent brute-force attacks).
3. **Informative HTTP Headers**: Return standard headers on every request (\`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, \`X-RateLimit-Reset\`).
4. **Graceful Throttling**: When limits are breached, return **HTTP 429 (Too Many Requests)** accompanied by a \`Retry-After\` header specifying the cooldown period in seconds.

**Non-Functional Requirements:**
- **Sub-Millisecond Overhead**: The rate limiter sits directly in the critical path of every single request. Latency overhead must stay under **2 to 3 milliseconds**.
- **Ultra-High Availability (99.999%)**: If the rate limiter is unavailable, legitimate users must not be locked out of the application.
- **Distributed State Synchronization**: Support hundreds of edge API gateway nodes querying a distributed, consistent token store.
- **Memory Efficiency**: The system must track hundreds of millions of active IP addresses and user accounts within a bounded memory footprint.`,
        keyTakeaways: [
          "Always confirm whether rate limiting applies globally, per user, per IP, or per endpoint.",
          "Establish the failure policy upfront: fail-open (prioritize user experience) vs fail-closed (prioritize backend protection).",
          "Ensure standard IETF rate-limiting response headers are returned to help client SDKs pace their retries.",
        ],
      },
      {
        id: "algorithms",
        title: "2. Algorithm Comparison: Token Bucket vs Leaky Bucket vs Sliding Window",
        subtitle: "Selecting the optimal rate limiting algorithm for the workload",
        content: `Interviewers will ask you to compare different rate limiting algorithms. Here is how they stack up in production systems:

### 1. Token Bucket (Industry Standard)
- **Mechanism**: A bucket holds up to a maximum of $b$ tokens. Tokens are continuously added at a fixed rate of $r$ tokens per second. Each incoming request consumes 1 token. If the bucket is empty, the request is dropped (or throttled).
- **Burst Behavior**: **Allows controlled bursts**. If the bucket is full, up to $b$ requests can be processed immediately in a single instant.
- **Memory Footprint**: Extremely compact ($O(1)$ space). You only need to store two numbers per user: the remaining token count and the last refill timestamp.
- **Used by**: Amazon Web Services, Stripe API, GitHub API.

### 2. Leaky Bucket (Traffic Shaping)
- **Mechanism**: Incoming requests enter a FIFO queue of fixed capacity. Requests are pulled from the queue and processed at a constant, fixed rate (the 'leak'). If the queue is full, incoming requests overflow and are discarded.
- **Burst Behavior**: **Zero burst tolerance**. Flattens traffic spikes into a smooth, steady output stream.
- **Trade-off**: Not ideal for general user-facing APIs where bursty web traffic is normal. However, it is ideal for egress traffic shaping when calling downstream legacy services that cannot tolerate sudden spikes.

### 3. Fixed Window Counter
- **Mechanism**: Divides time into fixed windows (e.g. 1 minute from 12:00 to 12:01). A counter increments with each request.
- **The Boundary Burst Trap**: A client can send 100 requests at 12:00:59 and another 100 requests at 12:01:01. In a 2-second interval, 200 requests were processed, doubling the intended rate limit!

### 4. Sliding Window Log
- **Mechanism**: Stores the epoch timestamp of every request in a sorted set (such as Redis ZSET). When a request arrives, all timestamps older than \`now - window_size\` are purged, and the remaining elements are counted.
- **Trade-off**: Extremely accurate, zero boundary burst issue. However, memory consumption is $O(N)$ where $N$ is the number of requests in the window. A DDoS attack can exhaust memory rapidly.

### 5. Sliding Window Counter (Hybrid Best Practice)
- **Mechanism**: Combines the fixed window of the previous interval and the current interval using a weighted formula:
  $$\\text{Estimated Count} = \\text{Previous Window Count} \\times (1 - \\text{elapsed fraction}) + \\text{Current Window Count}$$
- **Trade-off**: Extremely memory efficient ($O(1)$ space), smooths boundary spikes, and has less than 0.05% error rate in practice. Used extensively by Cloudflare.`,
        architectureCallout: {
          title: "Rate Limiting Algorithm Comparison Summary",
          points: [
            { label: "Token Bucket", value: "O(1) Memory | Permits Bursts | Best for REST APIs" },
            { label: "Leaky Bucket", value: "Queue-Based | Constant Output Rate | Best for Egress Shaping" },
            { label: "Fixed Window", value: "O(1) Memory | Boundary Spike Flaw | Simple Counters Only" },
            { label: "Sliding Window Counter", value: "O(1) Memory | Low Memory & Smooth Bursts | Cloudflare Standard" },
          ],
        },
        keyTakeaways: [
          "Token Bucket is the default recommendation for modern REST APIs because it natively supports user bursts.",
          "Never choose Sliding Window Log for high-scale systems without acknowledging the memory vulnerability under DDoS bursts.",
        ],
      },
      {
        id: "architecture",
        title: "3. High-Level Architecture & Gateway Placement",
        subtitle: "Where should the rate limiter live in the infrastructure?",
        content: `In a modern microservices architecture, placing the rate limiter in individual application services causes duplication and wastes application CPU cycles.

**Recommended Topology: Edge API Gateway with Distributed Cache**
1. **Client Request**: The mobile app or third-party client makes an HTTPS call to \`api.prepvisor.in\`.
2. **Reverse Proxy / API Gateway (Envoy / Kong / Cloudflare)**: Terminates TLS, authenticates JWT or API keys, and extracts the client identifier.
3. **Rate Limiter Middleware**: Before routing to backend microservices, the gateway queries an in-memory distributed cache cluster (**Redis Cluster**).
4. **Decision Evaluation**:
   - **Allowed**: Gateway appends headers (\`X-RateLimit-Remaining: 42\`) and proxies the request to the upstream target service.
   - **Throttled**: Gateway immediately short-circuits with **HTTP 429 Too Many Requests**, payload \`{"error": "rate_limit_exceeded", "retry_after": 6}\`, saving backend compute.`,
        keyTakeaways: [
          "Placing rate limiting at the API Gateway prevents unauthorized or throttled traffic from saturating downstream backend databases.",
          "Use connection pooling with HTTP/2 or gRPC between API Gateways and the Redis cluster to keep latency under 2ms.",
        ],
      },
      {
        id: "concurrency-lua",
        title: "4. Distributed Concurrency & The Race Condition Trap",
        subtitle: "Why naive GET + SET fails and how Redis Lua scripts guarantee atomicity",
        content: `The most common senior interview question on rate limiters is: **"What happens when two concurrent requests arrive at different gateway servers simultaneously?"**

### The Race Condition Trap (Check-then-Act)
Suppose a user has 1 token remaining.
1. Server A receives Request 1, calls \`GET user:123\`, and reads \`tokens = 1\`.
2. Server B receives Request 2, calls \`GET user:123\`, and also reads \`tokens = 1\`.
3. Server A calculates \`tokens - 1 = 0\` and writes \`SET user:123 tokens=0\`.
4. Server B calculates \`tokens - 1 = 0\` and writes \`SET user:123 tokens=0\`.
**Result**: Both requests succeeded even though only 1 token was available. At 50,000 QPS, this concurrency bug allows massive quota overruns.

### The Solution: Redis Lua Scripts
Redis executes Lua scripts **atomically in a single single-threaded event loop**. No other command or script can run while the script is active. Below is a production-grade Lua script for Token Bucket rate limiting:`,
        codeBlock: {
          language: "lua",
          caption: "Production-ready Redis Lua Script for Atomic Token Bucket Rate Limiting",
          code: `-- KEYS[1]: rate limit key (e.g., "ratelimit:user_12345")
-- ARGV[1]: bucket capacity (e.g., 100)
-- ARGV[2]: refill rate per second (e.g., 10 tokens/sec)
-- ARGV[3]: requested tokens (e.g., 1)
-- ARGV[4]: current server epoch timestamp in seconds

local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local requested = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

-- Retrieve current bucket state: [tokens, last_refill_time]
local data = redis.call("HMGET", key, "tokens", "last_refill")
local current_tokens = tonumber(data[1])
local last_refill = tonumber(data[2])

if current_tokens == nil then
  -- Bucket does not exist yet; initialize to full capacity
  current_tokens = capacity
  last_refill = now
else
  -- Calculate tokens accumulated since last request
  local elapsed = math.max(0, now - last_refill)
  local generated_tokens = elapsed * refill_rate
  current_tokens = math.min(capacity, current_tokens + generated_tokens)
  last_refill = now
end

-- Evaluate if sufficient tokens exist
if current_tokens >= requested then
  current_tokens = current_tokens - requested
  redis.call("HMSET", key, "tokens", current_tokens, "last_refill", last_refill)
  -- Set TTL to allow automatic cleanup of inactive keys (e.g. 1 hour)
  redis.call("EXPIRE", key, 3600)
  -- Return [1 = allowed, remaining_tokens, retry_after_seconds = 0]
  return { 1, math.floor(current_tokens), 0 }
else
  -- Rate limited; calculate seconds until next token is available
  local missing = requested - current_tokens
  local retry_after = math.ceil(missing / refill_rate)
  -- Persist state with updated refill timestamp
  redis.call("HMSET", key, "tokens", current_tokens, "last_refill", last_refill)
  redis.call("EXPIRE", key, 3600)
  -- Return [0 = denied, remaining_tokens = 0, retry_after_seconds]
  return { 0, 0, retry_after }
end`,
        },
        keyTakeaways: [
          "Lua scripts execute atomically in Redis without requiring expensive distributed locks (like Redlock).",
          "Always set a TTL on the Redis key (e.g., 3600 seconds) so that inactive users do not leak memory.",
        ],
      },
      {
        id: "capacity-estimation",
        title: "5. Capacity Estimation & Redis Memory Sizing",
        subtitle: "Back-of-the-envelope calculations for 100M users",
        content: `Always demonstrate your ability to size distributed memory in senior interviews.

**Assumptions:**
- **Total User Base**: 100 Million registered accounts.
- **Daily Active Users (DAU)**: 10 Million users.
- **Average QPS**: 10,000 requests/second.
- **Peak Burst QPS**: 50,000 requests/second.

**Redis Memory Footprint per Client Key:**
- **Key**: \`"rl:usr:10008492"\` $\\approx$ 16 bytes.
- **Fields**: \`tokens\` (8-byte double/int) + \`last_refill\` (8-byte epoch int) $\\approx$ 16 bytes.
- **Redis Internal Hash Overhead**: Hash entry overhead, dict pointers, \`robj\` metadata, and jemalloc chunk alignment $\\approx$ 32 bytes.
- **Total per Key**: $\\approx 64\\text{ bytes}$.

**Total Memory for Active Working Set:**
- If tracking all 100 Million users simultaneously:
  $$100{,}000{,}000 \\times 64 \\text{ bytes} = 6{,}400{,}000{,}000 \\text{ bytes} \\approx 6.4 \\text{ GB}$$
- **Conclusion**: The entire rate limiting metadata for 100 million users fits comfortably in a single standard cloud Redis node (16 GB RAM) or a 3-shard Redis cluster with master-replica failover!

**Network Bandwidth:**
- $50{,}000 \\text{ QPS} \\times 150 \\text{ bytes per Lua payload} \\approx 7.5 \\text{ MB/sec}$.
- $7.5 \\text{ MB/sec} = 60 \\text{ Mbps}$, utilizing less than 1% of a standard 10 Gbps AWS EC2 network interface.`,
        architectureCallout: {
          title: "Rate Limiter Capacity Sizing Blueprint",
          points: [
            { label: "Peak Ingress QPS", value: "50,000 requests/sec" },
            { label: "Latency Overhead Target", value: "< 2.5 ms (Redis cluster pipeline)" },
            { label: "Active Tracking Memory", value: "~6.4 GB for 100M active tracking keys" },
            { label: "Network Bandwidth", value: "~7.5 MB/sec (60 Mbps)" },
          ],
        },
        keyTakeaways: [
          "Highlight to the interviewer that 6.4 GB of RAM is trivial for modern cloud infrastructure, proving the feasibility of the architecture.",
          "Use Redis cluster sharding (hash slots based on client ID) to distribute QPS load across multiple Redis nodes.",
        ],
      },
      {
        id: "edge-cases-resilience",
        title: "6. Edge Cases, Multi-Tier Limits & Failover Resilience",
        subtitle: "Bulletproofing against DDoS, clock drift, and cache outages",
        content: `Staff-level interviewers grade you on your operational resilience and failure mode analysis:

### 1. The Clock Skew Problem
In distributed environments, server system clocks drift by milliseconds (NTP synchronization skew). If API Gateways pass their local machine timestamp to Redis, race conditions and negative time deltas can corrupt token refills.
- **Solution**: Always fetch the canonical timestamp directly from the Redis server using \`redis.call('TIME')\` inside the Lua script.

### 2. Multi-Tier Rate Limiting Defense
A single rate limiter cannot solve all security and operational problems. Employ a multi-tier defense:
1. **L1 Edge Rate Limiting (Cloudflare / AWS Shield)**: IP-based rate limiting and DDoS blocking at the edge before traffic enters your VPC.
2. **L2 API Gateway Rate Limiting (Token Bucket in Redis)**: Per-user and per-API-key quotas to enforce billing plans.
3. **L3 Service-Level Circuit Breakers**: Protect internal databases and microservices from cascading failures if a specific endpoint experiences unexpected load.

### 3. Cache Outage: Fail-Open vs Fail-Closed
What happens if the Redis cluster crashes or network partitions occur?
- **Fail-Closed**: Reject all incoming requests. **Problem**: A minor rate limiter glitch causes a complete system-wide outage for 100% of customers.
- **Fail-Open (Recommended for Most Systems)**: If the Redis call times out (> 10ms) or errors, permit the request to proceed and trigger a high-priority PagerDuty alert. A temporary spike in backend traffic is vastly preferable to an unrecoverable full outage.`,
        keyTakeaways: [
          "Always implement a circuit breaker (e.g. Resilience4j) around Redis calls with a fail-open policy for non-financial systems.",
          "Defend against clock drift by relying on Redis server time rather than gateway application clocks.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the primary difference between Token Bucket and Leaky Bucket?",
        answer:
          "Token Bucket allows controlled traffic bursts up to the bucket capacity while maintaining an average rate, making it ideal for general web APIs. Leaky Bucket flattens traffic into a strictly constant output rate without burst tolerance, making it ideal for egress traffic shaping toward fragile downstream services.",
      },
      {
        question: "How do you prevent race conditions in a distributed rate limiter?",
        answer:
          "Naive GET and SET operations in Redis suffer from check-then-act race conditions. In production, race conditions are eliminated by executing rate limit checks inside an atomic Redis Lua script, which runs to completion on Redis's single-threaded event loop without interleaving.",
      },
      {
        question: "Where should the rate limiter be positioned in modern microservices?",
        answer:
          "The rate limiter should be positioned at the edge API Gateway (e.g. Envoy, Kong, Cloudflare) rather than inside individual application microservices. This blocks unauthorized or throttled requests before they consume application server CPU, thread pools, or database connections.",
      },
      {
        question: "What HTTP status code and response headers should be returned when rate limited?",
        answer:
          "The server should return HTTP 429 (Too Many Requests) along with headers: X-RateLimit-Limit (total quota), X-RateLimit-Remaining (tokens left in current window), X-RateLimit-Reset (epoch timestamp when quota refreshes), and Retry-After (seconds until retry is permitted).",
      },
      {
        question: "Should a rate limiter fail open or fail closed during a Redis outage?",
        answer:
          "For standard web and mobile applications, the rate limiter should fail open with an active circuit breaker. If Redis times out, requests are allowed through while alerting DevOps, avoiding a total platform outage. For strict financial transaction or security-critical endpoints, a fail-closed policy may be chosen.",
      },
      {
        question: "How do you handle clock drift across distributed rate limiting servers?",
        answer:
          "Server clocks drift due to NTP synchronization intervals. To eliminate skew, never use client or gateway application timestamps; instead, obtain the canonical time directly within Redis using the redis.call('TIME') command inside the Lua script.",
      },
    ],
    cta: {
      heading: "Practice Rate Limiter System Design in PrepVisor Interactive Studio",
      subtext:
        "Design scalable rate limiters, configure Token vs Leaky Bucket algorithms, and evaluate concurrency bottlenecks with our AI-powered system design mock interviewer.",
      buttonText: "Design Rate Limiter in Studio",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=system_design_rate_limiter",
      badge: "Interactive Architecture Canvas Included",
    },
  },
  {
    slug: "spring-boot-microservices-interview-questions",
    title: "Spring Boot & Microservices Interview Questions (3–6 Years Experience)",
    seoTitle: "Top Spring Boot & Microservices Interview Questions | 3-6 Yrs Senior Guide",
    metaDescription:
      "Master top Spring Boot and microservices interview questions for 3-6 years experience. In-depth answers on Spring Boot 3, @Transactional pitfalls, distributed tracing, and Saga pattern.",
    keywords: [
      "spring boot microservices interview questions",
      "spring boot interview questions for 5 years experience",
      "transactional rollback spring boot pitfalls",
      "saga pattern vs 2pc microservices",
      "spring boot 3 virtual threads java",
      "resilience4j circuit breaker interview",
    ],
    category: "Backend Architecture",
    readingTimeMinutes: 26,
    difficulty: "Advanced",
    lastUpdated: "2026-09-20",
    author: {
      name: "PrepVisor Backend Architecture Team",
      role: "Staff Engineers & Technical Interview Panelists",
    },
    summary:
      "For senior engineers with 3 to 6 years of experience, technical interviewers move beyond basic annotations to evaluate your mastery of Spring Boot 3 internals, proxy-based @Transactional traps, distributed transaction patterns (Saga vs 2PC), Resilience4j fault tolerance, and Java Virtual Threads concurrency.",
    sections: [
      {
        id: "spring-internals",
        title: "1. Spring Boot 3 Core & Bean Lifecycle Internals",
        subtitle: "How Spring initializes, configures, and proxies beans",
        content: `At the senior level, interviewers probe your understanding of what actually happens when \`SpringApplication.run()\` is invoked.

### 1. Spring Boot 3 Startup Sequence
1. **Environment Setup**: Reads system properties, OS environment variables, and parses \`application.yml\` / \`application.properties\`.
2. **ApplicationContext Creation**: Instantiates the dependency injection container (\`AnnotationConfigServletWebServerApplicationContext\` for MVC or reactive variant for WebFlux).
3. **Auto-Configuration Loading**: In Spring Boot 3, auto-configuration classes are discovered via \`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports\` (replacing the legacy \`spring.factories\` mechanism from Spring Boot 2.x).
4. **Embedded Web Server Initialization**: Tomcat, Jetty, or Undertow is started and binds to the configured port (e.g. 8080).

### 2. Spring Bean Lifecycle Phases
Understanding the exact lifecycle order is critical for troubleshooting initialization bugs:
1. **Instantiation**: JVM allocates memory for the bean instance via constructor reflection.
2. **Populate Properties**: Dependencies injected via field, setter, or constructor injection.
3. **Aware Interfaces**: Spring injects container references (\`BeanNameAware\`, \`BeanFactoryAware\`, \`ApplicationContextAware\`).
4. **BeanPostProcessor (Before Initialization)**: \`postProcessBeforeInitialization()\` executes (e.g. processing \`@PostConstruct\` annotations).
5. **Initialization**: \`InitializingBean.afterPropertiesSet()\` runs, followed by any custom \`initMethod\`.
6. **BeanPostProcessor (After Initialization)**: \`postProcessAfterInitialization()\` executes. **This is where Spring creates CGLIB or JDK dynamic proxies** for annotations like \`@Transactional\`, \`@Async\`, and \`@Cacheable\`!
7. **Ready for Use**: Bean is live in the container singleton registry.
8. **Destruction Lifecycle**: Triggered on container shutdown (\`@PreDestroy\`, \`DisposableBean.destroy()\`).`,
        keyTakeaways: [
          "Remember that Spring AOP proxies are created in postProcessAfterInitialization. Calling an annotated method from within the same class bypasses this proxy.",
          "Spring Boot 3 uses AutoConfiguration.imports instead of spring.factories for modular auto-configuration discovery.",
        ],
      },
      {
        id: "transactional-traps",
        title: "2. The @Transactional Traps & Rollback Mechanics",
        subtitle: "The 4 most common production transaction pitfalls",
        content: `The \`@Transactional\` annotation looks simple, but hides several subtle traps that frequently cause silent data corruption or database connection pool exhaustion in production.

### Trap 1: The Self-Invocation Proxy Bypass
If method \`saveUser()\` calls \`@Transactional public void updateUserRecords()\` inside the same service class, **no transaction is created**.
- **Root Cause**: Spring wraps the service bean with a dynamic proxy. When an external caller calls \`saveUser()\`, the proxy is invoked. But internal calls within the same class invoke \`this.updateUserRecords()\`, completely bypassing the proxy and its transaction interceptor.
- **Fix**: Inject the service into itself via \`@Lazy\`, extract the transactional logic to a dedicated helper service, or use programmatic transactions via \`TransactionTemplate\`.

### Trap 2: Default Exception Rollback Behavior
By default, Spring transactions **ONLY rollback for unchecked exceptions** (\`RuntimeException\` and \`Error\`). If your code throws a checked exception (e.g., \`IOException\`, \`SQLException\`, or custom \`BusinessValidationException extends Exception\`), Spring will commit the transaction!
- **Fix**: Always explicitly declare:
  \`@Transactional(rollbackFor = Exception.class)\`

### Trap 3: Holding Connections During Remote I/O (Connection Starvation)
Never perform external HTTP REST calls, gRPC calls, or file uploads inside a \`@Transactional\` block.
- **Root Cause**: As soon as a \`@Transactional\` method begins, HikariCP leases an active JDBC connection from the database connection pool. If your 3rd-party payment gateway takes 3 seconds to respond, that database connection is held completely idle.
- Under moderate traffic (100 concurrent requests), all database connections in the pool become exhausted, causing system-wide \`ConnectionTimeoutException\`.

### Trap 4: Transaction Propagation Pitfalls
- **\`REQUIRED\` (Default)**: Joins an existing transaction if one exists; creates a new one if not. If a child method throws a caught exception, the transaction is marked *rollback-only*, causing the parent method to fail with \`UnexpectedRollbackException\` on commit.
- **\`REQUIRES_NEW\`**: Suspends the current outer transaction, opens an independent physical transaction, and acquires a **second** database connection from the pool. Using \`REQUIRES_NEW\` carelessly can cause deadlock in connection pools!`,
        keyTakeaways: [
          "Always add rollbackFor = Exception.class to ensure checked exceptions trigger rollback.",
          "Never execute external network I/O inside a @Transactional method to prevent HikariCP pool starvation.",
        ],
      },
      {
        id: "resilience4j",
        title: "3. Microservices Resilience: Circuit Breakers with Resilience4j",
        subtitle: "Protecting distributed services from cascading failures",
        content: `In a microservices ecosystem, if Downstream Service C experiences high latency, Upstream Service B exhausts its thread pool waiting for responses, cascading the failure to Upstream Service A and taking down the entire system.

### Why Resilience4j Replaced Netflix Hystrix
Netflix announced Hystrix maintenance mode in 2018. Hystrix relied heavily on dedicated thread pools per command, causing excessive thread switching overhead. **Resilience4j** is lightweight, modular, and built on Java functional programming (Vavr) with zero external dependencies.

### Circuit Breaker State Machine
1. **CLOSED**: Normal state. All requests flow directly to the downstream service. Resilience4j tracks call outcomes (success/failure/slow call) in a sliding window (e.g., last 100 calls).
2. **OPEN**: If the failure rate exceeds the threshold (e.g. > 50%), the circuit transitions to OPEN. All subsequent requests fail fast immediately, executing an optional fallback method without touching the downstream service.
3. **HALF_OPEN**: After a configured duration (\`waitDurationInOpenState = 10s\`), the circuit enters HALF_OPEN. It allows a trial number of requests (e.g. 10 calls) to pass through. If they succeed, the circuit resets to CLOSED; if any fail, it reverts back to OPEN.`,
        keyTakeaways: [
          "Use sliding window metrics (count-based or time-based) to detect degradation before complete downstream failure.",
          "Always provide sensible fallback responses (e.g. cached data or degraded functionality) in circuit breaker annotations.",
        ],
      },
      {
        id: "distributed-transactions",
        title: "4. Distributed Transactions: Saga Pattern vs 2-Phase Commit",
        subtitle: "Maintaining data consistency across autonomous microservice databases",
        content: `In microservices, each service owns its private database. You cannot use a single SQL transaction across Order Service (PostgreSQL) and Payment Service (MongoDB).

### Why 2-Phase Commit (2PC / XA) Fails at Scale
2PC requires a centralized transaction coordinator that locks database rows across all services during Phase 1 (Prepare) and Phase 2 (Commit).
- **Major Bottlenecks**: Blocking locks hold database resources for seconds, network latency kills throughput, and if the coordinator crashes during Phase 2, databases remain locked indefinitely. 2PC violates microservice autonomy.

### The Saga Pattern
A Saga is a sequence of local transactions where each service updates its internal database and publishes a domain event. If any step fails, the Saga triggers **Compensating Transactions** that undo previous operations in reverse order.

| Approach | Mechanics | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Choreography** | Event-driven. Services listen to Kafka events and trigger local actions. | Simple, decentralized, loose coupling. | Difficult to trace workflows; cyclic dependency risk. |
| **Orchestration** | A centralized coordinator (e.g. OrderSagaManager) sends command messages to services. | Clear state machine, easy monitoring, explicit rollback logic. | Additional coordinator component to maintain. |

### The Transactional Outbox Pattern
How do you guarantee that a database update and a Kafka message event are published atomically without dual-write inconsistencies?
- Write both the business record and an outbox event into the **same local database transaction**.
- A Change Data Capture (CDC) tool like **Debezium** or an asynchronous worker polls the outbox table and streams events to Kafka with guaranteed at-least-once delivery!`,
        codeBlock: {
          language: "java",
          caption: "Transactional Outbox Pattern Implementation with Spring Boot 3 & Domain Events",
          code: `@Service
@RequiredArgsConstructor
public class OrderProcessingService {

    private final OrderRepository orderRepository;
    private final OutboxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;

    /**
     * Executes order creation and outbox event publishing within a single atomic local DB transaction.
     * Guarantees zero dual-write inconsistencies between database state and event bus.
     */
    @Transactional(rollbackFor = Exception.class)
    public OrderResponse createOrder(CreateOrderRequest request) {
        // 1. Persist business entity
        Order order = Order.builder()
                .customerId(request.getCustomerId())
                .totalAmount(request.getAmount())
                .status(OrderStatus.PENDING_PAYMENT)
                .createdAt(Instant.now())
                .build();
        Order savedOrder = orderRepository.save(order);

        // 2. Prepare domain event payload
        OrderCreatedEvent event = new OrderCreatedEvent(
                savedOrder.getId(),
                savedOrder.getCustomerId(),
                savedOrder.getTotalAmount()
        );

        // 3. Persist event into the outbox table in the SAME database transaction
        OutboxEvent outboxRecord = OutboxEvent.builder()
                .aggregateType("ORDER")
                .aggregateId(savedOrder.getId().toString())
                .eventType("ORDER_CREATED")
                .payload(writeJson(event))
                .status(OutboxStatus.PENDING)
                .createdAt(Instant.now())
                .build();
        outboxRepository.save(outboxRecord);

        // Debezium CDC or an asynchronous poller captures outbox records and streams to Kafka
        return OrderResponse.from(savedOrder);
    }

    private String writeJson(Object event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize outbox event payload", e);
        }
    }
}`,
        },
        keyTakeaways: [
          "The Saga pattern achieves eventual consistency without holding distributed locks.",
          "Use the Transactional Outbox pattern with CDC to eliminate dual-write hazards between relational databases and message brokers.",
        ],
      },
      {
        id: "observability-tracing",
        title: "5. Observability, Distributed Tracing & W3C Standards",
        subtitle: "Tracing requests across 20+ microservice boundaries",
        content: `When a client clicks 'Checkout', the request touches the API Gateway, Order Service, Inventory Service, Payment Service, and Notification Service. If the request times out, how do you locate the culprit?

### Distributed Tracing Fundamentals
- **Trace ID**: A globally unique identifier generated at the ingress API Gateway that remains unchanged across the entire distributed call graph.
- **Span ID**: Represents a single unit of work (e.g. an HTTP request, a database query, or a message consumption) within a specific service.
- **Parent Span ID**: Links child spans to their calling span, forming a directed acyclic graph (DAG) of the request.

### Spring Boot 3: Micrometer Tracing & OpenTelemetry
In Spring Boot 2, distributed tracing was handled by Spring Cloud Sleuth. In Spring Boot 3, Sleuth has been completely replaced by **Micrometer Tracing**, which natively supports the W3C TraceContext specification and OpenTelemetry (OTel) exporters:
- \`traceparent\` Header: \`00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01\`
- Automatically propagated over HTTP via \`RestClient\` / \`WebClient\` and over Kafka message headers.`,
        architectureCallout: {
          title: "Microservices Architecture Production Checklist",
          points: [
            { label: "Framework Baseline", value: "Spring Boot 3.2+ on Java" },
            { label: "Distributed Consistency", value: "Saga Pattern + Transactional Outbox (CDC)" },
            { label: "Fault Tolerance", value: "Resilience4j CircuitBreaker & Retry" },
            { label: "Distributed Tracing", value: "Micrometer Tracing + W3C TraceContext (OTel)" },
          ],
        },
        keyTakeaways: [
          "Spring Boot 3 uses Micrometer Tracing rather than Spring Cloud Sleuth.",
          "Ensure traceparent headers are propagated across Kafka message record headers for full asynchronous observability.",
        ],
      },
      {
        id: "java-spring3",
        title: "6. Java & Spring Boot 3 Modern Enhancements",
        subtitle: "Virtual Threads, RestClient, and GraalVM Native Images",
        content: `Interviewers for senior roles will assess whether you have kept your skills up-to-date with Java and Spring Boot 3.2+:

### 1. Virtual Threads (Project Loom)
In classic Spring Boot MVC, each HTTP request ties up one operating system (OS) platform thread. Under heavy I/O (waiting for database queries or REST APIs), 200 concurrent requests exhaust Tomcat's thread pool.
In Spring Boot 3.2+, you can enable Virtual Threads with a single configuration property:
\`\`\`properties
spring.threads.virtual.enabled=true
\`\`\`
- Tomcat dispatches each HTTP request on a lightweight virtual thread managed by the JVM rather than the OS kernel.
- Millions of virtual threads can run concurrently. When a virtual thread blocks on socket I/O, the JVM unmounts it from the underlying carrier OS thread, achieving WebFlux-level throughput with clean, sequential, synchronous blocking code!

### 2. The Modern RestClient
Spring 6.1 / Spring Boot 3.2 introduced \`RestClient\`, a modern, synchronous HTTP client with a fluent, intuitive API designed to replace the legacy \`RestTemplate\` without requiring the reactive overhead of \`WebClient\`.`,
        keyTakeaways: [
          "Virtual Threads provide high-throughput I/O concurrency without the cognitive overhead of reactive programming (Mono/Flux).",
          "Use RestClient for new synchronous HTTP integrations in Spring Boot 3.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why doesn't @Transactional rollback when a checked exception is thrown?",
        answer:
          "By default in Spring, transactions only roll back for unchecked exceptions (subclasses of RuntimeException) and Errors. Checked exceptions (subclasses of java.lang.Exception) indicate recoverable conditions according to EJB transaction design history. To roll back on all exceptions, configure @Transactional(rollbackFor = Exception.class).",
      },
      {
        question: "What is the self-invocation issue in Spring @Transactional?",
        answer:
          "Spring applies transactional behavior using dynamic AOP proxies. When a method in a service calls another @Transactional method within the same service class using this.method(), the call bypasses the Spring proxy, meaning no transaction interceptor is triggered and the target method runs without transactional guarantees.",
      },
      {
        question: "How does the Saga pattern solve distributed transactions compared to 2PC?",
        answer:
          "Two-Phase Commit (2PC) is a blocking protocol that locks database rows across multiple services, causing severe latency and availability bottlenecks. The Saga pattern breaks a distributed transaction into a sequence of autonomous local transactions. If one step fails, the Saga executes compensating transactions to undo previous steps, achieving eventual consistency without distributed locks.",
      },
      {
        question: "What is the Transactional Outbox pattern and why is it needed?",
        answer:
          "The Transactional Outbox pattern solves the dual-write problem where an application must update a database and publish an event to a message broker (like Kafka). By writing the domain event to an 'outbox' table in the same local database transaction, and using a Change Data Capture (CDC) tool like Debezium to stream events, you guarantee at-least-once delivery with zero data inconsistencies.",
      },
      {
        question: "How does Resilience4j Circuit Breaker transition between CLOSED, OPEN, and HALF_OPEN?",
        answer:
          "In CLOSED state, requests execute normally while failure rates are tracked over a sliding window. If the failure threshold (e.g. 50%) is breached, the circuit flips to OPEN, failing fast without calling the downstream service. After a cooldown duration, it enters HALF_OPEN, allowing a limited test set of requests through. If successful, it resets to CLOSED; otherwise, it returns to OPEN.",
      },
      {
        question: "How does enabling Virtual Threads in Spring Boot 3.2 impact high-concurrency microservices?",
        answer:
          "Setting spring.threads.virtual.enabled=true allows Tomcat to run each incoming HTTP request on an ultra-lightweight JVM virtual thread instead of an expensive OS platform thread. When blocking on database or HTTP calls, the carrier thread is freed to process other requests, scaling to tens of thousands of concurrent I/O requests without requiring reactive WebFlux.",
      },
    ],
    cta: {
      heading: "Practice Spring Boot & Microservices in PrepVisor AI Studio",
      subtext:
        "Tackle hands-on microservices architecture scenarios, debug @Transactional concurrency traps, and receive real-time senior evaluation from our AI evaluator.",
      buttonText: "Start Microservices Mock Round",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=spring_boot_microservices_interview",
      badge: "Spring Boot 3 & Architecture Evaluation Ready",
    },
  },
  {
    slug: "lru-cache-implementation",
    title: "LRU Cache Implementation: Step-by-Step in Java, Python & C++",
    seoTitle: "LRU Cache Implementation Guide | O(1) Operations in Java, Python & C++",
    metaDescription:
      "Complete step-by-step guide to implementing an LRU Cache with O(1) get and put operations. Includes Doubly Linked List + HashMap implementations in Java, Python, and C++.",
    keywords: [
      "lru cache implementation",
      "lru cache java step by step",
      "lru cache python collections ordereddict",
      "lru cache c++ list unordered_map",
      "leetcode 146 lru cache solution",
      "thread safe lru cache implementation",
    ],
    category: "Data Structures",
    readingTimeMinutes: 18,
    difficulty: "Intermediate",
    lastUpdated: "2026-09-20",
    author: {
      name: "PrepVisor Algorithms Team",
      role: "Competitive Programmers & FAANG Interview Coaches",
    },
    summary:
      "The LRU (Least Recently Used) Cache is one of the most frequently asked data structure questions at Meta, Google, Microsoft, and Apple (LeetCode 146). This guide provides step-by-step implementations in Java, Python, and C++ achieving strict O(1) time complexity, dummy sentinel node techniques, and thread-safety concurrency extensions.",
    sections: [
      {
        id: "problem-breakdown",
        title: "1. LRU Cache Problem Breakdown & Complexity Requirements",
        subtitle: "Why individual data structures fail and why a hybrid approach is required",
        content: `The LRU Cache problem asks you to design a fixed-capacity data structure that supports two operations:
- \`get(key)\`: Return the value if the key exists, otherwise return \`-1\`. Accessing an item marks it as the *most recently used*.
- \`put(key, value)\`: Update the value if the key exists, or insert the key-value pair. If the number of keys exceeds \`capacity\`, evict the *least recently used* key.
- **Core Constraint**: Both \`get\` and \`put\` must run in **strictly $O(1)$ average time complexity**.

### Why Single Data Structures Fail
- **Array / Dynamic List**: Provides $O(1)$ access by index, but search by key is $O(N)$ and moving an element to the front requires $O(N)$ shifts.
- **Singly Linked List**: Supports $O(1)$ insertion at the head, but searching for an arbitrary node is $O(N)$, and removing a node requires $O(N)$ traversal to find the preceding node pointer.
- **Standard Hash Map**: Provides $O(1)$ average key-value lookup, but maintains no sequential ordering of recency.

### The Dual Data Structure Solution
To achieve strict $O(1)$ for both operations, we combine two distinct data structures:
1. **Hash Map (\`Map<Key, Node>\`)**: Maps each key directly to its corresponding node memory pointer in the linked list, providing $O(1)$ lookup.
2. **Doubly Linked List**: Keeps nodes in recency order. Because each node has both \`prev\` and \`next\` pointers, removing an arbitrary node given its reference is strictly $O(1)$!`,
        architectureCallout: {
          title: "LRU Cache Architectural Blueprint",
          points: [
            { label: "Time Complexity (get)", value: "O(1) average lookup via Hash Map" },
            { label: "Time Complexity (put)", value: "O(1) insertion & O(1) eviction via Doubly Linked List" },
            { label: "Space Complexity", value: "O(Capacity) auxiliary memory" },
            { label: "Pointer Safety", value: "Dummy Head & Tail Sentinels (Zero Null Checks)" },
          ],
        },
        keyTakeaways: [
          "A Doubly Linked List is mandatory (not singly) because removing a node in O(1) requires access to node.prev.",
          "The HashMap must store pointers/references to the Doubly Linked List Node, not just the raw value.",
        ],
      },
      {
        id: "sentinel-nodes",
        title: "2. The Dummy Sentinel Node Technique (Head & Tail)",
        subtitle: "How dummy sentinels eliminate 90% of pointer manipulation bugs",
        content: `In a live coding interview, handling edge cases when inserting or removing nodes at the boundary of a linked list (empty list, 1 element, head eviction, tail eviction) leads to messy null checks:
\`\`\`java
if (head == null) { ... }
if (node == tail) { ... }
if (node.prev != null) { ... }
\`\`\`
Under interview stress, candidates frequently introduce NullPointerExceptions here.

### The Sentinel Technique
Initialize two permanent dummy nodes: \`head\` and \`tail\`.
- In an empty cache, connect \`head.next = tail\` and \`tail.prev = head\`.
- Real cached nodes always sit **strictly between** \`head\` and \`tail\`.
- **Head is the Most Recently Used (MRU)** position: freshly accessed or inserted nodes are placed right after \`head\`.
- **Tail is the Least Recently Used (LRU)** position: the node right before \`tail\` (\`tail.prev\`) is always the eviction candidate.

### The 4 Core O(1) Primitives
1. **\`addNode(Node node)\`**: Links \`node\` between \`head\` and \`head.next\`.
2. **\`removeNode(Node node)\`**: Unlinks \`node\` by connecting \`node.prev.next = node.next\` and \`node.next.prev = node.prev\`.
3. **\`moveToHead(Node node)\`**: Calls \`removeNode(node)\` followed by \`addNode(node)\`.
4. **\`popTail()\`**: Calls \`removeNode(tail.prev)\` and returns the evicted node so its key can be purged from the HashMap.`,
        keyTakeaways: [
          "With dummy head and tail sentinels, head.next and tail.prev are never null, eliminating all boundary conditional checks.",
          "Every node manipulation reduces to simple pointer swaps with zero risk of NullPointerExceptions.",
        ],
      },
      {
        id: "java-implementation",
        title: "3. Complete Production-Grade Java Implementation",
        subtitle: "Idiomatic object-oriented implementation with custom Node class",
        content: `Below is the complete, self-contained Java implementation of the LRU Cache matching LeetCode 146 requirements:`,
        codeBlock: {
          language: "java",
          caption: "Complete O(1) LRU Cache Implementation in Java with Dummy Sentinels",
          code: `public class LRUCache {

    // Doubly Linked List Node
    private static class Node {
        int key;
        int value;
        Node prev;
        Node next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private final int capacity;
    private final Map<Integer, Node> cache;
    private final Node head;
    private final Node tail;

    public LRUCache(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive");
        }
        this.capacity = capacity;
        this.cache = new HashMap<>(capacity);

        // Initialize dummy sentinels to eliminate null pointer conditionals
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        Node node = cache.get(key);
        if (node == null) {
            return -1;
        }
        // Move accessed node to head (most recently used)
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        Node existingNode = cache.get(key);
        if (existingNode != null) {
            // Update existing value and move to MRU head
            existingNode.value = value;
            moveToHead(existingNode);
        } else {
            Node newNode = new Node(key, value);
            cache.put(key, newNode);
            addNode(newNode);

            // If capacity exceeded, evict LRU tail
            if (cache.size() > capacity) {
                Node lru = popTail();
                cache.remove(lru.key);
            }
        }
    }

    // Helper: Insert node immediately after dummy head
    private void addNode(Node node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    // Helper: Unlink an arbitrary node in O(1)
    private void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // Helper: Move existing node to most-recently-used position
    private void moveToHead(Node node) {
        removeNode(node);
        addNode(node);
    }

    // Helper: Evict least-recently-used node right before dummy tail
    private Node popTail() {
        Node lru = tail.prev;
        removeNode(lru);
        return lru;
    }
}`,
        },
        keyTakeaways: [
          "The Node class MUST store both key and value so that when popTail() evicts a node, its key is known for cache.remove(key).",
          "Always handle the existing key update scenario in put() before checking capacity eviction.",
        ],
      },
      {
        id: "python-cpp",
        title: "4. Multi-Language Implementations: Python & Modern C++",
        subtitle: "How to write idiomatic LRU Cache in Python and C++20",
        content: `### Python Implementation (Using \`collections.OrderedDict\`)
In Python, \`collections.OrderedDict\` maintains insertion order and exposes \`move_to_end(key)\` and \`popitem(last=False)\`:
\`\`\`python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False) # Evicts LRU item (front)
\`\`\`

### C++20 Implementation (\`std::unordered_map\` + \`std::list\`)
In C++, use \`std::list\` (a doubly linked list) and \`std::unordered_map\` storing iterators. Use \`std::list::splice\` to relocate nodes in $O(1)$ without copying or memory reallocation:
\`\`\`cpp
#include <unordered_map>
#include <list>

class LRUCache {
private:
    int capacity;
    // List stores pair of {key, value}
    std::list<std::pair<int, int>> dll;
    // Map stores iterator pointing directly to node in dll
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;
        // Splice moves node to front of dll in O(1)
        dll.splice(dll.begin(), dll, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->second = value;
            dll.splice(dll.begin(), dll, it->second);
            return;
        }
        if (dll.size() == capacity) {
            int lruKey = dll.back().first;
            map.erase(lruKey);
            dll.pop_back();
        }
        dll.emplace_front(key, value);
        map[key] = dll.begin();
    }
};
\`\`\``,
        keyTakeaways: [
          "In C++, std::list::splice provides an O(1) zero-allocation node relocation primitive.",
          "In Python, knowing both OrderedDict and the raw Doubly Linked List approach demonstrates senior depth.",
        ],
      },
      {
        id: "concurrency-thread-safety",
        title: "5. Concurrency & Thread-Safety Extensions",
        subtitle: "Scaling LRU Cache across multiple concurrent threads",
        content: `In production services (like Google Guava or Caffeine cache), multiple threads access the cache concurrently. A naive \`synchronized\` wrapper on every method introduces a severe throughput bottleneck.

### The ReadWriteLock Trap in LRU Cache
Many candidates suggest using \`ReentrantReadWriteLock\`, assuming \`get()\` can use the read lock while \`put()\` uses the write lock.
- **The Catch**: In an LRU Cache, **\`get()\` is NOT a read-only operation**! \`get()\` must move the accessed node to the MRU head, mutating \`prev\` and \`next\` pointers. Therefore, \`get()\` requires a WRITE lock, defeating the entire purpose of \`ReadWriteLock\`!

### Scalable Concurrency Solutions
1. **Segmented Locking (Striped Locks)**: Divide the key space into $S$ independent segments (like legacy \`ConcurrentHashMap\`). Each segment has its own capacity and independent lock.
2. **Read Buffers & Asynchronous Eviction (The Caffeine Pattern)**:
   - When a thread calls \`get()\`, it performs a concurrent read on the Hash Table without acquiring any linked list lock.
   - The node access event is pushed onto a lightweight, lossy, lock-free ring buffer (MPSC queue).
   - A single maintenance thread (or worker) drains the ring buffer in batches and updates the eviction list, achieving tens of millions of concurrent operations per second!`,
        keyTakeaways: [
          "Never claim ReadWriteLock solves LRU cache concurrency without clarifying that get() mutates list pointers.",
          "Mention Caffeine Cache's ring buffer approach to score top marks in senior FAANG interviews.",
        ],
      },
      {
        id: "interview-follow-ups",
        title: "6. Common Interview Follow-Ups & Edge Cases",
        subtitle: "Handling TTL expiration, LFU comparison, and memory-bounded sizing",
        content: `Interviewers will often extend the standard LRU question with these follow-ups:

### 1. Adding Time-To-Live (TTL) Expiration
How do you support cache keys that expire after a specified duration?
- **Approach**: Add an \`expiresAt\` timestamp to the \`Node\`.
- **Lazy Expiration**: On \`get(key)\`, check if \`now > node.expiresAt\`. If expired, evict the node and return \`-1\`.
- **Active Cleanup**: Maintain a secondary Min-Heap (PriorityQueue) or time-wheel ordered by \`expiresAt\`, and run a periodic background cleanup task to purge expired entries before capacity fills up.

### 2. LRU vs LFU (Least Frequently Used)
- **LRU**: Evicts based on time since last access. Susceptible to cache pollution during one-off full-table scans.
- **LFU**: Evicts based on access frequency counter. Preserves frequently used items better, but requires more memory and historical frequency counters can become stale without age decay.`,
        keyTakeaways: [
          "Be prepared to explain how to augment LRU with TTL using lazy expiration and min-heap tracking.",
          "Recognize that LRU can suffer from cache pollution during sequential scans.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is a Doubly Linked List required instead of a Singly Linked List for LRU Cache?",
        answer:
          "To achieve strict O(1) eviction and node repositioning, removing an arbitrary node in the middle of the list requires instant access to the preceding node (node.prev) so pointers can be reconnected. In a Singly Linked List, finding the previous node requires an O(N) traversal.",
      },
      {
        question: "How do dummy head and tail sentinel nodes simplify LRU cache pointer manipulation?",
        answer:
          "Dummy head and tail sentinels act as permanent boundaries. The real cached nodes always sit strictly between them. This eliminates edge cases (such as inserting into an empty list, removing the only node, or boundary null pointer checks), reducing code complexity and preventing runtime NullPointerExceptions.",
      },
      {
        question: "Why does standard ReentrantReadWriteLock fail to scale for a concurrent LRU cache?",
        answer:
          "In a standard cache, get() is a read operation. However, in an LRU cache, get() mutates the list pointers to reposition the accessed node to the most recently used head. Consequently, get() requires a write lock, causing all concurrent reader threads to serialize and eliminating the concurrency benefits of ReadWriteLock.",
      },
      {
        question: "What is the difference between LRU (Least Recently Used) and LFU (Least Frequently Used)?",
        answer:
          "LRU evicts the item that was accessed the furthest in the past, regardless of how many times it was used before. LFU tracks access frequency and evicts the item with the lowest hit count. LFU is better at resisting cache pollution from one-off bulk scans, but requires more complex O(1) bookkeeping and frequency decay mechanisms.",
      },
      {
        question: "How can you add Time-To-Live (TTL) expiration to an LRU cache?",
        answer:
          "Add an expiresAt timestamp field to each cache node. Implement lazy expiration on get() (if current time exceeds expiresAt, delete the node and return -1) and active background expiration using a PriorityQueue (Min-Heap) sorted by expiresAt to periodically remove expired entries.",
      },
      {
        question: "How does Caffeine Cache achieve high-performance lock-free concurrent caching in Java?",
        answer:
          "Caffeine decouples reads from eviction mutations. Reads access a ConcurrentHashMap directly without locking. Node access events are recorded to a lock-free ring buffer (MPSC queue), which is drained in batches by a background maintenance thread to update eviction data structures without blocking concurrent client threads.",
      },
    ],
    cta: {
      heading: "Practice LRU Cache & Data Structure Drills in PrepVisor AI Studio",
      subtext:
        "Code O(1) LRU and LFU caches, test concurrency extensions, and receive real-time Big-O and edge-case feedback from our AI coding evaluator.",
      buttonText: "Solve LRU Cache Challenges",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=lru_cache_implementation",
      badge: "Hands-On Code Sandbox with Unit Tests Included",
    },
  },
  {
    slug: "system-design-notification-service",
    title: "System Design: How to Design a Notification System at Scale (SMS, Push, Email)",
    seoTitle: "System Design: How to Design a Notification System | SMS, Push & Email at Scale",
    metaDescription:
      "Architect a scalable, fault-tolerant notification service handling billions of notifications. Learn priority queues, idempotency, rate limiting, and third-party gateway integrations.",
    keywords: [
      "system design notification system",
      "notification service architecture",
      "how to design notification system interview",
      "notification deduplication idempotency",
      "apple apns twilio sendgrid architecture",
      "kafka priority queue notification system",
    ],
    category: "System Design",
    readingTimeMinutes: 24,
    difficulty: "Advanced",
    lastUpdated: "2026-09-20",
    author: {
      name: "PrepVisor Systems Engineering Team",
      role: "Staff Infrastructure Engineers & Interview Evaluators",
    },
    summary:
      "Designing a distributed Notification Service capable of delivering millions of push notifications, transactional SMS, and marketing emails is a premier system design interview challenge. This guide covers multi-channel vendor routing (APNs, FCM, Twilio, SendGrid), Kafka priority queues, distributed idempotency deduplication, rate limiting, and regulatory compliance.",
    sections: [
      {
        id: "requirements",
        title: "1. Clarifying Requirements & Notification Types",
        subtitle: "Channel protocols, priority tiers, and delivery guarantees",
        content: `A notification service is the central communication nervous system of any consumer or enterprise product. When designing it in an interview, clarify the multi-channel scope early:

**Supported Delivery Channels:**
- **iOS Push Notifications**: Apple Push Notification service (APNs) using HTTP/2 persistent connections and TLS provider certificates.
- **Android Push Notifications**: Firebase Cloud Messaging (FCM).
- **SMS**: Twilio, Infobip, AWS SNS (international delivery with dynamic carrier routing).
- **Email**: SendGrid, Resend, Amazon SES.

**Notification Priority Tiers:**
1. **Critical Transactional (P0)**: One-Time Passwords (OTP), 2-Factor Authentication codes, fraudulent login alerts. **SLA: < 2 seconds delivery**, zero queuing behind non-urgent traffic.
2. **Time-Sensitive Alerts (P1)**: Ride arrival updates, direct chat messages, flight gate changes. **SLA: < 30 seconds**.
3. **Marketing & Promotions (P2)**: Flash sale announcements, weekly digests, engagement reminders. **SLA: Delivered within hours during active waking hours**.

**Non-Functional Requirements:**
- **Scale**: Support **100 Million notifications per day** with sudden peak bursts.
- **High Availability (99.99%)**: System must not drop notifications during vendor outages.
- **Idempotency & Deduplication**: Prevent users from receiving duplicate SMS or push alerts during network retries.
- **User Preference Engine**: Strict adherence to user opt-outs, quiet hours, and legal regulations (GDPR, CAN-SPAM, TCPA).`,
        keyTakeaways: [
          "Never treat all notifications equally: strict multi-tier priority isolation is the single most important design decision.",
          "Distinguish between at-least-once delivery (standard message brokers) and effectively exactly-once delivery (achieved via client-side idempotency keys).",
        ],
      },
      {
        id: "capacity-estimation",
        title: "2. Back-of-the-Envelope Capacity Estimation",
        subtitle: "Calculating throughput, storage, and network bandwidth",
        content: `Always demonstrate concrete mathematical sizing to validate architectural choices.

**Throughput Calculations:**
- **Daily Volume**: 100 Million notifications/day.
- **Average QPS**:
  $$\\frac{100{,}000{,}000 \\text{ notifications}}{86{,}400 \\text{ seconds}} \\approx 1{,}160 \\text{ notifications/second}$$
- **Peak Burst Ratio**: 10x average (during flash sales, breaking news, or app-wide alerts).
- **Peak Ingress QPS**: $1{,}160 \\times 10 \\approx 11{,}600 \\text{ notifications/second}$.

**Storage Sizing:**
- **Metadata Payload**: User ID (UUID 16 bytes) + Channel ID (2 bytes) + Timestamp (8 bytes) + Template ID (8 bytes) + Status (4 bytes) + Idempotency Key (32 bytes) + Variables JSON (approx. 500 bytes) $\\approx 1 \\text{ KB}$ per record.
- **Daily Storage**: $100\\text{M} \\times 1 \\text{ KB} = 100 \\text{ GB/day}$.
- **90-Day Operational Log Retention**: $100 \\text{ GB} \\times 90 = 9 \\text{ TB}$. Easily managed by Amazon DynamoDB, Cassandra, or PostgreSQL partitioned by date.

**Egress Network Bandwidth:**
- At peak 11,600 notifications/sec $\\times 1 \\text{ KB} \\approx 11.6 \\text{ MB/sec} = 93 \\text{ Mbps}$. Network bandwidth will not be a bottleneck for the internal infrastructure.`,
        architectureCallout: {
          title: "Notification Platform Capacity Sizing",
          points: [
            { label: "Daily Notification Volume", value: "100 Million notifications / day" },
            { label: "Peak Ingress Throughput", value: "~11,600 notifications / second" },
            { label: "OTP Delivery SLA", value: "< 1.5 seconds end-to-end" },
            { label: "Operational Log Storage", value: "~9 TB (90-day retention in Cassandra/DynamoDB)" },
          ],
        },
        keyTakeaways: [
          "Highlight that peak burst handling (10x average) dictates message broker partition counts and worker autoscale limits.",
          "Partition operational history by date or user ID for cost-effective lifecycle archiving.",
        ],
      },
      {
        id: "high-level-architecture",
        title: "3. High-Level Architecture & End-to-End Flow",
        subtitle: "Decoupled microservice architecture with message brokers",
        content: `A direct synchronous call from microservices to third-party vendors (Twilio, SendGrid) is an anti-pattern. If Twilio's API experiences 500ms latency, upstream services hang and exhaust connection pools.

### The Decoupled Event-Driven Flow
1. **Client / Upstream Services**: Services (Order Service, Auth Service) send a notification request to the **Notification Gateway API**.
2. **Gateway Validation & Authentication**: Validates payload schema, verifies internal service authentication tokens, and checks rate limits.
3. **Idempotency Filter**: Queries a distributed Redis cluster using the request's \`idempotency_key\`. If already processed, the duplicate is dropped immediately.
4. **User Preference & Quiet Hours Filter**: Checks user notification preferences in a fast cache. If the user opted out of email or if marketing quiet hours are active, the event is filtered or rescheduled.
5. **Templating Engine**: Injects dynamic values (e.g. \`{{user_name}}\`, \`{{order_total}}\`) into localized, versioned notification templates.
6. **Partitioned Apache Kafka Message Queues**: Publishes events into isolated priority topics:
   - \`notifications.p0.transactional\`
   - \`notifications.p1.alerts\`
   - \`notifications.p2.marketing\`
7. **Specialized Worker Fleets**: Independent consumer worker groups pull messages from dedicated topics and call the respective vendor adapters (APNs, FCM, Twilio, SendGrid).
8. **Vendor Webhook Collectors**: Receives delivery receipts and bounce events from third-party vendors and updates analytics tables asynchronously.`,
        keyTakeaways: [
          "Decoupling the ingestion gateway from delivery workers using message queues guarantees zero notification loss even if third-party providers suffer outages.",
          "Use separate worker pools for different priorities to ensure marketing bulk jobs never starve transactional OTPs.",
        ],
      },
      {
        id: "deduplication-idempotency",
        title: "4. Deduplication, Idempotency & Exactly-Once Semantics",
        subtitle: "Preventing duplicate SMS charges and annoying multiple push alerts",
        content: `In distributed systems, network packets time out. If an upstream order service triggers a payment confirmation SMS and experiences a network glitch before receiving HTTP 200, it retries. Without idempotency, the user receives two identical SMS messages.

### The 3-Tier Idempotency Solution
1. **Deterministic Idempotency Key**:
   - The upstream service creates a unique key:
     \`idempotency_key = SHA256(user_id + event_type + entity_id)\`
     (e.g. \`SHA256("usr_99" + "ORDER_CONFIRMED" + "ord_10492")\`).
2. **Distributed Redis Atomic Lock**:
   - Before queueing or dispatching, the worker executes:
     \`SET notif:dedup:{key} "PROCESSING" NX EX 86400\`
   - If Redis returns \`nil\`, the key already exists and this event is a duplicate.
3. **Downstream Gateway Idempotency**:
   - Major providers like Stripe, SendGrid, and Twilio support an \`Idempotency-Key\` HTTP header. Pass the same key downstream so vendor network retries do not trigger duplicate charges.`,
        codeBlock: {
          language: "typescript",
          caption: "Notification Consumer & Idempotency Pipeline with Circuit Breaker",
          code: `interface NotificationEvent {
  idempotencyKey: string;
  userId: string;
  channel: "APNS" | "FCM" | "SMS" | "EMAIL";
  priority: "P0" | "P1" | "P2";
  payload: {
    title: string;
    body: string;
    metadata?: Record<string, unknown>;
  };
}

export class NotificationDispatcher {
  constructor(
    private readonly redis: RedisClient,
    private readonly vendorGateway: VendorGatewayClient,
    private readonly deadLetterQueue: DlqProducer
  ) {}

  async processNotification(event: NotificationEvent): Promise<void> {
    const dedupKey = \`notif:dedup:\${event.idempotencyKey}\`;

    // 1. Distributed Atomic Deduplication Check (24-hour TTL)
    const acquired = await this.redis.set(dedupKey, "PROCESSING", "NX", "EX", 86400);
    if (!acquired) {
      console.log(\`[DEDUP] Dropping duplicate notification: \${event.idempotencyKey}\`);
      return; // Already dispatched or in progress
    }

    try {
      // 2. Dispatch to Third-Party Provider (e.g. APNs, Twilio, SendGrid)
      await this.vendorGateway.sendWithRetry({
        channel: event.channel,
        recipient: event.userId,
        content: event.payload,
        maxRetries: event.priority === "P0" ? 3 : 1,
      });

      // 3. Mark deduplication key as successfully completed
      await this.redis.set(dedupKey, "DELIVERED", "KEEPTTL");
    } catch (error) {
      console.error(\`[DISPATCH_ERROR] Delivery failed for key \${event.idempotencyKey}\`, error);

      // 4. Dead Letter Queue for engineering inspection and alerting
      await this.deadLetterQueue.publish({
        failedEvent: event,
        failureReason: (error as Error).message,
        timestamp: new Date().toISOString(),
      });

      // Release key to allow subsequent retry if transient
      await this.redis.del(dedupKey);
      throw error;
    }
  }
}`,
        },
        keyTakeaways: [
          "Use deterministic idempotency keys derived from business entities rather than random UUIDs.",
          "Pass idempotency keys all the way through to third-party vendor APIs.",
        ],
      },
      {
        id: "worker-fleet-priority",
        title: "5. Worker Fleet Design, Priority Queues & Vendor Rate Limiting",
        subtitle: "Preventing rate limit throttling and managing delivery retries",
        content: `### 1. Dedicated Priority Worker Fleets
Never share worker threads between transactional OTPs and marketing campaigns:
- **P0 Workers**: Highly provisioned with minimal batch sizes for immediate dispatch.
- **P2 Workers**: Heavily batched consumers designed for maximum bulk throughput, configured to scale down automatically if downstream APIs show elevated error rates.

### 2. Vendor Rate Limiting & Account Ceilings
Third-party providers enforce strict throughput caps (e.g. Twilio may restrict an account to 500 SMS/sec; SendGrid may limit email dispatch to 1,000/sec).
- If your workers exceed this, vendors return HTTP 429 and drop subsequent requests.
- **Solution**: Workers use a central Redis Token Bucket per vendor account to throttle dispatch rates across all worker nodes.

### 3. Exponential Backoff with Jitter & Dead Letter Queues (DLQ)
When a vendor call fails:
- **Transient Failures (HTTP 500, Network Timeout)**: Retry with truncated exponential backoff and randomized jitter:
  $$\\text{Delay} = \\min(60, 2^{\\text{attempt}} + \\text{random\\_jitter})$$
- **Permanent Failures (HTTP 400, Invalid Phone Number, Unregistered Device Token)**: Do not retry. Route immediately to a **Dead Letter Queue (DLQ)** and deactivate the user's invalid device token in the database.`,
        keyTakeaways: [
          "Isolate priority queues so marketing emails never delay time-critical password reset OTPs.",
          "Implement Token Bucket rate limiters to respect third-party vendor API quotas.",
        ],
      },
      {
        id: "user-preferences-compliance",
        title: "6. User Preferences, Quiet Hours & Global Compliance",
        subtitle: "TCPA, CAN-SPAM, GDPR, and localized quiet hours",
        content: `A world-class notification architecture must treat legal compliance and user privacy as first-class citizens:

### 1. User Preference Data Model
Users can toggle notifications per category (Product Updates, Security Alerts, Billing, Marketing) and per channel (Email, SMS, Push). Security alerts are non-opt-outable.

### 2. Timezone-Aware Quiet Hours
Sending a marketing push notification at 3:00 AM local time causes immediate app uninstalls and negative app store ratings.
- The User Preferences Filter evaluates the recipient's timezone.
- If current recipient time is between 9:00 PM and 8:00 AM, marketing notifications are placed in a scheduled queue and delayed until 8:01 AM local time.

### 3. Legal Compliance Regulations
- **TCPA (Telephone Consumer Protection Act)**: In the US, SMS recipients who text "STOP" or "UNSUBSCRIBE" must be unsubscribed immediately. Process Twilio inbound webhooks synchronously to flip opt-out flags.
- **CAN-SPAM & GDPR**: Every marketing email must include a physical mailing address and an RFC 8058 compliant \`List-Unsubscribe\` one-click header.`,
        keyTakeaways: [
          "Respect recipient timezones for non-transactional marketing notifications.",
          "Process carrier STOP webhooks immediately to remain compliant with telecom regulations.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do you guarantee high-priority OTP notifications are never delayed by marketing campaigns?",
        answer:
          "Separate notifications into dedicated priority Kafka topics (e.g. notifications.p0.transactional vs notifications.p2.marketing) consumed by isolated worker fleets. Even if marketing topics have millions of pending messages, transactional workers pull exclusively from the P0 topic with zero latency contention.",
      },
      {
        question: "How do you prevent users from receiving duplicate push notifications or SMS?",
        answer:
          "Implement client-driven idempotency keys stored in a distributed Redis cache with atomic SET NX and a 24-hour TTL. In addition, pass the idempotency key to downstream vendor APIs (like Stripe, Twilio, SendGrid) so that transient network retries do not trigger duplicate dispatches.",
      },
      {
        question: "How does the notification service integrate with APNs and FCM?",
        answer:
          "The service maintains persistent HTTP/2 connections to Apple Push Notification service (APNs) using TLS provider certificates or JWT authentication tokens. For Android, it integrates with Firebase Cloud Messaging (FCM) v1 REST API. Device tokens are stored per user in the database, and when APNs/FCM returns Unregistered, the token is automatically deactivated.",
      },
      {
        question: "How do you handle third-party vendor rate limits and downtime (e.g., Twilio outage)?",
        answer:
          "Use a distributed Token Bucket in Redis to throttle outbound worker dispatch rates to the vendor's agreed QPS limit. For vendor outages, configure circuit breakers with multi-vendor failover (e.g., if Twilio fails, route SMS through Infobip or AWS SNS) and retry transient errors with exponential backoff and jitter.",
      },
      {
        question: "What is the Dead Letter Queue (DLQ) strategy for failed notifications?",
        answer:
          "When a notification exhausts its retry attempts (e.g., 3 retries with exponential backoff) or encounters a non-retryable error (e.g., invalid phone number or unparseable payload), it is moved to a Dead Letter Queue. DLQ messages trigger alerts and allow engineers to inspect, correct, and re-drive failed events.",
      },
      {
        question: "How do you implement localized quiet hours across global user timezones?",
        answer:
          "Store the recipient's timezone or inferred location in their profile. Before queueing non-urgent marketing notifications, check if the recipient's current local time falls between quiet hours (e.g. 9 PM to 8 AM). If so, compute the delay until 8:01 AM local time and schedule delivery via a delayed queue or scheduled Redis sorted set.",
      },
    ],
    cta: {
      heading: "Practice Notification System Design in PrepVisor Interactive Studio",
      subtext:
        "Design scalable multi-channel notification architectures, configure Kafka priority queues, and solve idempotency race conditions in our AI-powered interview studio.",
      buttonText: "Design Notification Service in Studio",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=system_design_notification_service",
      badge: "Interactive Multi-Channel System Architecture Canvas",
    },
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function generateArticleJsonLd(guide: Guide): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.metaDescription,
    image: "https://prepvisor.in/logo.png",
    author: {
      "@type": "Organization",
      name: guide.author.name,
      jobTitle: guide.author.role,
      url: "https://prepvisor.in",
    },
    publisher: {
      "@type": "Organization",
      name: "PrepVisor",
      url: "https://prepvisor.in",
      logo: {
        "@type": "ImageObject",
        url: "https://prepvisor.in/logo.png",
      },
    },
    datePublished: `${guide.lastUpdated}T08:00:00+05:30`,
    dateModified: `${guide.lastUpdated}T08:00:00+05:30`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://prepvisor.in/guides/${guide.slug}`,
    },
    keywords: guide.keywords.join(", "),
  };
}

export function generateFaqJsonLd(guide: Guide): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
