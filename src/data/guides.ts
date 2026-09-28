import type { GuideCategoryId } from "../config/guideCategories.ts"

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

export interface GuideReference {
  title: string;
  publisher: string;
  url: string;
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
  primaryCategory: GuideCategoryId;
  relatedGuideSlugs: string[];
  productPath: "/system-design" | "/coding-practice" | "/mock-interview";
  readingTimeMinutes: number;
  difficulty: "Intermediate" | "Advanced" | "All Levels";
  /** Manually update for meaningful content changes; do not infer on builds. */
  dateModified: string;
  /** Omit unless the original publication date is known and documented. */
  datePublished?: string;
  author: {
    name: string;
    role: string;
  };
  summary: string;
  quickAnswer?: string;
  keyTakeaways?: string[];
  references?: GuideReference[];
  sections: GuideSection[];
  faqs: GuideFaq[];
  cta: GuideCta;
}

export function isValidGuideDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
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
    primaryCategory: "system-design",
    relatedGuideSlugs: ["system-design-rate-limiter", "system-design-notification-service"],
    productPath: "/system-design",
    readingTimeMinutes: 20,
    difficulty: "Advanced",
    dateModified: "2026-09-18",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "This guide walks through a URL-shortening system design, including requirements, example capacity estimates, database schema, Base62 key generation, caching strategies, and failover trade-offs.",
    references: [
      { title: "HTTP Semantics (RFC 9110), Sections 15.4.2–15.4.3", publisher: "RFC Editor", url: "https://www.rfc-editor.org/rfc/rfc9110.html" },
      { title: "Scripting with Lua", publisher: "Redis Documentation", url: "https://redis.io/docs/latest/develop/programmability/eval-intro/" },
      { title: "Scaling with Redis Cluster", publisher: "Redis Documentation", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" },
    ],
    sections: [
      {
        id: "requirements",
        title: "1. Functional & Non-Functional Requirements",
        subtitle: "Clarifying scope before drawing a single box",
        content: `In an interview, clarify requirements before drawing an architecture. Treat the values below as scenario targets to discuss with the interviewer, not measured service performance.
        
**Functional Requirements:**
1. **URL Shortening**: Given a long URL, generate a unique, short alias (e.g. \`https://prepvisor.in/u/a8F9k2Z\`).
2. **Redirection**: When accessing a short URL, immediately redirect the user to the original long URL with high availability.
3. **Custom Aliases (Optional)**: Users should optionally pick a custom alias if available.
4. **Link Expiration (Optional)**: Short URLs expire after a default TTL (e.g., 2 or 5 years) or custom user timestamp.

For redirect status-code semantics, see [HTTP Semantics (RFC 9110), Sections 15.4.2–15.4.3](https://www.rfc-editor.org/rfc/rfc9110.html).

**Non-Functional Requirements:**
- **Latency target (example)**: Set a target such as **under 20 milliseconds** and clarify how it is measured.
- **Availability target (example)**: A scenario may specify **99.99%** availability; this is a requirement, not a guarantee.
- **Read/write workload (assumption)**: Explore a **100:1 to 500:1 read-to-write ratio** as an input to the design.
- **Non-Predictable URLs**: Short links must not be easily guessable to prevent enumeration attacks.`,
        keyTakeaways: [
          "Confirm the read/write ratio with the interviewer; any ratio used here is an assumption until confirmed.",
          "HTTP 301 denotes a permanent redirect and is heuristically cacheable; 302 denotes a temporary redirect. Explicit cache controls and client behavior affect caching and analytics.",
          "Ensure short tokens are non-guessable to protect private shared links.",
        ],
      },
      {
        id: "capacity-estimation",
        title: "2. Capacity Estimation & Back-of-the-Envelope Calculations",
        subtitle: "Quantifying traffic, storage, and memory bottlenecks",
        content: `EXAMPLE / ASSUMPTION — The following arithmetic illustrates one hypothetical five-year workload. Replace every input with requirements agreed during the interview; these are not measured TinyURL or PrepVisor traffic figures.

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
  *(This estimate excludes replication, indexes, storage-engine overhead, backups, and growth headroom.)*

**Cache Estimation (illustrative 80/20 assumption):**
- 20% of the URLs generate 80% of read traffic.
- Daily read requests = $4,000 \\times 86,400 \\approx 345 \\text{ Million requests/day}$.
- Daily cache requirement (20% of daily reads):
  $$0.20 \\times 345\\text{M} \\times 600 \\text{ Bytes} \\approx 41.4 \\text{ GB RAM}$$
  *(Payload estimate only: Redis object/allocator overhead, replication, fragmentation, and operational headroom are excluded. Validate deployment size.)*`,
        architectureCallout: {
          title: "Capacity Estimation Cheat Sheet",
          points: [
            { label: "Write QPS (example)", value: "~40 writes/sec normal, ~80 writes/sec at the assumed 2× peak" },
            { label: "Read QPS", value: "4,000 reads/sec (Normal), 8,000 reads/sec (Peak)" },
            { label: "5-Year Storage (example)", value: "3.6 TB before indexes, replication, and overhead" },
            { label: "Cache payload estimate (example)", value: "~42 GB under the stated 80/20 assumptions" },
            { label: "Read Bandwidth", value: "4,000 * 600 bytes = 2.4 MB/second" },
          ],
        },
      },
      {
        id: "key-generation",
        title: "3. Key Generation Strategy: Base62 vs Hashing",
        subtitle: "Hash-derived tokens and pre-generated keys: collision trade-offs",
        content: `A critical technical differentiator in this interview is how you generate the 7-character short token.

### Option A: Hashing (MD5 / SHA-256) + Base62
- Hash long URL using MD5 $\\rightarrow$ 128-bit hash $\\rightarrow$ Base62 encode $\\rightarrow$ take first 7 chars.
- **Trade-off**: Truncating a hash to a short token can produce collisions. The design needs collision detection and retry or another allocation strategy; the latency impact depends on implementation and workload.

### Option B: Dedicated Key Generation Service (KGS) with Pre-Generated Keys (Recommended)
- **Example token length:**
  Using Base62 characters (\`[a-z, A-Z, 0-9]\`):
  $$62^7 = 3,521,614,606,208 \\approx 3.52 \\text{ Trillion unique URLs}$$
  This is the theoretical token space before reserved values or operational constraints; it is not a forecast of capacity or lifetime.
- A standalone Key Generation Service generates random Base62 tokens offline and loads them in batches into memory.
- When an API server needs keys, it may request a block (for example, 10,000) from the KGS. A crash can orphan unused keys. Preventing duplicate allocation requires a uniqueness-enforced key space and exclusive, durable allocation coordination.`,
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
          "A pre-generated key pool can avoid hash-collision checks on the allocation path when key uniqueness and allocation are enforced correctly.",
          "Partitioning KGS keys across used and unused stores is one possible allocation design; atomicity depends on its implementation.",
        ],
      },
      {
        id: "high-level-architecture",
        title: "4. High-Level Architecture & End-to-End Flow",
        subtitle: "Connecting Load Balancer, Application Nodes, Redis Cache & Database",
        content: `EXAMPLE / ASSUMPTION — This flow uses illustrative traffic proportions and response times, not measured production behavior.

### Read Flow (illustrative read-heavy workload):
1. User clicks \`https://prepvisor.in/u/x8Kp2L9\`.
2. Request hits Route 53 (DNS) and resolves to an Application Load Balancer (ALB).
3. ALB forwards to stateless **Redirection API Workers**.
4. Worker checks **Redis Cache** by key \`x8Kp2L9\`:
   - **Cache hit (assumed 90%+)**: Returns a 302 response; measure latency in the target deployment.
   - **Cache miss (assumed remainder)**: Queries a database replica, populates Redis, and returns a 302 response.

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

**Sharding Strategy (one option for this example):**
- Partition by a hash of the short key to distribute records across shards:
  $$\\text{Shard ID} = \\text{Murmur3}(\\text{short\\_key}) \\pmod N$$
- Hash partitioning tends to spread keys, but does not guarantee uniform load or prevent hot spots for every workload.`,
      },
      {
        id: "fault-tolerance-spof",
        title: "6. Single Point of Failure (SPOF) & Fault Tolerance",
        subtitle: "What interviewers look for when testing your senior architectural maturity",
        content: `A common interview pitfall is presenting a happy-path architecture without disaster recovery.

1. **Redis Cache Crash**:
   - Under the illustrative 4,000-read-QPS workload, a cache failure can shift substantial read traffic to the database and risk overload.
   - **Mitigation**: Deploy Redis in Master-Replica Sentinel with auto-failover, and implement circuit breakers in API workers to gracefully throttle if DB connection pools saturate.
2. **KGS Crash**:
   - A standby KGS with an explicit leader/lease or allocation-coordination protocol can support failover; recovery time depends on the design.
3. **Database Write Master Failure**:
   - A database failover process may promote a replica. Recovery time and read availability depend on the database, replication mode, and application behavior; set and test a recovery objective.`,
        keyTakeaways: [
          "Redirect status, cache controls, and client behavior affect whether later requests reach the service for analytics; choose them to match the requirements.",
          "LRU is one cache eviction policy; evaluate it against the workload and alternatives.",
          "Lazy expiry checks are one option for expired URLs; periodic cleanup and retention requirements may also affect the design.",
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
          "HTTP 301 means the resource has moved permanently and is heuristically cacheable unless cache controls say otherwise. HTTP 302 means the move is temporary. Neither status alone guarantees analytics behavior: caching directives, clients, and the service's request flow affect whether later requests reach the origin. See RFC 9110, Sections 15.4.2–15.4.3.",
      },
      {
        question: "How do you handle expired short links efficiently?",
        answer:
          "For an illustrative large dataset, lazy expiry checks plus periodic cleanup are one option. On access, verify the timestamp, return the chosen expired-link response, and enqueue cleanup if appropriate.",
      },
      {
        question: "How do you prevent two users from receiving the same short URL?",
        answer:
          "A KGS can allocate pre-generated unique Base62 tokens to workers. Uniqueness depends on how the service creates, reserves, and allocates keys; no collision guarantee follows from the pattern alone.",
      },
      {
        question: "How do you protect the service from malicious spam and DDoS?",
        answer:
          "Implement Token Bucket rate limiting per IP address / API key, integrate Google Safe Browsing API on the write path to block phishing URLs, and enforce CAPTCHA on unauthenticated link creation.",
      },
      {
        question: "How can you estimate storage for a URL shortener?",
        answer:
          "Multiply the assumed record count by an estimated record size, then account separately for indexes, replication, backups, and storage-engine overhead. For example, 6 billion records at an assumed 600 bytes each yield 3.6 TB before those additional costs; this is scenario arithmetic, not a measured deployment size.",
      },
    ],
    cta: {
      heading: "Design TinyURL on PrepVisor AI Studio",
      subtext:
        "Practice sketching this architecture on the interactive system design canvas and work through its capacity and failure-mode trade-offs.",
      buttonText: "Launch Interactive System Design Studio",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=system_design_tinyurl",
      badge: "Interactive Practice Challenge Available",
    },
  },

  {
    slug: "java-concurrency-interview-questions",
    title: "Java Concurrency Interview Questions and Concepts",
    seoTitle: "Java Concurrency Interview Guide | Core Concepts and Virtual Threads",
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
    primaryCategory: "java-backend",
    relatedGuideSlugs: ["spring-boot-microservices-interview-questions"],
    productPath: "/coding-practice",
    readingTimeMinutes: 24,
    difficulty: "Intermediate",
    dateModified: "2026-09-19",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "Java concurrency is a useful topic for intermediate and senior backend interview preparation. This guide covers the Java Memory Model, happens-before consistency, synchronization, concurrent collections, and virtual threads, with code examples.",
    references: [
      { title: "JEP 444: Virtual Threads", publisher: "OpenJDK", url: "https://openjdk.org/jeps/444" },
      { title: "Java Language Specification, Chapter 17: Threads and Locks", publisher: "Oracle Java Documentation", url: "https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html" },
      { title: "Significant Changes in JDK 24: Synchronize Virtual Threads without Pinning", publisher: "Oracle Java Documentation", url: "https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html" },
      { title: "ThreadPoolExecutor (Java SE API)", publisher: "Oracle Java Documentation", url: "https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ThreadPoolExecutor.html" },
      { title: "ConcurrentHashMap (Java SE API)", publisher: "Oracle Java Documentation", url: "https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/concurrent/ConcurrentHashMap.html" },
      { title: "ConcurrentHashMap OpenJDK Source", publisher: "OpenJDK", url: "https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/ConcurrentHashMap.java" },
    ],
    sections: [
      {
        id: "jvm-memory-model",
        title: "1. Java Memory Model (JMM) & Thread Safety Fundamentals",
        subtitle: "Volatile, Atomicity, Visibility, and the Happens-Before Relationship",
        content: `The Java Language Specification defines the Java Memory Model's allowed visibility and ordering behaviors; it does not prescribe a particular hardware implementation. Interview answers should describe those guarantees rather than assume one mechanism. [JLS Chapter 17](https://docs.oracle.com/javase/specs/jls/se26/html/jls-17.html)

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
        content: `\`ConcurrentHashMap\` is a useful case study for Java concurrent collections. The details below describe OpenJDK implementation choices, not guarantees of the public API; check the source for the specific JDK release. [OpenJDK ConcurrentHashMap source](https://github.com/openjdk/jdk/blob/master/src/java.base/share/classes/java/util/concurrent/ConcurrentHashMap.java)

### Java 7 Architecture:
- Used **Segment-level locking** (default 16 segments). Each segment was a subclass of \`ReentrantLock\`.
- Concurrency level was fixed at creation time.

### Java 8+ Redesign:
- Eliminated Segment locks in favor of **Node-level bucket locking**.
- Uses **CAS** (\`compareAndSwapObject\`) for insertion when the bucket head is null.
- Uses fine-grained \`synchronized\` **only on the first node of the bucket** when resolving hash collisions.
- Converts bucket from Linked List ($O(n)$) to a Red-Black Balanced Tree (\`TreeBin\` - $O(\\log n)$) when bucket threshold exceeds **8 elements** and total table capacity $\\ge 64$.
- Retrievals generally do not entail locking; see the JDK API documentation for behavior and guarantees of the version in use.`,
        keyTakeaways: [
          "ConcurrentHashMap retrievals generally do not entail locking; see the JDK API documentation for version-specific behavior.",
          "Size calculation uses LongAdder (CounterCell array) to avoid CAS contention bottlenecks across threads.",
          "ConcurrentHashMap does not allow null keys or null values to eliminate ambiguity between absent keys and null values.",
        ],
      },
      {
        id: "virtual-threads-java21",
        title: "5. Virtual Threads (Project Loom) in Java",
        subtitle: "Virtual threads for high-concurrency, mostly waiting workloads",
        content: `Virtual threads became a permanent Java feature in JDK 21. They are useful to understand when evaluating thread-per-task designs; interview topics vary by role, team, and JDK version. [OpenJDK JEP 444](https://openjdk.org/jeps/444)

### Traditional Platform Threads vs Virtual Threads:
- **Platform threads**: typically map to OS threads; achievable counts depend on operating system, runtime settings, and available resources.
- **Virtual threads**: scheduled by the JDK over a smaller set of platform threads (M:N). They can make large numbers of mostly waiting tasks more practical, but feasible counts depend on workload, stack depth, heap, native resources, and the runtime.

### How Virtual Threads Work:
- When a virtual thread executes blocking I/O (e.g. \`Socket.read()\`, \`Thread.sleep()\`), the JVM automatically **unmounts** the virtual thread from its carrier thread and parks its continuation in heap memory.
- The carrier OS thread immediately processes another runnable virtual thread.
- When the I/O event completes, the JVM remounts the virtual thread onto an available carrier thread!

### Interview Warning: The Pinning Trap!
- In JDK 21–23, blocking in some \`synchronized\` constructs could pin a virtual thread to its carrier; native/foreign calls also have version-dependent constraints. JDK 24 changed monitor behavior so virtual threads can unmount while blocked in synchronized code. [Oracle JDK 24 migration guide](https://docs.oracle.com/en/java/javase/24/migrate/significant-changes-jdk-24.html)
- Diagnose pinning in the target JDK and workload before changing synchronization primitives; replacing \`synchronized\` with \`ReentrantLock\` is not a blanket requirement.`,
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
          "Under the Java Memory Model, volatile reads and writes have defined visibility and ordering effects but do not make compound operations such as count++ atomic. synchronized provides mutual exclusion and happens-before relationships; its runtime costs depend on contention and implementation.",
      },
      {
        question: "Why does ConcurrentHashMap not allow null keys or null values?",
        answer:
          "In a concurrent environment, if map.get(key) returned null, you could not distinguish whether the key was absent or the key was mapped to null without calling map.containsKey(key). In multithreaded systems, the key could be inserted or removed between the two calls, creating a critical race condition.",
      },
      {
        question: "What is thread pinning in Java Virtual Threads?",
        answer:
          "Pinning behavior depends on the JDK release and blocking operation. In JDK 21–23, certain monitor and native/foreign interactions could pin a virtual thread; JDK 24 changed monitor behavior. Check the documentation and diagnostics for the deployed JDK before changing locks.",
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
        "Practice multithreaded code patterns in the coding studio and reason through thread-safety and complexity trade-offs.",
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
    primaryCategory: "system-design",
    relatedGuideSlugs: ["system-design-tinyurl", "system-design-notification-service"],
    productPath: "/system-design",
    readingTimeMinutes: 22,
    difficulty: "Advanced",
    dateModified: "2026-09-20",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "This guide explores a distributed API rate limiter design, including Token Bucket, Leaky Bucket, Sliding Window Counter, synchronization across gateways, Redis scripting, capacity estimation, and failure-mode trade-offs.",
    quickAnswer:
      "An API rate limiter controls request volume by client, IP, or endpoint. For distributed gateways, a Token Bucket backed by Redis can allow controlled bursts. Place checks at the API Gateway and use atomic Redis Lua updates to avoid race conditions. When a limit is exceeded, return HTTP 429 with Retry-After; choose fail-open or fail-closed behavior for outages based on system priorities.",
    keyTakeaways: [
      "Clarify whether limits apply globally, per user, per IP, or per endpoint.",
      "Token Bucket permits controlled bursts; Leaky Bucket smooths output at a constant rate.",
      "Place rate limiting at the API Gateway to reject throttled traffic before it consumes backend resources.",
      "Use atomic Redis Lua scripts to avoid check-then-act races across gateway servers.",
      "Choose fail-open or fail-closed behavior deliberately, and use Redis server time where token refill depends on time.",
    ],
    references: [
      { title: "Scripting with Lua", publisher: "Redis Documentation", url: "https://redis.io/docs/latest/develop/programmability/eval-intro/" },
      { title: "TIME command", publisher: "Redis Documentation", url: "https://redis.io/docs/latest/commands/time/" },
      { title: "Scaling with Redis Cluster", publisher: "Redis Documentation", url: "https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/" },
      { title: "RFC 6585: Additional HTTP Status Codes", publisher: "RFC Editor", url: "https://www.rfc-editor.org/rfc/rfc6585.html" },
    ],
    sections: [
      {
        id: "requirements",
        title: "1. Functional & Non-Functional Requirements",
        subtitle: "Clarifying limits, granularity, and failure modes",
        content: `Before architecting a rate limiter, clarify the limit granularity and failure behavior. The numerical limits below are EXAMPLE / ASSUMPTION values for discussion, not universal tiers or measured service requirements.

**Functional Requirements:**
1. **Granular Rate Limiting**: Limit requests based on client identifier (authenticated user ID, API token) or IP address for unauthenticated traffic.
2. **Configurable Tiers**: Support multiple rate limiting tiers (e.g. Free Tier: 100 req/min; Enterprise: 5,000 req/min; Login Endpoint: 5 attempts/min to prevent brute-force attacks).
3. **Informative HTTP Headers (design choice)**: Consider documenting quota and reset headers (for example, \`X-RateLimit-Limit\`, \`X-RateLimit-Remaining\`, and \`X-RateLimit-Reset\`) for clients.
4. **Graceful Throttling**: When limits are breached, return **HTTP 429 (Too Many Requests)**; RFC 6585 permits a \`Retry-After\` header indicating how long to wait.

**Non-Functional Requirements:**
- **Latency target (example)**: A scenario might set an overhead target of **2 to 3 milliseconds**; define the measurement boundary and percentile.
- **Availability target (example)**: A scenario might specify **99.999%** availability; this is a target, not a guarantee.
- **Distributed State Synchronization**: Support hundreds of edge API gateway nodes querying a distributed, consistent token store.
- **Memory efficiency (example scale assumption)**: A scenario could ask the design to track hundreds of millions of active IP addresses and user accounts; estimate state from the chosen key and data representation, then validate it against deployment limits.`,
        keyTakeaways: [
          "Always confirm whether rate limiting applies globally, per user, per IP, or per endpoint.",
          "Establish the failure policy upfront: fail-open (prioritize user experience) vs fail-closed (prioritize backend protection).",
          "Document any rate-limit headers your API returns so clients can interpret quotas and retry timing.",
        ],
      },
      {
        id: "algorithms",
        title: "2. Algorithm Comparison: Token Bucket vs Leaky Bucket vs Sliding Window",
        subtitle: "Selecting a rate-limiting algorithm for the workload",
        content: `Compare rate-limiting algorithms against the traffic shape, state model, and failure requirements of the system being designed:

### 1. Token Bucket
- **Mechanism**: A bucket holds up to a maximum of $b$ tokens. Tokens are continuously added at a fixed rate of $r$ tokens per second. Each incoming request consumes 1 token. If the bucket is empty, the request is dropped (or throttled).
- **Burst Behavior**: **Allows controlled bursts**. If the bucket is full, up to $b$ requests can be processed immediately in a single instant.
- **Memory Footprint**: Extremely compact ($O(1)$ space). You only need to store two numbers per user: the remaining token count and the last refill timestamp.

### 2. Leaky Bucket (Traffic Shaping)
- **Mechanism**: Incoming requests enter a FIFO queue of fixed capacity. Requests are pulled from the queue and processed at a constant, fixed rate (the 'leak'). If the queue is full, incoming requests overflow and are discarded.
- **Burst Behavior**: **Zero burst tolerance**. Flattens traffic spikes into a smooth, steady output stream.
- **Trade-off**: Not ideal for general user-facing APIs where bursty web traffic is normal. However, it is ideal for egress traffic shaping when calling downstream legacy services that cannot tolerate sudden spikes.

### 3. Fixed Window Counter
- **Mechanism**: Divides time into fixed windows (e.g. 1 minute from 12:00 to 12:01). A counter increments with each request.
- **The Boundary Burst Trap**: A client can send 100 requests at 12:00:59 and another 100 requests at 12:01:01. In a 2-second interval, 200 requests were processed, doubling the intended rate limit!

### 4. Sliding Window Log
- **Mechanism**: Stores the epoch timestamp of every request in a sorted set (such as Redis ZSET). When a request arrives, all timestamps older than \`now - window_size\` are purged, and the remaining elements are counted.
- **Trade-off**: Tracks requests in the configured rolling window without the fixed-window boundary approximation, but uses $O(N)$ state for the requests in that window. Size and protect the state store for the expected workload.

### 5. Sliding Window Counter (weighted estimate)
- **Mechanism**: Combines the fixed window of the previous interval and the current interval using a weighted formula:
  $$\\text{Estimated Count} = \\text{Previous Window Count} \\times (1 - \\text{elapsed fraction}) + \\text{Current Window Count}$$
- **Trade-off**: Uses constant state per client for a fixed number of windows and estimates usage across a boundary. Accuracy depends on traffic distribution and assumptions; no universal error rate is implied here.`,
        architectureCallout: {
          title: "Rate Limiting Algorithm Comparison Summary",
          points: [
            { label: "Token Bucket", value: "O(1) state per client | Permits configured bursts" },
            { label: "Leaky Bucket", value: "Queue-based | Can shape output toward a configured rate" },
            { label: "Fixed Window", value: "O(1) Memory | Boundary Spike Flaw | Simple Counters Only" },
            { label: "Sliding Window Counter", value: "Constant state per client for a fixed number of windows | Approximate count" },
          ],
        },
        keyTakeaways: [
          "Token Bucket is one option when controlled bursts are part of the requirement; choose an algorithm based on the desired traffic behavior.",
          "Consider the per-request state cost of a Sliding Window Log and its implications under high traffic.",
        ],
      },
      {
        id: "architecture",
        title: "3. High-Level Architecture & Gateway Placement",
        subtitle: "Where should the rate limiter live in the infrastructure?",
        content: `In a modern microservices architecture, placing the rate limiter in individual application services causes duplication and wastes application CPU cycles.

**Recommended Topology: Edge API Gateway with Distributed Cache**
1. **Client Request**: The mobile app or third-party client makes an HTTPS call to \`api.prepvisor.in\`.
2. **Reverse Proxy / API Gateway**: A selected gateway can terminate TLS, authenticate JWTs or API keys, and extract the client identifier.
3. **Rate Limiter Middleware**: Before routing to backend microservices, the gateway queries an in-memory distributed cache cluster (**Redis Cluster**).
4. **Decision Evaluation**:
   - **Allowed**: Gateway appends headers (\`X-RateLimit-Remaining: 42\`) and proxies the request to the upstream target service.
   - **Throttled**: Gateway immediately short-circuits with **HTTP 429 Too Many Requests**, payload \`{"error": "rate_limit_exceeded", "retry_after": 6}\`, saving backend compute.`,
        keyTakeaways: [
          "Placing rate limiting at the API Gateway prevents unauthorized or throttled traffic from saturating downstream backend databases.",
          "Consider connection reuse between API gateways and Redis, then measure end-to-end latency in the target deployment.",
        ],
      },
      {
        id: "concurrency-lua",
        title: "4. Distributed Concurrency & The Race Condition Trap",
        subtitle: "Why naive GET + SET fails and Redis Lua scripts provide atomic execution",
        content: `A useful concurrency question is: **"What happens when two concurrent requests arrive at different gateway servers simultaneously?"**

### The Race Condition Trap (Check-then-Act)
Suppose a user has 1 token remaining.
1. Server A receives Request 1, calls \`GET user:123\`, and reads \`tokens = 1\`.
2. Server B receives Request 2, calls \`GET user:123\`, and also reads \`tokens = 1\`.
3. Server A calculates \`tokens - 1 = 0\` and writes \`SET user:123 tokens=0\`.
4. Server B calculates \`tokens - 1 = 0\` and writes \`SET user:123 tokens=0\`.
**Result**: Both requests can succeed even though only 1 token was available. Under a high-throughput workload (for example, an assumed 50,000 requests/second), the race can cause quota overruns.

### The Solution: Redis Lua Scripts
Redis guarantees atomic script execution: while a script runs, other server activity is blocked. Keep scripts short because they occupy the server during execution. The following is an illustrative Token Bucket script, not a production-ready implementation. [Redis scripting documentation](https://redis.io/docs/latest/develop/programmability/eval-intro/)`,
        codeBlock: {
          language: "lua",
          caption: "Illustrative Redis Lua Script for an Atomic Token Bucket Update",
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
        subtitle: "Back-of-the-envelope capacity calculation (example assumptions)",
        content: `EXAMPLE / ASSUMPTION — The following values are hypothetical inputs for demonstrating a sizing method, not observed user counts, Redis object sizes, or benchmark results.

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
- **Interpretation**: The simple estimate is 6.4 GB of payload under these assumptions. Redis overhead, allocator behavior, replication, and headroom are omitted, so this arithmetic does not establish a suitable node size.

**Network Bandwidth:**
- $50{,}000 \\text{ QPS} \\times 150 \\text{ bytes per Lua payload} \\approx 7.5 \\text{ MB/sec}$.
- $7.5 \\text{ MB/sec} = 60 \\text{ Mbps}$ at the assumed inputs, excluding protocol overhead; network suitability depends on the deployment and competing traffic.`,
        architectureCallout: {
          title: "Rate Limiter Capacity Sizing Blueprint",
          points: [
            { label: "Peak ingress (example)", value: "50,000 requests/sec assumed" },
            { label: "Latency target (example)", value: "< 2.5 ms, to be measured" },
            { label: "Payload estimate (example)", value: "~6.4 GB under stated assumptions, excluding overhead" },
            { label: "Network payload (example)", value: "~7.5 MB/sec at assumed QPS and payload size" },
          ],
        },
        keyTakeaways: [
          "Explain which overheads the estimate omits before drawing conclusions about deployment feasibility.",
          "Use Redis cluster sharding (hash slots based on client ID) to distribute QPS load across multiple Redis nodes.",
        ],
      },
      {
        id: "edge-cases-resilience",
        title: "6. Edge Cases, Multi-Tier Limits & Failover Resilience",
        subtitle: "Bulletproofing against DDoS, clock drift, and cache outages",
        content: `Discuss operational resilience and failure modes explicitly:

### 1. The Clock Skew Problem
In distributed environments, server system clocks drift by milliseconds (NTP synchronization skew). If API Gateways pass their local machine timestamp to Redis, race conditions and negative time deltas can corrupt token refills.
- **One option**: Use Redis \`TIME\` within the script to obtain a timestamp from the Redis server handling that operation. This avoids comparing gateway-supplied timestamps for the operation; it does not synchronize clocks across Redis nodes. [Redis TIME command](https://redis.io/docs/latest/commands/time/)

### 2. Multi-Tier Rate Limiting Defense
A single rate limiter cannot solve all security and operational problems. Employ a multi-tier defense:
1. **L1 Edge Protection**: An edge provider or managed DDoS protection service may filter traffic before it reaches the application network.
2. **L2 API Gateway Rate Limiting (Token Bucket in Redis)**: Per-user and per-API-key quotas to enforce billing plans.
3. **L3 Service-Level Circuit Breakers**: Protect internal databases and microservices from cascading failures if a specific endpoint experiences unexpected load.

### 3. Cache Outage: Fail-Open vs Fail-Closed
What happens if the Redis cluster crashes or network partitions occur?
- **Fail-Closed**: Reject requests when the limiter is unavailable; this preserves the configured limit but may deny legitimate requests.
- **Fail-Open**: Allow requests when the limiter is unavailable; this favors availability but can expose downstream services to excess traffic. Choose per endpoint and risk model.`,
        keyTakeaways: [
          "Consider a circuit breaker around Redis calls and select failure behavior according to endpoint security and availability requirements.",
          "Defend against clock drift by relying on Redis server time rather than gateway application clocks.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is the primary difference between Token Bucket and Leaky Bucket?",
        answer:
          "Token Bucket can allow bursts up to its configured capacity while enforcing a longer-term refill rate. A Leaky Bucket can smooth output when paired with a queue; exact behavior depends on implementation and configuration.",
      },
      {
        question: "How do you prevent race conditions in a distributed rate limiter?",
        answer:
          "Separate Redis GET and SET operations can interleave and create check-then-act races. A short Redis Lua script can perform the check and update atomically; Redis blocks other server activity while the script runs. See Redis scripting documentation.",
      },
      {
        question: "Where can a rate limiter be positioned in a microservice architecture?",
        answer:
          "An edge gateway can reject requests before they consume application resources. Service-level limits may also be useful for internal calls or specific resources; place controls according to the threat model and architecture.",
      },
      {
        question: "What HTTP status code and response headers should be returned when rate limited?",
        answer:
          "HTTP 429 indicates that the client has sent too many requests; RFC 6585 says a response may include Retry-After. Other rate-limit headers are design choices and should be documented consistently by the API.",
      },
      {
        question: "Should a rate limiter fail open or fail closed during a Redis outage?",
        answer:
          "Choose fail-open or fail-closed behavior per endpoint. Fail-open favors availability but can expose downstream services to excess traffic; fail-closed preserves the limit but can reject legitimate traffic during an outage.",
      },
      {
        question: "How do you handle clock drift across distributed rate limiting servers?",
        answer:
          "Redis TIME returns the current time from the Redis server handling the command. It avoids relying on a gateway-provided timestamp for that operation, but it does not establish globally synchronized time across servers.",
      },
    ],
    cta: {
      heading: "Practice Rate Limiter System Design in PrepVisor Interactive Studio",
      subtext:
        "Explore a distributed rate limiter design, compare bucket algorithms, and reason through concurrent request handling in the system design studio.",
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
    primaryCategory: "java-backend",
    relatedGuideSlugs: ["java-concurrency-interview-questions"],
    productPath: "/system-design",
    readingTimeMinutes: 26,
    difficulty: "Advanced",
    dateModified: "2026-09-20",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "This guide reviews Spring Boot and microservices topics, including proxy-based @Transactional behavior, distributed transaction patterns, resilience, tracing, and Java virtual threads.",
    references: [
      { title: "Using @Transactional", publisher: "Spring Framework Documentation", url: "https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/declarative/annotations.html" },
      { title: "Rolling Back a Declarative Transaction", publisher: "Spring Framework Documentation", url: "https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/declarative/rolling-back.html" },
      { title: "Virtual Threads", publisher: "OpenJDK", url: "https://openjdk.org/jeps/444" },
      { title: "Core Features (Spring Boot 3.2)", publisher: "Spring Boot Documentation", url: "https://docs.spring.io/spring-boot/docs/3.2.5/reference/html/features.html" },
      { title: "REST Clients", publisher: "Spring Framework Documentation", url: "https://docs.spring.io/spring-framework/reference/6.2/integration/rest-clients.html" },
    ],
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
        subtitle: "Four transaction pitfalls to understand",
        content: `The \`@Transactional\` annotation looks simple, but hides several subtle traps that frequently cause silent data corruption or database connection pool exhaustion in production.

### Trap 1: The Self-Invocation Proxy Bypass
If method \`saveUser()\` calls \`@Transactional public void updateUserRecords()\` inside the same service class, **no transaction is created**.
- **Root Cause**: Spring wraps the service bean with a dynamic proxy. When an external caller calls \`saveUser()\`, the proxy is invoked. But internal calls within the same class invoke \`this.updateUserRecords()\`, completely bypassing the proxy and its transaction interceptor.
- **Fix**: Inject the service into itself via \`@Lazy\`, extract the transactional logic to a dedicated helper service, or use programmatic transactions via \`TransactionTemplate\`.

### Trap 2: Default Exception Rollback Behavior
By default, Spring's declarative transaction infrastructure rolls back for unchecked exceptions (\`RuntimeException\`) and \`Error\`, but not checked exceptions. Rollback rules can be customized. [Spring rollback documentation](https://docs.spring.io/spring-framework/reference/6.2/data-access/transaction/declarative/rolling-back.html)
- **Example override**: If checked exceptions should trigger rollback, declare an explicit rule such as:
  \`@Transactional(rollbackFor = Exception.class)\`

### Trap 3: Holding Connections During Remote I/O (Connection Starvation)
Long-running external HTTP, gRPC, or file operations inside a database transaction can extend resource-holding time. With common JDBC transaction setups, a connection is held once acquired; exact acquisition timing depends on the transaction manager and data-access behavior. A slow dependency can increase connection-pool pressure, so measure the workload and pool limits.

### Trap 4: Transaction Propagation Pitfalls
- **\`REQUIRED\` (Default)**: Joins an existing transaction if one exists; creates a new one if not. If a child method throws a caught exception, the transaction is marked *rollback-only*, causing the parent method to fail with \`UnexpectedRollbackException\` on commit.
- **\`REQUIRES_NEW\`**: Suspends the current outer transaction, opens an independent physical transaction, and acquires a **second** database connection from the pool. Using \`REQUIRES_NEW\` carelessly can cause deadlock in connection pools!`,
        keyTakeaways: [
          "Choose explicit rollback rules when checked-exception behavior requires them.",
          "Keep long external I/O outside database transactions where practical; otherwise evaluate transaction duration and connection-pool pressure.",
        ],
      },
      {
        id: "resilience4j",
        title: "3. Microservices Resilience: Circuit Breakers with Resilience4j",
        subtitle: "Protecting distributed services from cascading failures",
        content: `In a microservices ecosystem, if Downstream Service C experiences high latency, Upstream Service B exhausts its thread pool waiting for responses, cascading the failure to Upstream Service A and taking down the entire system.

### Circuit Breaker State and Trade-offs
A circuit breaker can stop repeated calls to an unhealthy dependency and allow limited test calls after a configured wait. Library behavior, thresholds, and fallback handling depend on configuration.

### Circuit Breaker State Machine
1. **CLOSED**: Normal state. All requests flow directly to the downstream service. Resilience4j tracks call outcomes (success/failure/slow call) in a sliding window (e.g., last 100 calls).
2. **OPEN**: If the failure rate exceeds the threshold (e.g. > 50%), the circuit transitions to OPEN. All subsequent requests fail fast immediately, executing an optional fallback method without touching the downstream service.
3. **HALF_OPEN**: After a configured duration (\`waitDurationInOpenState = 10s\`), the circuit enters HALF_OPEN. It allows a trial number of requests (e.g. 10 calls) to pass through. If they succeed, the circuit resets to CLOSED; if any fail, it reverts back to OPEN.`,
        keyTakeaways: [
          "Use sliding window metrics (count-based or time-based) to detect degradation before complete downstream failure.",
          "Consider an explicit fallback or degraded response where it is safe for the operation.",
        ],
      },
      {
        id: "distributed-transactions",
        title: "4. Distributed Transactions: Saga Pattern vs 2-Phase Commit",
        subtitle: "Maintaining data consistency across autonomous microservice databases",
        content: `In microservices, each service owns its private database. You cannot use a single SQL transaction across Order Service (PostgreSQL) and Payment Service (MongoDB).

### 2-Phase Commit (2PC / XA) Trade-offs
Two-phase commit coordinates a prepare and commit decision across transaction participants. If the coordinator or a participant becomes unavailable, prepared work may remain in doubt until recovery, depending on the resource manager and protocol implementation. This creates availability and operational trade-offs compared with local transactions and sagas.

### The Saga Pattern
A Saga is a sequence of local transactions where each service updates its internal database and publishes a domain event. If any step fails, the Saga triggers **Compensating Transactions** that undo previous operations in reverse order.

| Approach | Mechanics | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Choreography** | Event-driven. Services listen to Kafka events and trigger local actions. | Simple, decentralized, loose coupling. | Difficult to trace workflows; cyclic dependency risk. |
| **Orchestration** | A centralized coordinator (e.g. OrderSagaManager) sends command messages to services. | Clear state machine, easy monitoring, explicit rollback logic. | Additional coordinator component to maintain. |

### The Transactional Outbox Pattern
How can an application avoid a direct dual write between database state and a broker message?
- Write both the business record and an outbox event into the **same local database transaction**.
- A change-data-capture tool or asynchronous relay publishes outbox events to the broker. Delivery, retry, ordering, and duplicate behavior depend on the relay and broker configuration.`,
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
     * Persists the business change and outbox row in the same local DB transaction.
     * A separate relay publishes the committed outbox event to the broker.
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
In Spring Boot 3.2 with Java 21+, virtual threads can be enabled with this configuration property. Confirm the runtime requirements in the versioned [Spring Boot 3.2 documentation](https://docs.spring.io/spring-boot/docs/3.2.5/reference/html/features.html):
\`\`\`properties
spring.threads.virtual.enabled=true
\`\`\`
- The virtual-thread option changes the request-thread strategy; confirm the exact behavior and configuration for the Spring Boot version in use.
- Virtual threads can improve resource use for workloads with many blocking operations, but do not remove CPU, connection-pool, downstream-service, or memory limits. They do not guarantee a particular concurrency level or throughput.

### 2. The Modern RestClient
Spring Framework 6.1 introduced \`RestClient\`, a synchronous HTTP client with a fluent API. Select a client based on the application's requirements and framework version; this is not a blanket migration requirement. [Spring REST clients](https://docs.spring.io/spring-framework/reference/6.2/integration/rest-clients.html).`,
        keyTakeaways: [
          "Virtual threads offer a thread-per-task programming model for suitable blocking workloads; evaluate them against the application's resource limits and framework version.",
          "Use RestClient for new synchronous HTTP integrations in Spring Boot 3.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why doesn't @Transactional rollback when a checked exception is thrown?",
        answer:
          "By default, Spring rolls back for unchecked exceptions and Errors, but not checked exceptions. Configure explicit rollback rules when the application requires different behavior; verify the rules for the Spring version in use.",
      },
      {
        question: "What is the self-invocation issue in Spring @Transactional?",
        answer:
          "Spring applies transactional behavior using dynamic AOP proxies. When a method in a service calls another @Transactional method within the same service class using this.method(), the call bypasses the Spring proxy, meaning no transaction interceptor is triggered and the target method runs without transactional guarantees.",
      },
      {
        question: "How does the Saga pattern solve distributed transactions compared to 2PC?",
        answer:
          "Two-phase commit coordinates a commit decision across participants and can leave prepared work in doubt during failures until recovery. A Saga composes local transactions and may use compensating actions; it changes the consistency and recovery model rather than providing the same atomicity as a single database transaction.",
      },
      {
        question: "What is the Transactional Outbox pattern and why is it needed?",
        answer:
          "A transactional outbox writes the domain event in the same local transaction as the state change, then a relay publishes it. This avoids a direct dual-write gap, but delivery guarantees, duplicate handling, and ordering depend on the relay and broker configuration.",
      },
      {
        question: "How does Resilience4j Circuit Breaker transition between CLOSED, OPEN, and HALF_OPEN?",
        answer:
          "In CLOSED state, requests execute normally while failure rates are tracked over a sliding window. If the failure threshold (e.g. 50%) is breached, the circuit flips to OPEN, failing fast without calling the downstream service. After a cooldown duration, it enters HALF_OPEN, allowing a limited test set of requests through. If successful, it resets to CLOSED; otherwise, it returns to OPEN.",
      },
      {
        question: "How does enabling Virtual Threads in Spring Boot 3.2 impact high-concurrency microservices?",
        answer:
          "In supported Spring Boot versions, spring.threads.virtual.enabled=true selects virtual threads for supported request handling. This can help with blocking workloads, but achievable concurrency depends on database pools, downstream services, CPU, memory, and the deployed JDK; it is not a throughput guarantee.",
      },
    ],
    cta: {
      heading: "Practice Spring Boot & Microservices in PrepVisor AI Studio",
      subtext:
        "Work through microservices architecture scenarios and examine transaction, resilience, and distributed-consistency trade-offs.",
      buttonText: "Start Microservices Mock Round",
      actionUrl:
        "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=spring_boot_microservices_interview",
      badge: "Spring Boot 3 & Architecture Evaluation Ready",
    },
  },
  {
    slug: "lru-cache-implementation",
    title: "LRU Cache Implementation: Step-by-Step in Java, Python & C++",
    seoTitle: "LRU Cache Implementation Guide | Average O(1) Operations in Java, Python & C++",
    metaDescription:
      "Step-by-step guide to implementing an LRU cache with expected average O(1) get and put operations under typical hash-map assumptions. Includes doubly linked list and hash map implementations in Java, Python, and C++.",
    keywords: [
      "lru cache implementation",
      "lru cache java step by step",
      "lru cache python collections ordereddict",
      "lru cache c++ list unordered_map",
      "leetcode 146 lru cache solution",
      "thread safe lru cache implementation",
    ],
    primaryCategory: "dsa",
    relatedGuideSlugs: ["java-concurrency-interview-questions"],
    productPath: "/coding-practice",
    readingTimeMinutes: 18,
    difficulty: "Intermediate",
    dateModified: "2026-09-20",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "This guide walks through an LRU cache implementation in Java, Python, and C++, using a hash map and a doubly linked list, with notes on complexity and thread-safety trade-offs.",
    references: [
      { title: "LinkedHashMap (Java SE API)", publisher: "Oracle Java Documentation", url: "https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/util/LinkedHashMap.html" },
    ],
    sections: [
      {
        id: "problem-breakdown",
        title: "1. LRU Cache Problem Breakdown & Complexity Requirements",
        subtitle: "Why individual data structures fail and why a hybrid approach is required",
        content: `The LRU Cache problem asks you to design a fixed-capacity data structure that supports two operations:
- \`get(key)\`: Return the value if the key exists, otherwise return \`-1\`. Accessing an item marks it as the *most recently used*.
- \`put(key, value)\`: Update the value if the key exists, or insert the key-value pair. If the number of keys exceeds \`capacity\`, evict the *least recently used* key.
- **Typical target**: Both \`get\` and \`put\` can have expected average $O(1)$ time when hash-map operations are expected average $O(1)$ and list updates use known node references.

### Why Single Data Structures Fail
- **Array / Dynamic List**: Provides $O(1)$ access by index, but search by key is $O(N)$ and moving an element to the front requires $O(N)$ shifts.
- **Singly Linked List**: Supports $O(1)$ insertion at the head, but searching for an arbitrary node is $O(N)$, and removing a node requires $O(N)$ traversal to find the preceding node pointer.
- **Standard Hash Map**: Provides $O(1)$ average key-value lookup, but maintains no sequential ordering of recency.

### The Dual Data Structure Solution
To get expected average $O(1)$ lookup plus constant-time list updates, combine two data structures:
1. **Hash Map (\`Map<Key, Node>\`)**: Maps each key to its node in the linked list. Lookup is expected average $O(1)$ under typical hash distribution assumptions.
2. **Doubly Linked List**: Keeps nodes in recency order. With a direct node reference, unlinking or moving that node takes constant time.`,
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
        subtitle: "How dummy sentinels simplify pointer manipulation",
        content: `Handling edge cases when inserting or removing nodes at linked-list boundaries (empty list, one element, head eviction, tail eviction) can require additional null checks:
\`\`\`java
if (head == null) { ... }
if (node == tail) { ... }
if (node.prev != null) { ... }
\`\`\`
Sentinel nodes provide permanent boundaries, which can simplify these cases and reduce conditional branches.

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
          "In C++, std::list::splice relocates list elements without copying their values; consult the selected standard-library documentation for complexity and allocator requirements.",
          "In Python, knowing both OrderedDict and the raw Doubly Linked List approach demonstrates senior depth.",
        ],
      },
      {
        id: "concurrency-thread-safety",
        title: "5. Concurrency & Thread-Safety Extensions",
        subtitle: "Scaling LRU Cache across multiple concurrent threads",
        content: `Concurrent cache implementations need to coordinate concurrent access. A single \`synchronized\` wrapper can limit parallelism when those methods are contended; the impact depends on workload and implementation.

### The ReadWriteLock Trap in LRU Cache
Many candidates suggest using \`ReentrantReadWriteLock\`, assuming \`get()\` can use the read lock while \`put()\` uses the write lock.
- **The Catch**: In an LRU Cache, **\`get()\` is NOT a read-only operation**! \`get()\` must move the accessed node to the MRU head, mutating \`prev\` and \`next\` pointers. Therefore, \`get()\` requires a WRITE lock, defeating the entire purpose of \`ReadWriteLock\`!

### Scalable Concurrency Solutions
1. **Segmented Locking (Striped Locks)**: Divide the key space into $S$ independent segments (like legacy \`ConcurrentHashMap\`). Each segment has its own capacity and independent lock.
2. **Buffered or approximate eviction maintenance**:
   - Some cache designs separate key lookup from recency or eviction maintenance.
   - Synchronization, buffering, and consistency guarantees vary by implementation; consult the selected library's current documentation and source.`,
        keyTakeaways: [
          "Never claim ReadWriteLock solves LRU cache concurrency without clarifying that get() mutates list pointers.",
          "Discuss the synchronization and eviction trade-offs of the particular cache implementation being considered.",
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
        question: "How does a Doubly Linked List enable constant-time LRU node updates?",
        answer:
          "To unlink a known node in constant time, a doubly linked list stores its previous and next pointers. A singly linked list normally requires traversal to find the preceding node.",
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
        question: "How can concurrent cache implementations separate lookup from eviction maintenance?",
        answer:
          "Some cache designs separate key lookup from recency or eviction maintenance, but synchronization and buffering are implementation-specific. Consult the chosen library's current documentation and source rather than assuming a particular design.",
      },
    ],
    cta: {
      heading: "Practice LRU Cache & Data Structure Drills in PrepVisor AI Studio",
      subtext:
        "Practice cache implementation exercises and reason through complexity, concurrency, and edge cases in the coding studio.",
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
      "Explore a notification-service design for push, SMS, and email, including priority queues, idempotency, rate limiting, and provider integrations.",
    keywords: [
      "system design notification system",
      "notification service architecture",
      "how to design notification system interview",
      "notification deduplication idempotency",
      "apple apns twilio sendgrid architecture",
      "kafka priority queue notification system",
    ],
    primaryCategory: "system-design",
    relatedGuideSlugs: ["system-design-rate-limiter", "system-design-tinyurl"],
    productPath: "/system-design",
    readingTimeMinutes: 24,
    difficulty: "Advanced",
    dateModified: "2026-09-20",
    author: {
      name: "PrepVisor",
      role: "Guide publisher",
    },
    summary:
      "This guide explores a notification-service design for push, SMS, and email, including priority queues, idempotency, rate limiting, provider integrations, and operational trade-offs.",
    references: [
      { title: "Sending notification requests to APNs", publisher: "Apple Developer Documentation", url: "https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns" },
      { title: "Send a message using FCM HTTP v1 API", publisher: "Firebase Documentation", url: "https://firebase.google.com/docs/cloud-messaging/send/v1-api" },
    ],
    sections: [
      {
        id: "requirements",
        title: "1. Clarifying Requirements & Notification Types",
        subtitle: "Channel protocols, priority tiers, and delivery guarantees",
        content: `When designing a notification service, clarify the channels and delivery objectives first. The latency and scale values below are EXAMPLE / ASSUMPTION targets for a hypothetical interview scenario, not provider guarantees or measured system performance:

**Supported Delivery Channels:**
- **iOS Push Notifications**: Apple Push Notification service (APNs) using HTTP/2 persistent connections and TLS provider certificates.
- **Android Push Notifications**: Firebase Cloud Messaging (FCM).
- **SMS**: Twilio, Infobip, AWS SNS (international delivery with dynamic carrier routing).
- **Email**: SendGrid, Resend, Amazon SES.

**Notification Priority Tiers:**
1. **Critical Transactional (P0)**: One-Time Passwords (OTP), 2-Factor Authentication codes, fraudulent login alerts. Example target: under **2 seconds** with no intentional queueing behind bulk traffic.
2. **Time-Sensitive Alerts (P1)**: Ride arrival updates, direct chat messages, flight gate changes. Example target: under **30 seconds**.
3. **Marketing & Promotions (P2)**: Flash sale announcements, weekly digests, engagement reminders. Example target: delivery within hours during configured recipient-local windows.

**Non-Functional Requirements:**
- **Scale assumption**: Model **100 million notifications per day** with an explicitly selected peak multiplier.
- **Availability objective (example)**: A scenario may target **99.99%** availability; queues and retries reduce some loss modes but do not guarantee delivery during provider outages.
- **Idempotency & Deduplication**: Prevent users from receiving duplicate SMS or push alerts during network retries.
- **User Preference Engine**: Strict adherence to user opt-outs, quiet hours, and legal regulations (GDPR, CAN-SPAM, TCPA).`,
        keyTakeaways: [
          "Priority tiers can separate time-sensitive and bulk traffic; the isolation strategy depends on latency, fairness, and cost objectives.",
          "Idempotency can reduce duplicate processing, but it does not by itself guarantee exactly-once delivery across external providers.",
        ],
      },
      {
        id: "capacity-estimation",
        title: "2. Back-of-the-Envelope Capacity Estimation",
        subtitle: "Calculating throughput, storage, and network bandwidth",
        content: `EXAMPLE / ASSUMPTION — These calculations illustrate one hypothetical workload. Substitute agreed scenario inputs and validate record sizes, provider limits, and measured latency for the chosen implementation.

**Throughput Calculations:**
- **Daily Volume**: 100 Million notifications/day.
- **Average QPS**:
  $$\\frac{100{,}000{,}000 \\text{ notifications}}{86{,}400 \\text{ seconds}} \\approx 1{,}160 \\text{ notifications/second}$$
- **Peak Burst Ratio**: 10x average (during flash sales, breaking news, or app-wide alerts).
- **Peak Ingress QPS**: $1{,}160 \\times 10 \\approx 11{,}600 \\text{ notifications/second}$.

**Storage Sizing:**
- **Metadata Payload**: User ID (UUID 16 bytes) + Channel ID (2 bytes) + Timestamp (8 bytes) + Template ID (8 bytes) + Status (4 bytes) + Idempotency Key (32 bytes) + Variables JSON (approx. 500 bytes) $\\approx 1 \\text{ KB}$ per record.
- **Daily Storage**: $100\\text{M} \\times 1 \\text{ KB} = 100 \\text{ GB/day}$.
- **90-Day Operational Log Retention (illustrative)**: $100 \\text{ GB} \\times 90 = 9 \\text{ TB}$ before replication, indexes, compression, and retention-policy effects. Suitability depends on the selected database and configuration.

**Egress Network Bandwidth:**
- At the assumed peak of 11,600 notifications/sec and 1 KB payload, payload bandwidth is approximately 11.6 MB/sec (about 93 Mbps), excluding protocol overhead. Whether this is a bottleneck depends on the deployment and competing traffic.`,
        architectureCallout: {
          title: "Notification Platform Capacity Sizing",
          points: [
            { label: "Daily notification volume (example)", value: "100 million/day assumed" },
            { label: "Peak ingress (example)", value: "~11,600 notifications/second under 10× peak assumption" },
            { label: "OTP latency target (example)", value: "< 1.5 seconds end-to-end, to be measured" },
            { label: "Log storage estimate (example)", value: "~9 TB before database overhead" },
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
        content: `A direct synchronous call from microservices to third-party vendors (Twilio, SendGrid) can couple upstream availability and latency to the provider. For example, a delayed provider response can hold upstream request and connection-pool resources.

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
          "Durable queues and retries can reduce loss from transient failures, but delivery depends on persistence, retry policy, provider behavior, and dead-letter handling.",
          "Separate worker pools can reduce competition between priorities; shared downstream dependencies can still delay urgent notifications.",
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
3. **Provider Idempotency (when supported)**:
   - Provider idempotency mechanisms differ by product and endpoint. Check current API documentation before forwarding an idempotency key; do not assume a common header or behavior.`,
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
          "Propagate idempotency keys where downstream APIs document support; otherwise deduplicate within the service and account for uncertain provider outcomes.",
        ],
      },
      {
        id: "worker-fleet-priority",
        title: "5. Worker Fleet Design, Priority Queues & Vendor Rate Limiting",
        subtitle: "Preventing rate limit throttling and managing delivery retries",
        content: `### 1. Dedicated Priority Worker Fleets
Consider separating worker capacity for transactional and bulk workloads when their latency or isolation objectives differ:
- **P0 Workers**: Highly provisioned with minimal batch sizes for immediate dispatch.
- **P2 Workers**: Heavily batched consumers designed for maximum bulk throughput, configured to scale down automatically if downstream APIs show elevated error rates.

### 2. Vendor Rate Limiting & Account Ceilings
Third-party providers apply account- and product-specific throughput limits. Check current limits for the provider account and agreement; do not assume a universal rate.
- If a provider-specific limit is exceeded, its documented throttling behavior applies; handle responses and retries according to that provider's guidance.
- **Solution**: Workers use a central Redis Token Bucket per vendor account to throttle dispatch rates across all worker nodes.

### 3. Exponential Backoff with Jitter & Dead Letter Queues (DLQ)
When a vendor call fails:
- **Transient Failures (HTTP 500, Network Timeout)**: Retry with truncated exponential backoff and randomized jitter:
  $$\\text{Delay} = \\min(60, 2^{\\text{attempt}} + \\text{random\\_jitter})$$
- **Permanent Failures (HTTP 400, Invalid Phone Number, Unregistered Device Token)**: Do not retry. Route immediately to a **Dead Letter Queue (DLQ)** and deactivate the user's invalid device token in the database.`,
        keyTakeaways: [
          "Isolate priority queues and worker capacity to reduce the effect of bulk traffic on time-sensitive messages, while monitoring shared bottlenecks.",
          "Implement Token Bucket rate limiters to respect third-party vendor API quotas.",
        ],
      },
      {
        id: "user-preferences-compliance",
        title: "6. User Preferences, Quiet Hours & Global Compliance",
        subtitle: "TCPA, CAN-SPAM, GDPR, and localized quiet hours",
        content: `Notification preference and compliance requirements depend on message type, jurisdiction, and channel. Treat the following as design considerations, not legal advice; verify requirements for the actual product and audience with qualified counsel. The [FTC CAN-SPAM compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) describes US commercial email requirements, while [RFC 8058](https://www.rfc-editor.org/rfc/rfc8058.html) specifies a one-click unsubscribe mechanism for supported email-list use cases.

### 1. User Preference Data Model
An example preference model can let users manage notification categories and channels. Which messages may be opted out of depends on the product, applicable law, and channel; do not treat security, billing, or transactional labels as a universal exemption.

### 2. Timezone-Aware Quiet Hours
Sending non-urgent marketing messages during a recipient's local quiet hours may be undesirable. A product can configure quiet-hour windows and evaluate them using the recipient's selected or otherwise appropriately determined timezone.

### 3. Legal Compliance Regulations
For US commercial email, consult the FTC guidance for applicable sender identification, address, and opt-out requirements. RFC 8058 describes one-click unsubscribe signaling for mailing lists; it is not a blanket statement of requirements for every marketing email. SMS and privacy obligations also vary by jurisdiction and implementation, so confirm channel-specific handling and timing with qualified counsel and the selected provider.`,
        keyTakeaways: [
          "Respect recipient timezones for non-transactional marketing notifications.",
          "Define and test channel-specific opt-out handling against applicable requirements and provider behavior.",
        ],
      },
    ],
    faqs: [
      {
        question: "How can a design reduce the chance that bulk notifications delay high-priority OTP traffic?",
        answer:
          "Separate priority topics and worker capacity can reduce competition between bulk and urgent traffic. They do not guarantee zero delay: shared providers, partitions, databases, and infrastructure can still be bottlenecks, so define objectives and monitor end-to-end latency.",
      },
      {
        question: "How do you prevent users from receiving duplicate push notifications or SMS?",
        answer:
          "Use an idempotency key and an atomic deduplication record with a retention period suited to the retry window. Provider support varies; do not assume an external messaging API honors arbitrary idempotency keys.",
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
        "Explore a multi-channel notification architecture and work through priority, idempotency, and rate-limiting trade-offs in the system design studio.",
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

export { generateArticleJsonLd, generateFaqJsonLd } from "../lib/structuredData.ts";
