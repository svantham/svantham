import { getSvanthamData } from '@/lib/get-data';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getSvanthamData();
  return <HomeClient initialData={data} />;
}
