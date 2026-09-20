import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.resolve(projectRoot, "dist");
const templatePath = path.resolve(distPath, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("Prerender error: dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

// Minimal guide metadata mirror for Node.js prerendering without bundling step
const PRERENDER_GUIDES = [
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
    lastUpdated: "2026-09-18",
    sections: [
      "1. Functional & Non-Functional Requirements",
      "2. Capacity Estimation & Back-of-the-Envelope Calculations",
      "3. Key Generation Strategy: Base62 vs Hashing",
      "4. High-Level Architecture & End-to-End Flow",
      "5. Database Schema & Storage Engine Choice",
      "6. Single Point of Failure (SPOF) & Fault Tolerance",
    ],
    faqs: [
      {
        question: "Why use Base62 instead of Base64 for short URLs?",
        answer:
          "Base64 includes characters like '+' and '/', which carry special meanings in URL query strings and path segments. Base62 consists strictly of alphanumeric characters [a-z, A-Z, 0-9], making it safe across all browsers, SMS, and messaging apps.",
      },
      {
        question: "Should TinyURL return HTTP 301 or HTTP 302 status code?",
        answer:
          "HTTP 301 is a Permanent Redirect cached by browsers, preventing click tracking. HTTP 302 is a Temporary Redirect forcing clicks through your servers, allowing real-time analytics, rate-limiting, and malicious link blocking.",
      },
      {
        question: "What is the storage requirement for 6 billion short URLs?",
        answer:
          "At an average of 600 bytes per record (500 bytes original URL + 100 bytes key and metadata), 6 billion URLs require approximately 3.6 Terabytes of total database storage.",
      },
    ],
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
    lastUpdated: "2026-09-19",
    sections: [
      "1. Java Memory Model (JMM) & Thread Safety Fundamentals",
      "2. Modern Locks: ReentrantLock, ReadWriteLock & StampedLock",
      "3. ThreadPoolExecutor Internals & Production Sizing",
      "4. ConcurrentHashMap Internal Working (Java 8+ vs Java 7)",
      "5. Virtual Threads (Project Loom) in Java",
    ],
    faqs: [
      {
        question: "What is the difference between volatile and synchronized in Java?",
        answer:
          "volatile guarantees visibility and ordering by preventing CPU cache staleness and instruction reordering, but does NOT provide atomicity. synchronized provides full mutual exclusion, atomicity, visibility, and ordering.",
      },
      {
        question: "Why does ConcurrentHashMap not allow null keys or null values?",
        answer:
          "In concurrent systems, returning null cannot reliably distinguish between a key not being present and a key mapped to null without a secondary call, creating dangerous race conditions.",
      },
      {
        question: "What is thread pinning in Java Virtual Threads?",
        answer:
          "Thread pinning occurs when a virtual thread enters a synchronized block or native JNI call and then blocks on I/O. The JVM cannot unmount it from the OS carrier thread, reducing throughput. Use ReentrantLock instead.",
      },
    ],
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
    lastUpdated: "2026-09-20",
    sections: [
      "1. Functional & Non-Functional Requirements",
      "2. Algorithm Comparison: Token Bucket vs Leaky Bucket vs Sliding Window",
      "3. High-Level Architecture & Gateway Placement",
      "4. Distributed Concurrency & The Race Condition Trap",
      "5. Capacity Estimation & Redis Memory Sizing",
      "6. Edge Cases, Multi-Tier Limits & Failover Resilience",
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
    lastUpdated: "2026-09-20",
    sections: [
      "1. Spring Boot 3 Core & Bean Lifecycle Internals",
      "2. The @Transactional Traps & Rollback Mechanics",
      "3. Microservices Resilience: Circuit Breakers with Resilience4j",
      "4. Distributed Transactions: Saga Pattern vs 2-Phase Commit",
      "5. Observability, Distributed Tracing & W3C Standards",
      "6. Java & Spring Boot 3 Modern Enhancements",
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
    lastUpdated: "2026-09-20",
    sections: [
      "1. LRU Cache Problem Breakdown & Complexity Requirements",
      "2. The Dummy Sentinel Node Technique (Head & Tail)",
      "3. Complete Production-Grade Java Implementation",
      "4. Multi-Language Implementations: Python & Modern C++",
      "5. Concurrency & Thread-Safety Extensions",
      "6. Common Interview Follow-Ups & Edge Cases",
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
    lastUpdated: "2026-09-20",
    sections: [
      "1. Clarifying Requirements & Notification Types",
      "2. Back-of-the-Envelope Capacity Estimation",
      "3. High-Level Architecture & End-to-End Flow",
      "4. Deduplication, Idempotency & Exactly-Once Semantics",
      "5. Worker Fleet Design, Priority Queues & Vendor Rate Limiting",
      "6. User Preferences, Quiet Hours & Global Compliance",
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
  },
];

function generateHtml(guide) {
  const canonicalUrl = `https://prepvisor.in/guides/${guide.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.metaDescription,
    image: "https://prepvisor.in/logo.png",
    author: {
      "@type": "Organization",
      name: "PrepVisor Systems Engineering Team",
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
      "@id": canonicalUrl,
    },
    keywords: guide.keywords.join(", "),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  let pageHtml = template;

  // Replace Title
  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/,
    `<title>${guide.seoTitle} | PrepVisor</title>`
  );

  // Replace Meta Description
  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    `<meta name="description" content="${guide.metaDescription}" />`
  );

  // Inject Canonical and JSON-LD into <head>
  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${guide.title}" />
    <meta property="og:description" content="${guide.metaDescription}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="${guide.title}" />
    <meta name="twitter:description" content="${guide.metaDescription}" />
    <script type="application/ld+json">${JSON.stringify(articleJsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(faqJsonLd)}</script>
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);

  // Inject static fallback markup into <div id="root">
  const staticContent = `
    <div id="root">
      <article class="p-8 max-w-4xl mx-auto font-sans">
        <header class="mb-8">
          <p class="text-sm font-bold text-blue-600 uppercase tracking-wider">${guide.category} · ${guide.readingTimeMinutes} min read</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">${guide.title}</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed">${guide.metaDescription}</p>
        </header>
        <section class="space-y-6">
          <h2 class="text-2xl font-bold text-slate-800">Key Interview Sections</h2>
          <ul class="list-disc pl-6 space-y-2 text-slate-700">
            ${guide.sections.map((s) => `<li><strong>${s}</strong></li>`).join("")}
          </ul>
        </section>
        <section class="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-200">
          <h3 class="text-xl font-bold text-slate-900">Practice this question on PrepVisor AI Studio</h3>
          <p class="text-sm text-slate-600 mt-2">Get real-time scoring, code evaluation, and system design feedback.</p>
          <a href="https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guide&utm_campaign=${guide.slug}" class="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Launch Practice Studio</a>
        </section>
      </article>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);

  return pageHtml;
}

function generateHubHtml() {
  const canonicalUrl = "https://prepvisor.in/guides";
  let pageHtml = template;

  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/,
    "<title>Technical Interview Study Guides & Architecture Blueprints | PrepVisor</title>"
  );

  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    '<meta name="description" content="Free comprehensive engineering interview guides. Master System Design architectures, Java concurrency internals, and coding patterns with real-world case studies." />'
  );

  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Technical Interview Guides | PrepVisor" />
    <meta property="og:description" content="Comprehensive engineering guides on System Design, Java Concurrency, and coding patterns." />
    <meta property="og:url" content="${canonicalUrl}" />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);

  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Technical Interview Blueprints</h1>
        <p class="text-slate-600 mt-3">Curated engineering guides on complex system design architectures, JVM internals, and coding patterns.</p>
        <div class="mt-8 space-y-4">
          ${PRERENDER_GUIDES.map(
            (g) => `
            <div class="p-6 rounded-2xl border border-slate-200 bg-white">
              <span class="text-xs font-bold text-blue-600 uppercase">${g.category}</span>
              <h2 class="text-xl font-bold text-slate-900 mt-1"><a href="/guides/${g.slug}">${g.title}</a></h2>
              <p class="text-sm text-slate-600 mt-2">${g.metaDescription}</p>
            </div>
          `
          ).join("")}
        </div>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);

  return pageHtml;
}

function generateSystemDesignHtml() {
  const canonicalUrl = "https://prepvisor.in/system-design";
  let pageHtml = template;

  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/,
    "<title>System Design Interview Simulator & Cloud Architecture Canvas | PrepVisor</title>"
  );

  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    '<meta name="description" content="Master System Design interviews with an interactive cloud architecture canvas. Real-time back-of-the-envelope capacity estimation, QPS, storage math, and automated SPOF detection." />'
  );

  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="System Design Interview Simulator & Cloud Canvas | PrepVisor" />
    <meta property="og:description" content="Design distributed systems with live scale calculations and SPOF detection on an infinite cloud whiteboard." />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="System Design Interview Simulator | PrepVisor" />
    <meta name="twitter:description" content="Design distributed systems with live scale calculations and SPOF detection." />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);

  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-sky-600 uppercase tracking-widest">Interactive System Design Simulator</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Master System Design Interviews with Live Scale Math & SPOF Detection</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">
            Design high-throughput distributed systems on an infinite cloud architecture canvas. Connect microservices, databases, and caches with real-world protocols—and validate your architecture with real-time capacity calculations and AI bottleneck analysis.
          </p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Infinite Drag-and-Drop Cloud Topology</h2>
            <p class="text-slate-600 mt-2">Position load balancers, reverse proxies, microservices, caches, and relational or NoSQL datastores with gRPC, REST, and TCP protocols.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. Real-Time Capacity & Scale Calculations</h2>
            <p class="text-slate-600 mt-2">Compute Read/Write QPS, 5-Year persistent storage, 80/20 Pareto caching RAM, and network bandwidth saturation in real time.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Automated Single Point of Failure (SPOF) Analysis</h2>
            <p class="text-slate-600 mt-2">AI Principal Architect inspects directional topology graphs to identify un-replicated databases and missing circuit breakers.</p>
          </div>
        </section>
        <div class="mt-12 text-center p-8 rounded-2xl bg-sky-50 border border-sky-200">
          <h3 class="text-2xl font-bold text-slate-900">Ready to build your first architecture?</h3>
          <p class="text-slate-600 mt-2">Practice TinyURL, Rate Limiter, and Notification System on PrepVisor.</p>
          <a href="https://app.prepvisor.in/register?source=system_design_ssg" class="inline-block mt-4 px-8 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-sm">Launch Free System Design Studio</a>
        </div>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateMockInterviewHtml() {
  const canonicalUrl = "https://prepvisor.in/mock-interview";
  let pageHtml = template;

  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/,
    "<title>AI Voice Mock Interview Online & STAR Behavioral Coach | PrepVisor</title>"
  );

  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    '<meta name="description" content="Practice realistic voice mock interviews with AI. Real-time Speech-to-Text conversational practice, STAR framework scoring (Situation, Task, Action, Result), leadership ownership metrics, and multi-turn role-calibrated interview rounds." />'
  );

  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="AI Voice Mock Interview & STAR Method Coach | PrepVisor" />
    <meta property="og:description" content="Practice technical and behavioral voice mock interviews with AI. Real-time Speech-to-Text and STAR method scoring." />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="AI Voice Mock Interview | PrepVisor" />
    <meta name="twitter:description" content="Practice voice mock interviews with AI and STAR method scoring." />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);

  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-purple-600 uppercase tracking-widest">AI Voice Mock Interviewer</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Practice Voice Mock Interviews & Master the STAR Method</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">
            Speak out loud naturally with an AI interviewer that listens via Speech-to-Text, guides multi-turn role-calibrated rounds, and grades your answers across the proven STAR framework and leadership ownership.
          </p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Real-Time Conversational Voice Recognition</h2>
            <p class="text-slate-600 mt-2">Capture your spoken articulation in real time with browser-native low latency Speech-to-Text recognition.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. STAR Method Evaluation (Situation, Task, Action, Result)</h2>
            <p class="text-slate-600 mt-2">Aligned with Amazon Leadership Principles and Google behavioral loops, scoring technical depth and business impact.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Leadership Ownership Ratio ('I' vs 'we')</h2>
            <p class="text-slate-600 mt-2">Identifies personal contributions and quantifiable metric density (latency drop, user growth, incident resolution time).</p>
          </div>
        </section>
        <div class="mt-12 text-center p-8 rounded-2xl bg-purple-50 border border-purple-200">
          <h3 class="text-2xl font-bold text-slate-900">Eliminate interview day nervousness</h3>
          <p class="text-slate-600 mt-2">Start your first voice mock interview session with instant feedback.</p>
          <a href="https://app.prepvisor.in/register?source=mock_interview_ssg" class="inline-block mt-4 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-sm">Start Free Voice Mock Session</a>
        </div>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateCodingPracticeHtml() {
  const canonicalUrl = "https://prepvisor.in/coding-practice";
  let pageHtml = template;

  pageHtml = pageHtml.replace(
    /<title>.*?<\/title>/,
    "<title>DSA Coding Arena with Live Terminal Stdout & Big-O Feedback | PrepVisor</title>"
  );

  pageHtml = pageHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
    '<meta name="description" content="Practice DSA coding problems with Java, Python, and C++. Features a live Console Output terminal capturing print statements, automated test runner, 3-tier progressive hints, and Big-O algorithmic complexity analysis." />'
  );

  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="DSA Coding Arena with Live Terminal Stdout | PrepVisor" />
    <meta property="og:description" content="Practice DSA in Java, Python, C++, and TS with live terminal console output and Big-O complexity scoring." />
    <meta name="twitter:url" content="${canonicalUrl}" />
    <meta name="twitter:title" content="DSA Coding Arena | PrepVisor" />
    <meta name="twitter:description" content="Practice DSA with live terminal stdout and Big-O feedback." />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);

  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">DSA Coding Studio</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Master DSA Coding Interviews with Live Terminal Stdout & Big-O Feedback</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">
            Stop debugging algorithms blindly. PrepVisor provides a full VS Code-grade Cloud IDE with Java as primary default, a live Console Output terminal that prints your stdout statements in real time, custom test runners, and instant Big-O complexity analysis.
          </p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Modern Java First-Class Support</h2>
            <p class="text-slate-600 mt-2">Practice with modern language features (Virtual Threads, Records, Stream API) alongside Python 3.12, C++ 20, and TypeScript.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. Live Terminal Console Output (stdout)</h2>
            <p class="text-slate-600 mt-2">Capture print statements (System.out.println, print(), console.log()) directly in your browser terminal for rapid debugging.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Big-O Algorithmic Complexity Scoring</h2>
            <p class="text-slate-600 mt-2">Automatic analysis of Time and Auxiliary Space complexity benchmarks to ensure optimal performance.</p>
          </div>
        </section>
        <div class="mt-12 text-center p-8 rounded-2xl bg-emerald-50 border border-emerald-200">
          <h3 class="text-2xl font-bold text-slate-900">Write clean, production-grade algorithms</h3>
          <p class="text-slate-600 mt-2">Run test cases and verify complexity on PrepVisor.</p>
          <a href="https://app.prepvisor.in/register?source=coding_practice_ssg" class="inline-block mt-4 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-sm">Launch Free Coding Studio</a>
        </div>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateHomeHtml() {
  let pageHtml = template;

  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-6xl mx-auto font-sans">
        <header class="mb-12 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Time-Calibrated Prep • Coding, System Design & Behavioral AI</p>
          <h1 class="text-5xl font-black text-slate-900 mt-3 leading-tight">Crush Your Tech Interviews with Dynamic AI Pacing</h1>
          <p class="text-xl text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">
            Stop grinding LeetCode blind without a plan. Set your target timeline (7 to 60+ days) and daily hours (1.0 to 3.0+ hrs/day). PrepVisor dynamically calibrates your day-by-day curriculum, auto-rebalances your schedule with 1 click, and trains you with an interactive DSA coding arena (Java default + live terminal console), an infinite System Design canvas with scale estimation, and STAR voice coaching.
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <a href="https://app.prepvisor.in/register?source=home_ssg" class="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm">Get Your Free Interview Roadmap →</a>
            <a href="/pricing" class="px-8 py-3.5 border border-slate-300 bg-white text-slate-700 font-semibold rounded-xl">View Pricing Plans</a>
          </div>
          <p class="text-xs text-slate-500 mt-4">✓ No credit card required • ✓ Free forever tier (3 mock interviews) • ✓ Instant electronic access</p>
        </header>

        <section class="mt-16 space-y-12">
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 1: Time-Aware Daily Pacing & 1-Click Rebalance Schedule</h2>
            <p class="text-slate-600 mt-2">Dynamic day-by-day preparation curriculum calibrated around your interview date (7 to 60+ days) and commitments (1 to 4 hrs/day).</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 2: Interactive DSA Coding Arena with Terminal Stdout</h2>
            <p class="text-slate-600 mt-2">VS Code-grade Cloud IDE with Java default, Python, C++, and TypeScript. Real-time stdout console for print debugging and Big-O complexity evaluation.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 3: Infinite System Design Whiteboard with Real-Time Scale Math</h2>
            <p class="text-slate-600 mt-2">Drag-and-drop cloud architecture canvas with live back-of-the-envelope calculations for QPS, 5-Year storage, RAM, and SPOF analysis.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 4: Voice Speech-to-Text AI Mock Interviews & STAR Method Scoring</h2>
            <p class="text-slate-600 mt-2">Practice speaking out loud naturally. Real-time evaluation of Situation, Task, Action, Result, metric density, and leadership ownership.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 5: Multiple Tech Roles Supported & Custom Role Option</h2>
            <p class="text-slate-600 mt-2">Comprehensive support for multiple engineering domains and seniority levels, with a Custom Role option to tailor prep to your target job description.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 6: Timed Technical Assessments & AI Evaluation Reports</h2>
            <p class="text-slate-600 mt-2">Simulate real company online assessments (OAs) under a live countdown timer. Receive instant AI grading with skill proficiency bars and targeted blind spot analysis.</p>
          </div>
        </section>

        <section class="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">Technical Interview Blueprints & Study Guides</h2>
          <ul class="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 font-medium">
            <li><a href="/guides/system-design-tinyurl" class="text-blue-600 hover:underline">System Design: How to Design TinyURL (Architecture & Capacity)</a></li>
            <li><a href="/guides/system-design-rate-limiter" class="text-blue-600 hover:underline">System Design: How to Design an API Rate Limiter (Token Bucket)</a></li>
            <li><a href="/guides/system-design-notification-service" class="text-blue-600 hover:underline">System Design: How to Design a Notification System at Scale</a></li>
            <li><a href="/guides/java-concurrency-interview-questions" class="text-blue-600 hover:underline">Top 50 Java Concurrency Interview Questions (2026 Edition)</a></li>
            <li><a href="/guides/spring-boot-microservices-interview-questions" class="text-blue-600 hover:underline">Spring Boot & Microservices Interview Questions (3-6 Yrs)</a></li>
            <li><a href="/guides/lru-cache-implementation" class="text-blue-600 hover:underline">LRU Cache Implementation: Step-by-Step in Java, Python & C++</a></li>
          </ul>
        </section>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generatePricingHtml() {
  const canonicalUrl = "https://prepvisor.in/pricing";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>PrepVisor Pricing — One-Time AI Interview Prep Passes from ₹199 | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Transparent, one-time prepaid interview passes from ₹199. Zero recurring subscriptions. Full access to DSA coding studio, infinite system design whiteboard, and voice AI mocks." />');
  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="PrepVisor Pricing — One-Time AI Interview Prep Passes from ₹199 | PrepVisor" />
    <meta property="og:description" content="Transparent, one-time prepaid interview passes from ₹199. Zero recurring subscriptions." />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Transparent & Honest Pricing</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">PrepVisor Pricing Plans & Preparation Passes</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Choose a preparation plan that fits your interview timeline. Instant electronic digital access with zero hidden auto-renewals.
          </p>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-xl font-bold text-slate-900">7-Day Sprint</h2>
            <p class="text-2xl font-black text-slate-900 mt-2">₹199 <span class="text-xs font-normal text-slate-500">one-time</span></p>
            <p class="text-sm text-slate-600 mt-2">Last-mile intensive interview prep with coding arena & rebalancing.</p>
          </div>
          <div class="p-6 rounded-2xl border-2 border-blue-600 bg-white">
            <h2 class="text-xl font-bold text-slate-900">14-Day Grind (Most Popular)</h2>
            <p class="text-2xl font-black text-blue-600 mt-2">₹349 <span class="text-xs font-normal text-slate-500">one-time</span></p>
            <p class="text-sm text-slate-600 mt-2">Complete toolkit with System Design studio and 15 mock sessions.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-xl font-bold text-slate-900">30-Day Pro (Best Value)</h2>
            <p class="text-2xl font-black text-slate-900 mt-2">₹499 <span class="text-xs font-normal text-slate-500">one-time</span></p>
            <p class="text-sm text-slate-600 mt-2">Full career accelerator pass with STAR behavioral pattern analysis.</p>
          </div>
        </div>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateRoadmapHtml() {
  const canonicalUrl = "https://prepvisor.in/roadmap";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>Time-Aware Tech Interview Roadmap & Daily Pacing | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Calibrate your technical interview study schedule around your exact deadline and daily hours. Adaptive curriculum across DSA, System Design, and STAR behavioral mocks with 1-click schedule rebalancing." />');
  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="Time-Aware Tech Interview Roadmap & Daily Pacing | PrepVisor" />
    <meta property="og:description" content="Calibrate your study schedule around your interview date (7–60 days). 1-click schedule rebalancing." />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Dynamic Daily Pacing Engine</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Personalized Interview Roadmap & Daily Pacing</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Stop grinding LeetCode blind. PrepVisor creates a personalized daily preparation curriculum tailored to your target date, available daily hours, and exact seniority level.
          </p>
        </header>
        <section class="space-y-6">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Time-Aware Calendar Calibration</h2>
            <p class="text-slate-600 mt-2">Select from 7, 14, 30, or 60+ days with 1 to 4 hours daily commitment.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. 1-Click Schedule Rebalancing</h2>
            <p class="text-slate-600 mt-2">Missed a day? Tap rebalance to smoothly spread incomplete tasks without guilt or falling behind.</p>
          </div>
        </section>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateAboutHtml() {
  const canonicalUrl = "https://prepvisor.in/about";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>About PrepVisor — Engineering Interview Preparation Built by Engineers | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Learn why PrepVisor was created. Built by engineers in Bengaluru to solve fragmented, time-blind tech interview prep with dynamic daily pacing, live terminal execution, and distributed system design." />');
  const headAdditions = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonicalUrl}" />
  `;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">About PrepVisor</h1>
        <p class="text-slate-600 mt-4 leading-relaxed">
          PrepVisor was founded in Bengaluru, India by Divya Rajkumar Almelkar to solve fragmented and time-blind tech interview preparation. We combine time-aware dynamic pacing, live terminal execution, distributed system design with capacity math, and voice AI behavioral mock interviews into one cohesive platform.
        </p>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateContactHtml() {
  const canonicalUrl = "https://prepvisor.in/contact";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>Contact PrepVisor — Customer Support & Enterprise Inquiries | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Get in touch with PrepVisor support team and founders. Reach us via email, phone, or office address in Bengaluru for customer assistance, billing, or enterprise cohort inquiries." />');
  const headAdditions = `<link rel="canonical" href="${canonicalUrl}" />`;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Contact PrepVisor</h1>
        <p class="text-slate-600 mt-2">Email: support@prepvisor.in | Phone: +91 7249778116</p>
        <p class="text-slate-600 mt-1">Address: Flat 201, Aurum Residencies, Maruthi Nagar, BTM Layout Stage 1, Bengaluru, Karnataka 560068, India</p>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateTermsHtml() {
  const canonicalUrl = "https://prepvisor.in/terms";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>Terms of Service | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Terms of Service and user agreement governing access to PrepVisor educational software platform and prep passes." />');
  const headAdditions = `<link rel="canonical" href="${canonicalUrl}" />`;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Terms of Service</h1>
        <p class="text-slate-600 mt-4">Governed by the Laws of India. Operated by PrepVisor (Divya Rajkumar Almelkar, Individual).</p>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generatePrivacyHtml() {
  const canonicalUrl = "https://prepvisor.in/privacy";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>Privacy Policy | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Privacy Policy explaining how PrepVisor handles personal information in compliance with the Digital Personal Data Protection Act (DPDP Act) 2023." />');
  const headAdditions = `<link rel="canonical" href="${canonicalUrl}" />`;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p class="text-slate-600 mt-4">Compliant with the Digital Personal Data Protection Act (DPDP Act) 2023.</p>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateRefundHtml() {
  const canonicalUrl = "https://prepvisor.in/refund-policy";
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>Cancellation & Refund Policy | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="Official Cancellation and Refund Policy for PrepVisor digital preparation passes. Details on 7-day refund eligibility, non-refundable cases, and payment reversal timelines." />');
  const headAdditions = `<link rel="canonical" href="${canonicalUrl}" />`;
  pageHtml = pageHtml.replace("</head>", `${headAdditions}</head>`);
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Cancellation & Refund Policy</h1>
        <p class="text-slate-600 mt-4">7-day refund window for first-time pass purchases under fair evaluation.</p>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateNotFoundHtml() {
  let pageHtml = template;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/, "<title>404 - Page Not Found | PrepVisor</title>");
  pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/, '<meta name="description" content="The page you requested could not be found on PrepVisor." />');
  const staticContent = `
    <div id="root">
      <main class="p-8 max-w-4xl mx-auto text-center font-sans">
        <h1 class="text-5xl font-black text-slate-900">404</h1>
        <p class="text-xl text-slate-600 mt-4">Page Not Found</p>
        <p class="text-sm text-slate-500 mt-2">The page you were looking for doesn't exist or was moved.</p>
        <a href="/" class="inline-block mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Return to Homepage</a>
      </main>
    </div>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

// 1. Pre-render Root Homepage (dist/index.html)
fs.writeFileSync(templatePath, generateHomeHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/index.html (Homepage)");

// 2. Pre-render Feature Pillar Pages
const sdDir = path.resolve(distPath, "system-design");
fs.mkdirSync(sdDir, { recursive: true });
fs.writeFileSync(path.resolve(sdDir, "index.html"), generateSystemDesignHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/system-design/index.html");

const miDir = path.resolve(distPath, "mock-interview");
fs.mkdirSync(miDir, { recursive: true });
fs.writeFileSync(path.resolve(miDir, "index.html"), generateMockInterviewHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/mock-interview/index.html");

const cpDir = path.resolve(distPath, "coding-practice");
fs.mkdirSync(cpDir, { recursive: true });
fs.writeFileSync(path.resolve(cpDir, "index.html"), generateCodingPracticeHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/coding-practice/index.html");

// 3. Pre-render Pricing, Roadmap, About, Contact
const pricingDir = path.resolve(distPath, "pricing");
fs.mkdirSync(pricingDir, { recursive: true });
fs.writeFileSync(path.resolve(pricingDir, "index.html"), generatePricingHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/pricing/index.html");

const roadmapDir = path.resolve(distPath, "roadmap");
fs.mkdirSync(roadmapDir, { recursive: true });
fs.writeFileSync(path.resolve(roadmapDir, "index.html"), generateRoadmapHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/roadmap/index.html");

const aboutDir = path.resolve(distPath, "about");
fs.mkdirSync(aboutDir, { recursive: true });
fs.writeFileSync(path.resolve(aboutDir, "index.html"), generateAboutHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/about/index.html");

const contactDir = path.resolve(distPath, "contact");
fs.mkdirSync(contactDir, { recursive: true });
fs.writeFileSync(path.resolve(contactDir, "index.html"), generateContactHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/contact/index.html");

// 4. Pre-render Terms, Privacy, Refund
const termsDir = path.resolve(distPath, "terms");
fs.mkdirSync(termsDir, { recursive: true });
fs.writeFileSync(path.resolve(termsDir, "index.html"), generateTermsHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/terms/index.html");

const privacyDir = path.resolve(distPath, "privacy");
fs.mkdirSync(privacyDir, { recursive: true });
fs.writeFileSync(path.resolve(privacyDir, "index.html"), generatePrivacyHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/privacy/index.html");

const refundDir = path.resolve(distPath, "refund-policy");
fs.mkdirSync(refundDir, { recursive: true });
fs.writeFileSync(path.resolve(refundDir, "index.html"), generateRefundHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/refund-policy/index.html");

// 5. Pre-render 404.html (for static hosting servers & CDNs)
fs.writeFileSync(path.resolve(distPath, "404.html"), generateNotFoundHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/404.html");

// 6. Generate /guides/index.html
const hubDir = path.resolve(distPath, "guides");
fs.mkdirSync(hubDir, { recursive: true });
fs.writeFileSync(path.resolve(hubDir, "index.html"), generateHubHtml(), "utf-8");
console.log("✓ Pre-rendered: dist/guides/index.html");

// 7. Generate each guide static page
for (const guide of PRERENDER_GUIDES) {
  const guideDir = path.resolve(distPath, "guides", guide.slug);
  fs.mkdirSync(guideDir, { recursive: true });
  fs.writeFileSync(path.resolve(guideDir, "index.html"), generateHtml(guide), "utf-8");
  console.log(`✓ Pre-rendered: dist/guides/${guide.slug}/index.html`);
}

console.log("🚀 Programmatic SEO & Full Site Static Pre-rendering Complete!");

