import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, User, Search } from "lucide-react"

const blogPosts = [
  {
    id: 1,
    title: "The Health Benefits of African Superfoods",
    excerpt:
      "Discover the nutritional powerhouses that have been staples in African cuisine for centuries, from moringa to baobab.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Dr. Amara Johnson",
    date: "2024-01-15",
    category: "Health & Nutrition",
    readTime: "5 min read",
    tags: ["health", "nutrition", "superfoods"],
  },
  {
    id: 2,
    title: "Traditional Cooking Methods: Preserving Authentic Flavors",
    excerpt:
      "Learn about time-honored cooking techniques that bring out the best in traditional ingredients and preserve cultural heritage.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Chef Kwame Asante",
    date: "2024-01-12",
    category: "Cooking Tips",
    readTime: "7 min read",
    tags: ["cooking", "traditional", "techniques"],
  },
  {
    id: 3,
    title: "Spice Guide: Essential Seasonings for African Cuisine",
    excerpt:
      "A comprehensive guide to the spices that define the rich flavors of African cooking, from berbere to harissa.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Fatima Al-Rashid",
    date: "2024-01-10",
    category: "Ingredients",
    readTime: "6 min read",
    tags: ["spices", "ingredients", "flavors"],
  },
  {
    id: 4,
    title: "Sustainable Farming Practices in African Agriculture",
    excerpt:
      "Exploring how traditional and modern sustainable farming methods are preserving the environment while producing quality crops.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Dr. Kofi Mensah",
    date: "2024-01-08",
    category: "Sustainability",
    readTime: "8 min read",
    tags: ["sustainability", "farming", "environment"],
  },
  {
    id: 5,
    title: "The Art of Fermentation in African Cuisine",
    excerpt:
      "Understanding the role of fermentation in creating unique flavors and preserving foods in African culinary traditions.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Chef Aisha Okonkwo",
    date: "2024-01-05",
    category: "Food Science",
    readTime: "6 min read",
    tags: ["fermentation", "preservation", "tradition"],
  },
  {
    id: 6,
    title: "Building Community Through Food: African Diaspora Stories",
    excerpt: "How food connects African communities worldwide and preserves cultural identity across generations.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Sarah Adebayo",
    date: "2024-01-03",
    category: "Culture",
    readTime: "9 min read",
    tags: ["community", "culture", "diaspora"],
  },
]

const categories = [
  "All",
  "Health & Nutrition",
  "Cooking Tips",
  "Ingredients",
  "Sustainability",
  "Food Science",
  "Culture",
]

export default function BlogPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover recipes, cooking tips, and stories about the rich culinary traditions we celebrate.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search blog posts..." className="pl-10" />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button key={category} variant="outline" size="sm" className="hover:bg-green-600 hover:text-white">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">Featured</Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4" variant="secondary">
                  {blogPosts[0].category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  <Link href={`/blog/${blogPosts[0].id}`} className="hover:text-green-600 transition-colors">
                    {blogPosts[0].title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blogPosts[0].date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <Button asChild className="w-fit">
                  <Link href={`/blog/${blogPosts[0].id}`}>Read More</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
