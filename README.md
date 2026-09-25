# KD_SEC — Security Portfolio & Web Security Tools

Personal cybersecurity portfolio (live at daurencd.xyz) with three self-built, publicly usable security tools.

## Live Tools

### Web Security Scanner (/scanner.html)
Passive scan of TLS/HTTPS configuration, HTTP security headers (HSTS, CSP, X-Frame-Options), cookie flags, CORS misconfiguration, and exposed files. Produces a scored report (A-F) with a downloadable PDF.

### OSINT Lookup (/osint.html)
Passive reconnaissance using only public sources: WHOIS/RDAP, DNS records, subdomain discovery via Certificate Transparency logs, and Wayback Machine history.

### Exposure Check (/exposure.html)
Checks email breach exposure, username footprint across sites, and phone lookup. Password exposure is checked client-side using the k-anonymity model - the full password never leaves the browser or reaches the server.

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


## Disclaimer

All tools are for educational purposes and authorized use only (your own assets, or assets you have explicit permission to test). No active exploitation or attacks are performed - checks rely exclusively on public data and passive requests.
