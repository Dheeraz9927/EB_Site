import type { APIRoute } from 'astro';
import { coverageKeys, coveragePages } from '../data/coverage';
const paths = ['/', ...coverageKeys.map(key => `/${coveragePages[key].slug}/`), '/privacy/'];
export const GET: APIRoute = ({ site }) => new Response(
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${new URL(p, site).href}</loc></url>`).join('')}</urlset>`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
