import { defineConfig } from 'astro/config';
const origin = process.env.SITE_URL || 'https://elaena-brokers.dheerazkishore99.chatgpt.site';
const site = new URL(origin);
if (site.protocol !== 'https:' || site.pathname !== '/' || site.search || site.hash) {
  throw new Error('SITE_URL must be an HTTPS origin without a path, query or fragment.');
}
export default defineConfig({
  site: site.origin,
  output: 'static',
  trailingSlash: 'always',
  server: { host: true }
});
