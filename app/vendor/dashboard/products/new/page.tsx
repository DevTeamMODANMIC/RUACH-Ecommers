"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useVendor } from "@/hooks/use-vendor"
import { addProduct } from "@/lib/firebase-products"
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import Image from "next/image"
import { createCategory, getCategories } from "@/lib/firebase-categories"

export default function VendorAddProductPage() {
  const { vendor } = useVendor()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [cloudinaryImages, setCloudinaryImages] = useState<Array<{ publicId: string; url: string; alt?: string }>>([])
  const [categories, setCategories] = useState<Array<{id:string,name:string}>>([])
  const [newCategory, setNewCategory] = useState('')

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    inStock: true,
    stockQuantity: "100",
  })

  useEffect(() => {
    const fetchCats = async () => {
      const list = await getCategories()
      setCategories(list)
    }
    fetchCats()
  }, [])

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const createdCategory = await createCategory({
        name: newCategory.trim(),
        vendorId: vendor?.uid
      })

      // Update categories list and select the new category
      setCategories(prev => [...prev, createdCategory])
      setFormData(prev => ({ ...prev, category: createdCategory.id }))
      setNewCategory('')
    } catch (error) {
      console.error("Failed to create category:", error)
      alert("Could not create category. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCloudinaryUpload = (publicId: string, url: string, alt?: string) => {
    setCloudinaryImages((prev) => [...prev, { publicId, url, alt: alt || formData.name }])
  }

  const handleRemoveCloudinaryImage = (publicId: string) => {
    setCloudinaryImages((prev) => prev.filter((img) => img.publicId !== publicId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendor) return
    if (cloudinaryImages.length === 0) {
      alert("Please upload at least one product image.")
      return
    }
    
    setSubmitting(true)
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        displayCategory: categories.find(c => c.id === formData.category)?.name || formData.category,
        images: cloudinaryImages.map(img => img.url),
        cloudinaryImages,
        cloudinaryMigrated: true,
        inStock: formData.inStock,
        stockQuantity: parseInt(formData.stockQuantity),
        origin: "",
        availableCountries: ["Nigeria"],
        tags: [],
        reviews: { average: 0, count: 0 },
        vendorId: vendor.uid,
      }
      
      const id = await addProduct(productData as any)
      router.push(`/vendor/dashboard/products/${id}`)
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!vendor) return <div>Loading vendor information...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="description">Product Description</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="price">Price (₦)</Label>
            <Input id="price" type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <div className="flex items-center space-x-2">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-grow border rounded p-2"
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="New category" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full"
                />
                {newCategory.trim() && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCreateCategory}
                    className="absolute right-0 top-0 mt-1 mr-1"
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input id="stockQuantity" type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
        </div>
        <div>
          <Label>Product Images</Label>
          <CloudinaryUploadWidget
            onUploadSuccess={handleCloudinaryUpload}
            buttonText="Upload Images"
            multiple
          />
          {cloudinaryImages.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {cloudinaryImages.map((image) => (
                <div key={image.publicId} className="relative">
                  <Image
                    src={image.url}
                    alt={image.alt || "Product image"}
                    width={150}
                    height={150}
                    className="rounded-md object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleRemoveCloudinaryImage(image.publicId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Save Product"}
          {submitting && "Saving..."}
        </Button>
      </form>
    </div>
  )
} 