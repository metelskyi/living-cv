import { NextResponse } from 'next/server';
import { getGitHubConfig, readStatsFromGitHub, writeStatsToGitHub } from '@/lib/github';
import { getClientIp } from '@/lib/utils';
import { createHash } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Stats {
  totalVisits: number;
  uniqueVisitors: number;
  seenIPs: string[];
}

function hashIP(ip: string): string {
  return createHash('sha256').update(ip).digest('hex');
}

async function readStats(): Promise<Stats | null> {
  const cfg = getGitHubConfig();
  if (!cfg) return null;
  const file = await readStatsFromGitHub();
  if (!file) return null;
  return JSON.parse(file.content) as Stats;
}

function createDefaultStats(): Stats {
  return { totalVisits: 0, uniqueVisitors: 0, seenIPs: [] };
}

export async function GET() {
  const cfg = getGitHubConfig();
  if (!cfg) {
    return NextResponse.json(createDefaultStats());
  }
  try {
    const cached = await readStats();
    if (!cached) {
      return NextResponse.json(createDefaultStats());
    }
    return NextResponse.json({
      totalVisits: cached.totalVisits,
      uniqueVisitors: cached.uniqueVisitors,
    });
  } catch {
    return NextResponse.json(createDefaultStats());
  }
}

export async function POST(req: Request) {
  const cfg = getGitHubConfig();
  if (!cfg) {
    return NextResponse.json({ totalVisits: 0, uniqueVisitors: 0 });
  }

  try {
    const file = await readStatsFromGitHub();
    const stats: Stats = file
      ? (JSON.parse(file.content) as Stats)
      : createDefaultStats();
    const sha = file?.sha;

    stats.totalVisits += 1;

    const ip = getClientIp(req.headers);
    const h = hashIP(ip);
    if (!stats.seenIPs.includes(h)) {
      stats.seenIPs.push(h);
      stats.uniqueVisitors += 1;
    }

    const newContent = JSON.stringify(stats, null, 2) + '\n';
    await writeStatsToGitHub(newContent, sha || '');

    return NextResponse.json({
      totalVisits: stats.totalVisits,
      uniqueVisitors: stats.uniqueVisitors,
    });
  } catch {
    return NextResponse.json({ totalVisits: 0, uniqueVisitors: 0 });
  }
}
