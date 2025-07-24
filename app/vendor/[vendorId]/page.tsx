import { getVendor, getVendorProducts } from "@/lib/firebase-vendors"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface Props {
  params: { vendorId: string }
}

export default async function VendorStorefront({ params }: Props) {
  const vendor = await getVendor(params.vendorId)
  if (!vendor || !vendor.approved) {
    notFound()
  }
  const products = await getVendorProducts(params.vendorId)

  return (
    <div className="container mx-auto py-16">
      <div className="flex items-center gap-4 mb-10">
        {vendor.logoUrl && (
          <Image src={vendor.logoUrl} alt={vendor.shopName} width={80} height={80} className="rounded-full" />
        )}
        <div>
          <h1 className="text-3xl font-bold">{vendor.shopName}</h1>
          <p className="text-gray-600 max-w-2xl">{vendor.bio}</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Products</h2>
      {products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <Link key={p.id} href={`/products/${p.id}`} className="block">
              <div className="border rounded overflow-hidden">
                <Image src={p.cloudinaryImages?.[0]?.url || p.images?.[0] || ""} alt={p.name} width={300} height={300} className="object-cover w-full h-48" />
                <div className="p-2">
                  <h3 className="font-medium text-sm mb-1 truncate">{p.name}</h3>
                  <span className="text-green-700 font-semibold">£{p.price?.toFixed(2)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 