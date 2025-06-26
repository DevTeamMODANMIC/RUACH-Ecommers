"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, Check, Trash2 } from "lucide-react"
import Link from "next/link"
import { addProduct, getAllProducts, deleteProduct, getProducts } from "@/lib/firebase-products"
import { useToast } from "@/hooks/use-toast"
import { useAdmin } from "@/hooks/use-admin"

// Import the hardcoded product data from featured-products and product-showcase
const featuredProducts = [
  {
    id: "coca-cola-50cl",
    name: "Coca-Cola 50cl",
    description: "Refreshing Coca-Cola soft drink in a 50cl bottle. Perfect for quenching your thirst.",
    price: 1.20,
    images: ["/product_images/beverages/coke-50cl-250x250.jpg"],
    rating: 4.9,
    reviewCount: 124,
    bestseller: true,
    category: "Beverages",
    inStock: true,
    stockQuantity: 100,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "soft drinks", "cola"]
  },
  {
    id: "fanta-50cl",
    name: "Fanta Orange 50cl",
    description: "Vibrant orange-flavored Fanta soft drink in a 50cl bottle. Sweet, fizzy, and refreshing.",
    price: 1.20,
    images: ["/product_images/beverages/Fanta-PET-Bottles-50cl.jpg"],
    rating: 4.7,
    reviewCount: 86,
    new: true,
    category: "Beverages",
    discount: 10,
    inStock: true,
    stockQuantity: 100,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "soft drinks", "orange"]
  },
  {
    id: "aani-basmati-rice",
    name: "Aani Basmati Rice",
    description: "Premium Aani Basmati Rice - 10kg. Aromatic long grain rice perfect for special meals.",
    price: 19.99,
    images: ["/product_images/rice/Aani-Basmatic-rice-10kg-4-250x250.jpg"],
    rating: 4.9,
    reviewCount: 31,
    category: "Rice & Grains",
    inStock: true,
    stockQuantity: 50,
    origin: "India",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["rice", "basmati", "grains"]
  },
  {
    id: "ayoola-pounded-yam",
    name: "Ayoola Pounded Yam Flour",
    description: "Authentic Ayoola Pounded Yam Flour. Easy to prepare, smooth texture with authentic taste.",
    price: 8.99,
    images: ["/product_images/flour/Ayoola-pounded-yam-250x250.jpg"],
    rating: 4.8,
    reviewCount: 26,
    popular: true,
    category: "Flour",
    inStock: true,
    stockQuantity: 75,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria", "Ghana"],
    tags: ["flour", "pounded yam", "nigerian"]
  },
  {
    id: "cat-fish",
    name: "Cat Fish",
    description: "Fresh Cat Fish. Perfect for traditional Nigerian fish stews and soups.",
    price: 9.99,
    images: ["/product_images/meat/Cat-fish-250x250.jpg"],
    rating: 4.8,
    reviewCount: 17,
    category: "Meat & Fish",
    inStock: true,
    stockQuantity: 30,
    origin: "Nigeria",
    availableCountries: ["United Kingdom"],
    tags: ["fish", "meat", "seafood"]
  },
  {
    id: "everyday-seasoning",
    name: "Everyday Seasoning",
    description: "All-purpose Everyday Seasoning blend. Perfect for enhancing the flavor of any dish.",
    price: 4.50,
    images: ["/product_images/spices/Everyday-seasoning-250x250.jpg"],
    rating: 4.8,
    reviewCount: 28,
    bestseller: true,
    category: "Spices & Seasonings",
    inStock: true,
    stockQuantity: 120,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria", "Ghana"],
    tags: ["spices", "seasoning", "cooking"]
  },
  {
    id: "bitter-leaf",
    name: "Bitter Leaf",
    description: "Fresh Bitter Leaf. Essential ingredient for traditional Nigerian soups and stews.",
    price: 3.50,
    images: ["/product_images/vegetables/Bitter-leaf-250x250.jpg"],
    rating: 4.6,
    reviewCount: 12,
    new: true,
    category: "Vegetables & Fruits",
    inStock: true,
    stockQuantity: 40,
    origin: "Nigeria",
    availableCountries: ["United Kingdom"],
    tags: ["vegetables", "bitter leaf", "soup ingredients"]
  },
  {
    id: "cerelac-honey-wheat",
    name: "Cerelac Honey and Wheat",
    description: "Cerelac Honey and Wheat baby food - 1kg. Nutritious baby cereal with honey and wheat.",
    price: 8.99,
    images: ["/product_images/food/Cerelac-Honey-and-wheat-1kg-1-250x250.jpg"],
    rating: 4.8,
    reviewCount: 24,
    category: "Food",
    inStock: true,
    stockQuantity: 45,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["food", "baby food", "cereal"]
  }
]

const beverageProducts = [
  {
    id: "sprite-50cl",
    name: "Sprite",
    description: "Refreshing lemon-lime Sprite soft drink in a 50cl bottle.",
    price: 1.20,
    images: ["/product_images/beverages/Sprite-50cl-1-250x250.jpg"],
    rating: 4.8,
    reviewCount: 92,
    category: "Beverages",
    inStock: true,
    stockQuantity: 100,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "soft drinks", "sprite"]
  },
  {
    id: "amstel-malta",
    name: "Amstel Malta",
    description: "Non-Alcoholic Malt Drink - rich in vitamins and nutrients.",
    price: 1.50,
    images: ["/product_images/beverages/Amstel-malta-150x150.jpg"],
    rating: 4.6,
    reviewCount: 58,
    category: "Beverages",
    inStock: true,
    stockQuantity: 80,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "malt drink", "non-alcoholic"]
  },
  {
    id: "malta-guinness-pack",
    name: "Malta Guinness",
    description: "Pack of 24 Cans - Premium non-alcoholic malt drink.",
    price: 28.99,
    images: ["/product_images/beverages/malta_guinness_can_(pack_of_24).png"],
    rating: 4.9,
    reviewCount: 73,
    category: "Beverages",
    inStock: true,
    stockQuantity: 40,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "malt drink", "non-alcoholic", "bulk"]
  },
  {
    id: "schweppes-chapman",
    name: "Schweppes Chapman",
    description: "Pack of 24 - Refreshing fruit-flavored soft drink.",
    price: 26.99,
    images: ["/product_images/beverages/swhwappes_chapman_pack_of_24.png"],
    rating: 4.8,
    reviewCount: 42,
    category: "Beverages",
    new: true,
    inStock: true,
    stockQuantity: 35,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "soft drinks", "chapman", "bulk"]
  },
  {
    id: "lacasera",
    name: "LaCasera",
    description: "Sparkling Apple Drink - Sweet and refreshing.",
    price: 1.35,
    images: ["/product_images/beverages/Lacasara-150x150.jpg"],
    rating: 4.7,
    reviewCount: 36,
    category: "Beverages",
    new: true,
    inStock: true,
    stockQuantity: 90,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "soft drinks", "apple"]
  },
  {
    id: "maltina-can",
    name: "Maltina",
    description: "Premium Malt Drink (Can) - Vitamin-rich non-alcoholic beverage.",
    price: 1.40,
    images: ["/product_images/beverages/Maltina-can-150x150.jpg"],
    rating: 4.8,
    reviewCount: 64,
    category: "Beverages",
    inStock: true,
    stockQuantity: 85,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["beverages", "malt drink", "non-alcoholic"]
  }
]

// Add more products from other categories
const additionalProducts = [
  {
    id: "abacha-african-salad",
    name: "Abacha",
    description: "African Salad - Traditional Nigerian delicacy.",
    price: 5.99,
    images: ["/product_images/food/Abacha-250x250.jpg"],
    rating: 4.6,
    reviewCount: 18,
    category: "Food",
    inStock: true,
    stockQuantity: 25,
    origin: "Nigeria",
    availableCountries: ["United Kingdom"],
    tags: ["food", "salad", "nigerian"]
  },
  {
    id: "nigerian-bread",
    name: "Nigerian Bread",
    description: "Traditional Soft Bread - Freshly baked.",
    price: 3.50,
    images: ["/product_images/food/bread-250x250.png"],
    rating: 4.4,
    reviewCount: 12,
    bestseller: true,
    category: "Food",
    inStock: true,
    stockQuantity: 30,
    origin: "Nigeria",
    availableCountries: ["United Kingdom"],
    tags: ["food", "bread", "bakery"]
  },
  {
    id: "butter-mint-sweets",
    name: "Butter Mint Sweets",
    description: "Classic Creamy Mints - Perfect after-dinner treat.",
    price: 2.25,
    images: ["/product_images/food/Butter-mint-sweets-1-250x250.jpg"],
    rating: 4.3,
    reviewCount: 9,
    category: "Food",
    inStock: true,
    stockQuantity: 50,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["food", "sweets", "candy"]
  },
  {
    id: "bawa-pepper",
    name: "Bawa Pepper",
    description: "Traditional Spice - Adds rich flavor to any dish.",
    price: 3.99,
    images: ["/product_images/spices/Bawa-pepper-250x250.jpg"],
    rating: 4.7,
    reviewCount: 21,
    bestseller: true,
    category: "Spices",
    inStock: true,
    stockQuantity: 60,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["spices", "pepper", "seasoning"]
  },
  {
    id: "ducros-thyme",
    name: "Ducros Thyme",
    description: "Premium Herb - Essential for soups and stews.",
    price: 2.99,
    images: ["/product_images/spices/Ducros-thyme-250x250.jpg"],
    rating: 4.5,
    reviewCount: 16,
    category: "Spices",
    inStock: true,
    stockQuantity: 70,
    origin: "United Kingdom",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["spices", "herbs", "thyme"]
  },
  {
    id: "ayoola-plantain-flour",
    name: "Ayoola Plantain Flour",
    description: "100% Natural Plantains - Perfect for traditional recipes.",
    price: 7.50,
    images: ["/product_images/flour/Ayoola-Plantain-flour-250x250.jpg"],
    rating: 4.6,
    reviewCount: 14,
    category: "Flour",
    inStock: true,
    stockQuantity: 45,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["flour", "plantain", "baking"]
  },
  {
    id: "yam-flour",
    name: "Yam Flour",
    description: "Traditional - 4kg. Perfect for making amala.",
    price: 12.99,
    images: ["/product_images/flour/yam-flour-4kg-250x250.png"],
    rating: 4.7,
    reviewCount: 19,
    category: "Flour",
    inStock: true,
    stockQuantity: 35,
    origin: "Nigeria",
    availableCountries: ["United Kingdom", "Nigeria"],
    tags: ["flour", "yam", "amala"]
  },
  {
    id: "agbalumo",
    name: "Agbalumo",
    description: "African Star Apple - Sweet and tangy tropical fruit.",
    price: 5.99,
    images: ["/product_images/vegetables/Agbalumo-250x250.jpg"],
    rating: 4.7,
    reviewCount: 14,
    new: true,
    category: "Vegetables & Fruits",
    inStock: true,
    stockQuantity: 20,
    origin: "Nigeria",
    availableCountries: ["United Kingdom"],
    tags: ["fruits", "african", "tropical"]
  }
]

// Combine all products
const allProducts = [...featuredProducts, ...beverageProducts, ...additionalProducts]

export default function ImportProductsPage() {
  const { toast } = useToast()
  const { isAdmin, loading } = useAdmin()
  const [importing, setImporting] = useState(false)
  const [importedProducts, setImportedProducts] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removedCount, setRemovedCount] = useState(0)
  const [detailedError, setDetailedError] = useState<string | null>(null)

  const handleRemoveAll = async () => {
    setRemoving(true)
    setError(null)
    setDetailedError(null)
    
    try {
      // Get all products from Firestore
      const productsResponse = await getProducts({}, 100)
      const products = productsResponse.products
      
      console.log(`Found ${products.length} products to remove`);
      
      // Delete each product
      let count = 0
      for (const product of products) {
        if (product.id) {
          try {
            await deleteProduct(product.id)
            count++
            console.log(`Deleted product: ${product.name} (${product.id})`);
          } catch (err) {
            console.error(`Failed to delete product ${product.id}:`, err);
          }
        }
      }
      
      setRemovedCount(count)
      toast({
        title: "Products Removed",
        description: `Successfully removed ${count} products from the database.`,
        variant: "default",
      })
    } catch (err: any) {
      console.error("Failed to remove products:", err)
      setError(err.message || "Failed to remove products. Please try again.")
      setDetailedError(JSON.stringify(err, null, 2))
      toast({
        title: "Removal Failed",
        description: err.message || "Failed to remove products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRemoving(false)
    }
  }

  const handleImport = async () => {
    setImporting(true)
    setError(null)
    setDetailedError(null)
    setImportedProducts([])
    
    const successfulImports: string[] = [];

    try {
      console.log(`Starting import of ${allProducts.length} products`);
      
      // Import each product
      for (const product of allProducts) {
        try {
          console.log(`Importing product: ${product.name}`);
          
          // Prepare product data for Firestore
          const productData: any = {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            images: product.images || [],
            inStock: product.inStock || true,
            stockQuantity: product.stockQuantity || 100,
            origin: product.origin || "United Kingdom",
            availableCountries: product.availableCountries || ["United Kingdom"],
            tags: product.tags || [],
            reviews: {
              average: product.rating || 0,
              count: product.reviewCount || 0,
            },
            // Add any UI display properties
            bestseller: product.bestseller || false,
            new: product.new || false,
            popular: product.popular || false,
            discount: product.discount || 0,
            // Add these fields required by the schema
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
          // Only add originalPrice if it exists
          if (product.originalPrice) {
            productData.originalPrice = product.originalPrice;
          }

          // Add the product to Firestore
          const productId = await addProduct(productData)
          console.log(`Successfully imported ${product.name} with ID: ${productId}`);
          successfulImports.push(product.name);
          setImportedProducts(prev => [...prev, product.name])
        } catch (err: any) {
          console.error(`Failed to import product ${product.name}:`, err)
          setDetailedError(prev => prev ? `${prev}\n\nError importing ${product.name}: ${err.message}` : `Error importing ${product.name}: ${err.message}`)
        }
      }

      if (successfulImports.length > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successfulImports.length} products.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Import Failed",
          description: "No products were imported. Check the console for details.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      console.error("Import failed:", err)
      setError(err.message || "Import failed. Please try again.")
      setDetailedError(JSON.stringify(err, null, 2))
      toast({
        title: "Import Failed",
        description: err.message || "Failed to import products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
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
    return null // Router will redirect in layout
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div>
          <Button variant="outline" size="sm" className="mb-4" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Import Demo Products</h1>
          <p className="text-gray-500 mt-2">
            Import the products shown on the homepage into your Firestore database.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Remove Existing Products</CardTitle>
            <CardDescription>
              Remove all existing products from your Firestore database before importing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This will permanently delete all products currently in your Firestore database.
              This action cannot be undone.
            </p>
            {removedCount > 0 && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md text-sm">
                Successfully removed {removedCount} products from the database.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleRemoveAll} 
              disabled={removing}
              variant="destructive"
              className="w-full"
            >
              {removing ? (
                <>Removing Products...</>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove All Products
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Product Import</CardTitle>
            <CardDescription>
              This will add {allProducts.length} demo products to your Firestore database.
              These are the same products displayed on the homepage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Products to be imported: {allProducts.length}
              </p>
              <div className="max-h-60 overflow-y-auto">
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {allProducts.map((product) => (
                    <li key={product.id} className="text-gray-600">
                      {product.name} - £{product.price.toFixed(2)} - {product.category}
                      {importedProducts.includes(product.name) && (
                        <span className="ml-2 text-green-600 inline-flex items-center">
                          <Check className="h-3 w-3 mr-1" /> Imported
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {detailedError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mt-2 max-h-40 overflow-y-auto">
                  <p className="font-semibold mb-1">Detailed Error:</p>
                  <pre className="whitespace-pre-wrap text-xs">{detailedError}</pre>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleImport} 
              disabled={importing}
              className="w-full"
            >
              {importing ? (
                <>Importing Products...</>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Import Products
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Firebase configuration:", {
                  isAdmin,
                  productsToImport: allProducts.length,
                  importedProducts: importedProducts.length
                });
                toast({
                  title: "Debug Info",
                  description: "Check browser console for debug information",
                  variant: "default",
                });
              }}
              className="w-full"
            >
              Debug Firebase Connection
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 