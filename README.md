# KD_SEC — Security Portfolio & Web Security Tools

Personal cybersecurity portfolio (live at daurencd.xyz) with three self-built, publicly usable security tools.

## Live Tools

### Web Security Scanner (/scanner.html)
Non-exploitative HTTP checks of TLS/HTTPS configuration, security headers (HSTS, CSP, X-Frame-Options), cookie flags, CORS headers, and selected exposed-file paths. Produces a scored report (A-F) with a printable PDF view.
The score is a quick configuration indicator, not a security certification. CSP/CORS and file exposure findings are marked as informational or require manual confirmation where a single request cannot prove safety or impact. Redirect destinations are checked before each request.

### OSINT Lookup (/osint.html)
Passive reconnaissance using only public sources: WHOIS/RDAP, DNS records, subdomain discovery via Certificate Transparency logs, and Wayback Machine history.
DNS output includes DMARC and CAA records; Certificate Transparency names are restricted to the queried domain boundary.

### Domain intelligence (v3)

- Public Suffix List parsing with `tldts`: correct scope for `example.co.uk` and tenants such as `tenant.vercel.app`; RDAP queries the registered domain separately.
- Certificate Transparency pagination: up to 3 pages, 300 names and 60 certificate cards. Wildcards remain certificate patterns rather than fabricated hosts. Cert Spotter has a `crt.sh` fallback.
- Inventory: A/AAAA/CNAME for up to 30 names with bounded concurrent DNS queries. Failed DNS and missing records have different statuses.
- Infrastructure map: DNS-derived hostname/IP links, up to 12 IP groups. RIPEstat provides ASN/prefix for up to 3 IPs; PTR comes from DNS. Shared infrastructure does not establish ownership.
- Certificate cards: issuer, in-scope SANs, validity, source and fingerprint when available.
- Each public source reports its status and collection time. Results are limited observations, not a complete asset list.

### Scanner evidence (v3)

- HTTP status, actual destination IP, redirect chain and HTTP headers; Set-Cookie values are excluded from header exports.
- TLS details: negotiated protocol/cipher, subject/SAN, validity and SHA-256 fingerprint. This does not enumerate every supported TLS version.
- CSP analysis includes HTTP policy, Report-Only, and meta policies found in the first 32 KiB of HTML. Findings are configuration heuristics.
- HTTP connections pin validated public IPs using an Undici dispatcher; every redirect is validated. Bodies are capped at 32 KiB and requests have deadlines. TLS inspection also uses a validated IP.
- Selected exposed-file checks require content signatures; snippets and secrets are never returned in reports.

### Comparison and export

Both tools export JSON and CSV, and support print-to-PDF. A maximum of 12 compact snapshots are kept in the visitor's local browser storage, with no new cloud database. Comparisons ignore unavailable data and avoid claiming disappearances from partial CT results. CSV cells are neutralized against spreadsheet formula injection.

### Free sources and limits

No new API subscription or key is required for the local demo: DNS, RDAP, RIPEstat, Wayback and crt.sh are queried publicly. Cert Spotter's unauthenticated access is limited to personal/evaluation use; for a public production deployment its provider offers a free account tier with request limits (see https://sslmate.com/ct_search_api/). The tools do not subscribe to paid plans or retry through quota errors. Timeouts/rate limits are visible in the report. Existing Upstash caching remains optional.

### KØZ (/exposure.html)

Digital exposure intelligence with five modes. The existing URL is preserved.

- **Email:** free XposedOrNot analytics with incident dates, affected data classes, descriptions, record counts, verification and password-storage metadata. Basic check-email fallback preserves findings if analytics is unavailable. Up to 60 cards, plus MX/SPF/DMARC queries on the email domain (including an organizational DMARC fallback). DNS does not verify mailbox existence. Breach-level fields do not prove every field was exposed for that particular account.
- **Password:** local zxcvbn pattern estimate, with optional free Pwned Passwords check. Only the first five SHA-1 characters leave the device; `Add-Padding: true` is used. The field is cleared when the check starts. Whitespace in the password is preserved. A timeout/malformed response is unknown, never a clean result. Neither full password/hash nor zxcvbn match tokens are stored or exported. The estimator mainly uses English dictionaries and does not predict actual cracking time.
- **Username:** five exact public API checks (GitHub, GitLab, Hacker News, DEV Community, Keybase), with public biography/account age/available counters. Distinct found, not-found, unavailable and unsupported statuses. Ten additional manual platform links; Telegram/YouTube HTML status codes are not treated as identity evidence. Same username does not establish same owner.
- **Phone:** entirely local `libphonenumber-js/max` parsing with numbering-plan validation, possible length, region, calling code, number type and E.164/international/national/RFC3966 formats. KZ is the default region for national numbers, selectable by the visitor. It does not find leaks, ownership, live location or current carrier. Number portability and metadata updates can affect type/region accuracy.
- **Breach catalog:** public XposedOrNot incident catalog, capped at 400 cards, cached in server memory for 15 minutes. Search, year/data-class/password-storage filters, sorting, pagination and an interactive yearly chart. Catalog counts represent indexed incidents, not a complete global inventory.

JSON/CSV exports and print-to-PDF, plus a checklist of protective actions kept only in the current report. Identifiers are excluded from export by default; visitors can opt in for email/phone/username. This hides identifiers, not all sensitive associations in a breach report. CSV formula injection is neutralized. KØZ does not use the OSINT/scanner localStorage history or cache personal results.

API requests use **POST /api/expose** with `{type, q, consent}`; GET is rejected so personal values are not put in browser URLs. Email requires explicit consent to send the full address to XposedOrNot. Password and phone modes never call this endpoint. XposedOrNot can log the submitted email, and API/server hosts may log requests according to their policies. No subscriptions, keys or paid endpoints are used. Free endpoints have limits: [XposedOrNot API documentation](https://xposedornot.com/api_doc), [Pwned Passwords documentation](https://haveibeenpwned.com/API/v3#PwnedPasswords). Quota failures remain visible; KØZ does not switch to paid plans.

Browser libraries are committed locally with their licenses under `js/vendor`; no external CDN is needed for personal analysis. After dependency updates, run `npm run vendor:sync` to refresh these copies. Versions are locked by `package-lock.json`.

## Engineering Notes

- Rate-limiting and caching via Upstash Redis (graceful no-op if unavailable)
- Security headers hardening across all pages
- Every tool includes an explicit legal/educational disclaimer: passive checks only, for domains/accounts you own or are authorized to test

## Tech Stack

JavaScript, Vercel Serverless Functions, Upstash Redis

## Local Development

```bash
npm start
# or
node server.js
```

Dev server with static hosting and full API emulation runs at `http://localhost:3000`.

Install free open-source dependencies first with `npm install`. Run deterministic tests with `npm test`.


## Disclaimer

All tools are for educational purposes and authorized use only (your own assets, or assets you have explicit permission to test). No exploitation is performed. The scanner makes ordinary HTTP requests to the target and selected paths; OSINT relies on public sources.
