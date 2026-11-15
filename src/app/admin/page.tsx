import type { Metadata } from 'next';
import AdminApp from './AdminApp';

export const metadata: Metadata = { title: 'Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-static';

export default function AdminPage() {
  return <AdminApp />;
}
