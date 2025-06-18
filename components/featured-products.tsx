import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const featuredProducts = [
  {
    id: 1,
    name: "Amstel Malta",
    price: 2.99,
    originalPrice: 5.99,
    discount: 50,
    image: "/placeholder.svg?height=300&width=300",
    category: "drinks",
    soldOut: true,
  },
  {
    id: 2,
    name: "Coca Cola 500ml",
    price: 1.49,
    originalPrice: 2.99,
    discount: 50,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    soldOut: true,
  },
  {
    id: 3,
    name: "Coca Cola 50cl x 12",
    price: 15.99,
    originalPrice: 20.99,
    discount: 24,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    soldOut: true,
  },
  {
    id: 4,
    name: "Fanta Orange 500ml",
    price: 1.29,
    originalPrice: 1.99,
    discount: 35,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    soldOut: true,
  },
  {
    id: 5,
    name: "Fanta 50cl x 12",
    price: 14.99,
    originalPrice: 17.99,
    discount: 17,
    image: "/placeholder.svg?height=300&width=300",
    category: "beverages",
    soldOut: true,
  },
]

const categories = [
  { id: "drinks", label: "DRINKS" },
  { id: "flour", label: "FLOUR" },
  { id: "beverages", label: "BEVERAGES" },
  { id: "frozen", label: "FROZEN" },
  { id: "rice", label: "RICE" },
  { id: "pap", label: "PAP" },
]

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">DISCOUNTS AND PROMOTIONS</h2>
        </div>

        <Tabs defaultValue="drinks" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {featuredProducts
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Badge variant="destructive" className="absolute top-2 left-2">
                            -{product.discount}%
                          </Badge>
                          {product.soldOut && (
                            <Badge variant="secondary" className="absolute top-2 right-2 bg-gray-500">
                              SOLD OUT
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold mb-2 text-sm">{product.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-green-600">£{product.price.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 line-through">
                              £{product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          disabled={product.soldOut}
                          variant={product.soldOut ? "secondary" : "default"}
                        >
                          {product.soldOut ? "Sold Out" : "Add to Cart"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/shop">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
