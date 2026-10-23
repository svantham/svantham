import { ProductPage } from '@/components/product/product-page'
import { getSvanthamData } from '@/lib/get-data'
import { DataProvider } from '@/components/data-provider'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getSvanthamData()
  return (
    <DataProvider data={data}>
      <ProductPage id={id} />
    </DataProvider>
  )
}
