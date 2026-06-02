import chromium from '@sparticuz/chromium';
import puppeteer, { type Browser } from 'puppeteer-core';
import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 1000;

/**
 * Server-side PDF generation via Puppeteer + chromium.
 *
 * Works locally when PUPPETEER_EXECUTABLE_PATH points to a system Chrome.
 *
 * On Vercel (production), this route is bypassed — the homepage's
 * "Save as PDF" button uses the browser's built-in window.print()
 * instead, because @sparticuz/chromium's 66MB binary exceeds Vercel
 * Hobby plan's 50MB function size limit.
 *
 * If you upgrade to Vercel Pro (250MB), this route will work.
 */

async function getBrowser(): Promise<Browser> {
  const isProduction = process.env.NODE_ENV === 'production';
  const isVercel = !!process.env.VERCEL;

  if (isVercel || isProduction) {
    const executablePath = await chromium.executablePath();
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath,
      headless: true,
    });
  }

  try {
    return await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    throw new Error(
      'Local Chrome not found. Install Chrome or run in production (Vercel). ' +
        'Alternatively set PUPPETEER_EXECUTABLE_PATH. ' +
        (e instanceof Error ? e.message : '')
    );
  }
}

export async function GET(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`pdf:${ip}`, RATE_LIMIT, WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: Math.ceil(limit.resetIn / 1000),
      },
      {
        status: 429,
        headers: { 'Retry-After': Math.ceil(limit.resetIn / 1000).toString() },
      }
    );
  }

  let browser: Browser | null = null;
  try {
    const targetUrl = `${SITE_URL}/?mode=classic&print=true`;
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', bottom: '0', left: '0', right: '0' },
      preferCSSPageSize: true,
    });

    return new NextResponse(new Blob([new Uint8Array(pdf)], { type: 'application/pdf' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="CV_Ihor_Metelskyi.pdf"',
        'Cache-Control': 'no-store',
        'X-RateLimit-Remaining': limit.remaining.toString(),
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'PDF generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
