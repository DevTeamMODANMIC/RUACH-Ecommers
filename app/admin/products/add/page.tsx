"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, X, Plus, Loader2 } from "lucide-react"
import { addProduct } from "@/lib/firebase-products"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { useCurrency } from "@/hooks/use-currency"
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget"

const categories = [
  "Vegetables & Fruits",
  "Meat & Poultry",
  "Spices & Seasonings",
  "Grains & Rice",
  "Sauces & Oils",
  "Beverages",
  "Snacks & Sweets",
  "Frozen Foods",
  "Canned & Preserved",
  "Other"
]

const countries = [
  "All", "United Kingdom", "Nigeria", "Ghana", "South Africa", "Kenya", 
  "Cameroon", "Zimbabwe", "Uganda", "Tanzania", "United States"
]

export default function AddProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const { formatPrice } = useCurrency()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [cloudinaryImages, setCloudinaryImages] = useState<Array<{publicId: string, url: string, alt?: string}>>([])
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [] as string[],
    inStock: true,
    stockQuantity: "100",
    origin: "",
    availableCountries: ["United Kingdom"],
    tags: "",
  })

  useEffect(() => {
    const checkAuth = onAuthStateChanged(auth, (user) => {
      setLoading(false)
      if (user) {
        // Here you would check if the user has admin role
        // For demo purposes, we're just checking if the user is authenticated
        setIsAdmin(true)
      } else {
        router.push("/login")
      }
    })

    return () => checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      inStock: checked,
    })
  }

  const handleCountrySelect = (country: string) => {
    let newCountries
    if (country === "All") {
      newCountries = countries.filter(c => c !== "All")
    } else {
      if (formData.availableCountries.includes(country)) {
        newCountries = formData.availableCountries.filter(c => c !== country)
      } else {
        newCountries = [...formData.availableCountries, country]
      }
    }
    setFormData({
      ...formData,
      availableCountries: newCountries,
    })
  }

  const handleAddImageUrl = () => {
    if (imageUrl && !imageUrls.includes(imageUrl)) {
      setImageUrls([...imageUrls, imageUrl])
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    const newUrls = [...imageUrls]
    newUrls.splice(index, 1)
    setImageUrls(newUrls)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    if (cloudinaryImages.length === 0) {
      toast({
        title: "Image required",
        description: "Please upload at least one product image via Cloudinary before saving.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    try {
      // Use the collected image URLs
      let productImages = imageUrls.length > 0 ? imageUrls : ["/product_images/unknown-product.jpg"]

      // Prepare data for Firebase
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: productImages,
        cloudinaryImages: cloudinaryImages.length > 0 ? cloudinaryImages : undefined,
        inStock: formData.inStock,
        stockQuantity: parseInt(formData.stockQuantity),
        origin: formData.origin,
        availableCountries: formData.availableCountries,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
        reviews: {
          average: 0,
          count: 0,
        },
      }

      // Get current user token for authorization
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to add products");
      }

      const idToken = await currentUser.getIdToken();

      // Call our API endpoint
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      const result = await response.json();

      toast({
        title: "Product added",
        description: "The product has been successfully added to Firebase and Cloudinary.",
      })
      router.push("/admin/products")
    } catch (error: any) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Router will redirect
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <Button variant="outline" size="sm" className="mb-6" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-500 mt-2">Create a new product to your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Jollof Rice Spice Mix"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (£) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="9.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Country of Origin *</Label>
              <Select 
                value={formData.origin}
                onValueChange={(value) => handleSelectChange("origin", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country of origin" />
                </SelectTrigger>
                <SelectContent>
                  {countries.filter(c => c !== "All").map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity *</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                placeholder="100"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Switch
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>

          {/* Cloudinary Image Upload Section */}
          <div className="space-y-4">
            <Label>Product Images</Label>
            
            <div className="mb-6 border p-4 rounded-md bg-gray-50">
              <h3 className="text-sm font-medium mb-3">Cloudinary Images (Recommended)</h3>
              <CloudinaryUploadWidget
                onUploadSuccess={(publicId, url) => {
                  setCloudinaryImages([...cloudinaryImages, { publicId, url, alt: formData.name }]);
                }}
                buttonText="Upload Product Image"
              />
              
              {cloudinaryImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {cloudinaryImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square rounded-md overflow-hidden border bg-white">
                        <img 
                          src={image.url} 
                          alt={image.alt || `Product image ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                        onClick={() => {
                          const newImages = [...cloudinaryImages];
                          newImages.splice(index, 1);
                          setCloudinaryImages(newImages);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Alternative URL Input Section */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium mb-3">Alternative URL Method</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button 
                  type="button" 
                  onClick={handleAddImageUrl}
                  disabled={!imageUrl}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter URLs to product images. You can use images from the public/product_images folder.
                <br />
                Example: /product_images/beverages/coke-50cl-250x250.jpg
              </p>
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-xs text-gray-600">
                <p className="font-medium mb-1">Available image directories:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>/product_images/ - Main product images</li>
                  <li>/product_images/beverages/ - Beverage images</li>
                  <li>/public/a/ - Alternative images</li>
                </ul>
              </div>
            </div>
            
            {/* Image URL Previews */}
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square rounded-md overflow-hidden border">
                      <Image
                        src={url}
                        alt={`Product image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/product_images/unknown-product.jpg";
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product..."
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="e.g. spicy, organic, vegan"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Available Countries</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                type="button"
                variant={formData.availableCountries.length === countries.length - 1 ? "default" : "outline"}
                className="text-sm h-8"
                onClick={() => handleCountrySelect("All")}
              >
                All Countries
              </Button>
              {countries.filter(c => c !== "All").map((country) => (
                <Button
                  key={country}
                  type="button"
                  variant={formData.availableCountries.includes(country) ? "default" : "outline"}
                  className="text-sm h-8"
                  onClick={() => handleCountrySelect(country)}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
 