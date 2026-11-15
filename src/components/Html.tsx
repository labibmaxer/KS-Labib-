/** Renders a trusted, pre-escaped HTML string (built by lib/templates.ts). */
export default function Html({ html }: { html: string }) {
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />;
}
