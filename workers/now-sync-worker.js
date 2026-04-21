/**
 * now-sync-worker.js
 * Cloudflare Worker endpoint for now.live/devlog writes.
 *
 * Frontend sends: { password, data, source }
 * Worker validates password and commits `data` to GitHub file.
 */

function encodePathSegments(path) {
  return String(path || '').split('/').map(encodeURIComponent).join('/');
}

function json(body, status, corsOrigin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function noContent(status = 204, corsOrigin = '*') {
  return new Response(null, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function toBase64Utf8(text) {
  const bytes = new TextEncoder().encode(String(text || ''));
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function commitToGithub(env, data) {
  const owner = String(env.GITHUB_OWNER || '').trim();
  const repo = String(env.GITHUB_REPO || '').trim();
  const branch = String(env.GITHUB_BRANCH || 'main').trim() || 'main';
  const path = String(env.NOW_FILE_PATH || 'assets/now/now.live.json').trim();
  const token = String(env.GITHUB_TOKEN || '').trim();

  if (!owner || !repo || !path || !token) {
    throw new Error('Worker is missing GitHub configuration.');
  }

  const fileUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodePathSegments(path)}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'now-sync-worker',
  };

  let sha = '';
  const readRes = await fetch(`${fileUrl}?ref=${encodeURIComponent(branch)}`, { headers });
  if (readRes.ok) {
    const current = await readRes.json();
    sha = String(current?.sha || '').trim();
  } else if (readRes.status !== 404) {
    throw new Error(`GitHub read failed (${readRes.status}).`);
  }

  const content = JSON.stringify(data, null, 2) + '\n';
  const payload = {
    message: `Update now.live ${new Date().toISOString()}`,
    content: toBase64Utf8(content),
    branch,
  };
  if (sha) payload.sha = sha;

  const writeRes = await fetch(fileUrl, {
    method: 'PUT',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!writeRes.ok) {
    const text = await writeRes.text();
    throw new Error(`GitHub write failed (${writeRes.status}): ${text.slice(0, 180)}`);
  }
}

export default {
  async fetch(request, env) {
    const allowedOrigin = String(env.ALLOWED_ORIGIN || '*').trim() || '*';
    const origin = request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigin === '*' ? '*' : (origin === allowedOrigin ? allowedOrigin : allowedOrigin);

    if (request.method === 'OPTIONS') {
      return noContent(204, corsOrigin);
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Only POST is supported.' }, 405, corsOrigin);
    }

    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      return json({ ok: false, error: 'Invalid JSON body.' }, 400, corsOrigin);
    }

    const password = String(body?.password || '').trim();
    const expected = String(env.ADMIN_PASSWORD || '').trim();
    if (!expected || password !== expected) {
      return json({ ok: false, error: 'Admin password is incorrect.' }, 401, corsOrigin);
    }

    const data = body?.data;
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return json({ ok: false, error: 'Missing valid data payload.' }, 400, corsOrigin);
    }

    try {
      await commitToGithub(env, data);
      return json({ ok: true, data }, 200, corsOrigin);
    } catch (err) {
      return json({ ok: false, error: String(err?.message || err) }, 500, corsOrigin);
    }
  },
};
