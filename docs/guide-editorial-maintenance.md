# Guide editorial maintenance

The six guides are authored as structured data in `src/data/guides.ts`. The
`author` shown on guides and in `TechArticle` JSON-LD is the PrepVisor
organization/publisher, not a named individual or credentialed reviewer.

## Dates

`dateModified` is manually maintained. Update it only when a meaningful change
to the guide's substance is made; do not update it for formatting, builds, or
automated deploys. `datePublished` is optional and should remain omitted until
the original publication date can be documented. Visible “Updated” text and
`TechArticle.dateModified` are generated from the same `dateModified` field.

## Technical claims and references

Use primary documentation (standards, official language/runtime, framework,
database, or provider documentation) for version-sensitive and vendor-specific
claims. Keep scenario numbers explicitly labeled as assumptions and do not
present them as measurements or provider guarantees. A visible source list is
not a substitute for explaining a claim in the guide itself.

Run `npm run references:check` to issue network HEAD requests to the guide
reference URLs. This check is intentionally separate from the normal test and
build commands because external websites can be unavailable, rate-limited, or
block automated requests. A failed HEAD request should be manually checked
before treating a URL as broken.

## Editorial policy route

No public editorial-policy page is published: the repository does not document
a technical review workflow, correction-handling process, or review cadence.
Document those processes truthfully before making public commitments about
them.
