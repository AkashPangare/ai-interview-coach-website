import { GUIDES } from "../src/data/guides.ts";

const failures = [];
const seen = new Map();

for (const guide of GUIDES) {
  const guideUrls = new Set();
  for (const reference of guide.references ?? []) {
    let parsed;
    try {
      parsed = new URL(reference.url);
    } catch {
      failures.push(`${guide.slug}: invalid URL ${reference.url}`);
      continue;
    }
    if (parsed.protocol !== "https:") failures.push(`${guide.slug}: non-HTTPS reference ${reference.url}`);
    if (!reference.title?.trim()) failures.push(`${guide.slug}: reference is missing a title`);
    if (!reference.publisher?.trim()) failures.push(`${guide.slug}: reference is missing a publisher`);
    if (guideUrls.has(reference.url)) failures.push(`${guide.slug}: duplicate URL: ${reference.url}`);
    guideUrls.add(reference.url);
    if (!seen.has(reference.url)) seen.set(reference.url, guide.slug);

    try {
      const response = await fetch(reference.url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
        headers: { "user-agent": "PrepVisor guide reference validator" },
      });
      if (!response.ok) failures.push(`${guide.slug}: HTTP ${response.status} ${response.url || reference.url}`);
    } catch (error) {
      failures.push(`${guide.slug}: request failed for ${reference.url}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${seen.size} unique guide reference URLs.`);
}
