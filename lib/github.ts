interface GitHubFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface CommitResponse {
  commit: { sha: string; html_url: string };
  content: { sha: string; html_url: string };
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export function getGitHubConfig(): GitHubConfig | null {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_REPO_BRANCH || 'main';
  const token = process.env.GITHUB_REPO_TOKEN;
  if (!owner || !repo || !token) return null;
  return { owner, repo, branch, token };
}

function apiBase(cfg: GitHubConfig): string {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}`;
}

function authHeaders(cfg: GitHubConfig): Record<string, string> {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'living-cv-admin',
  };
}

export async function getFile(
  cfg: GitHubConfig,
  path: string
): Promise<GitHubFileResponse | null> {
  const res = await fetch(`${apiBase(cfg)}/contents/${encodeURI(path)}?ref=${cfg.branch}`, {
    headers: authHeaders(cfg),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub GET failed: ${res.status} ${text.slice(0, 200)}`);
  }
  return (await res.json()) as GitHubFileResponse;
}

export async function commitFile(
  cfg: GitHubConfig,
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<CommitResponse> {
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch: cfg.branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${apiBase(cfg)}/contents/${encodeURI(path)}`, {
    method: 'PUT',
    headers: { ...authHeaders(cfg), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${text.slice(0, 300)}`);
  }
  return (await res.json()) as CommitResponse;
}

export async function readStatsFromGitHub(): Promise<{ content: string; sha: string } | null> {
  const cfg = getGitHubConfig();
  if (!cfg) return null;
  const file = await getFile(cfg, 'data/stats.json');
  if (!file) return null;
  if (file.encoding !== 'base64') {
    throw new Error(`Unexpected encoding: ${file.encoding}`);
  }
  return {
    content: Buffer.from(file.content, 'base64').toString('utf-8'),
    sha: file.sha,
  };
}

export async function writeStatsToGitHub(
  content: string,
  sha: string,
  message = 'chore(stats): update visit counter'
): Promise<{ url: string; sha: string }> {
  const cfg = getGitHubConfig();
  if (!cfg) throw new Error('GitHub config not configured');
  const result = await commitFile(cfg, 'data/stats.json', content, message, sha);
  return { url: result.commit.html_url, sha: result.content.sha };
}

export async function readCVFromGitHub(): Promise<{ content: string; sha: string } | null> {
  const cfg = getGitHubConfig();
  if (!cfg) return null;
  const file = await getFile(cfg, 'data/cv.json');
  if (!file) return null;
  if (file.encoding !== 'base64') {
    throw new Error(`Unexpected encoding: ${file.encoding}`);
  }
  return {
    content: Buffer.from(file.content, 'base64').toString('utf-8'),
    sha: file.sha,
  };
}

export async function writeCVToGitHub(
  content: string,
  sha: string,
  message = 'chore(cv): update from admin panel'
): Promise<{ url: string; sha: string }> {
  const cfg = getGitHubConfig();
  if (!cfg) throw new Error('GitHub config not configured');
  const result = await commitFile(cfg, 'data/cv.json', content, message, sha);
  return { url: result.commit.html_url, sha: result.content.sha };
}
