import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The requested page could not be found.',
  alternates: { canonical: null },
  robots: { index: false, follow: false },
  openGraph: { title: 'Page not found', description: 'The requested page could not be found.', images: [] },
  twitter: { title: 'Page not found', description: 'The requested page could not be found.', images: [] },
};
export default function NotFound() { return <div style={{ fontFamily: 'system-ui,sans-serif', height: '100vh', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><div><style dangerouslySetInnerHTML={{ __html: 'body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}' }} /><h1 className="next-error-h1" style={{ display: 'inline-block', margin: '0 20px 0 0', padding: '0 23px 0 0', fontSize: 24, fontWeight: 500, verticalAlign: 'top', lineHeight: '49px' }}>404</h1><div style={{ display: 'inline-block' }}><h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: '49px', margin: 0 }}>This page could not be found.</h2></div></div></div>; }
