# Realtime Now/Devlog Write Endpoint (Cloudflare Worker)

This worker lets your site update `assets/now/now.live.json` without exposing a GitHub token in the browser.

## 1) Deploy the worker

Create a new Cloudflare Worker and paste `workers/now-sync-worker.js`.

## 2) Set Worker environment variables

Plain vars:

- `ALLOWED_ORIGIN=https://orpheelyre.github.io`
- `GITHUB_OWNER=orpheelyre`
- `GITHUB_REPO=orpheelyre.github.io`
- `GITHUB_BRANCH=main`
- `NOW_FILE_PATH=assets/now/now.live.json`

Secrets:

- `ADMIN_PASSWORD=6476` (or your new admin password)
- `GITHUB_TOKEN=<fine-grained PAT with Contents: Read and write on this repo>`

## 3) Copy your Worker URL

For example: `https://now-sync.your-subdomain.workers.dev`

## 4) Wire the site config

Set `SITE.nowSync.writeUrl` in `data.js` to:

`https://now-sync.your-subdomain.workers.dev`

## 5) Push the site

After deploy + push:

- Visitors can read shared updates in realtime.
- Only people with the admin password can unlock + publish updates.
- No GitHub token prompt appears in the browser.
