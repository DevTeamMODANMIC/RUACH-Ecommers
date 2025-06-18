import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, ArrowLeft, Share2, Bookmark, MessageSquare, ThumbsUp, Heart } from "lucide-react"

// Mock blog posts data
const blogPosts = [
  {
    id: "1",
    title: "The Health Benefits of African Superfoods",
    excerpt: "Discover the nutritional powerhouses that have been staples in African cuisine for centuries.",
    content: `
      <p>Africa is home to some of the most nutritionally dense foods on the planet, many of which have been consumed for centuries but are only now gaining global recognition for their impressive health benefits. These "superfoods" are packed with essential nutrients, antioxidants, and medicinal properties that can enhance overall wellbeing and help combat various health issues.</p>
      
      <h2>Moringa: The Miracle Tree</h2>
      <p>Often called the "miracle tree" or "tree of life," moringa is native to parts of Africa and Asia and has been used in traditional medicine for thousands of years. The leaves of this remarkable tree contain:</p>
      <ul>
        <li>7 times more vitamin C than oranges</li>
        <li>4 times more calcium than milk</li>
        <li>4 times more vitamin A than carrots</li>
        <li>3 times more potassium than bananas</li>
        <li>2 times more protein than yogurt</li>
      </ul>
      
      <p>Moringa is often dried and ground into powder, making it easy to add to smoothies, soups, and sauces. Its anti-inflammatory and antioxidant properties have been linked to reduced blood pressure, lower cholesterol, and improved immune function.</p>
      
      <h2>Baobab: The Upside-Down Tree</h2>
      <p>The fruit of Africa's iconic baobab tree produces a powder that contains more than 10 times the vitamin C of oranges, plus high levels of calcium, magnesium, and potassium. The fibrous fruit is naturally dehydrated in the shell, making it easy to transform into a powder that can be added to foods and beverages.</p>
      
      <p>Baobab is particularly noted for its:</p>
      <ul>
        <li>Support of digestive health through its prebiotic fiber content</li>
        <li>Blood sugar regulation properties</li>
        <li>Immune system enhancement</li>
        <li>Anti-inflammatory effects</li>
      </ul>
      
      <h2>Hibiscus: More Than Just a Pretty Flower</h2>
      <p>Hibiscus tea, made from the calyces of the hibiscus flower, is a ruby-red beverage enjoyed across Africa. Beyond its vibrant color and tart flavor, hibiscus offers numerous health benefits:</p>
      <ul>
        <li>May help lower blood pressure and cholesterol</li>
        <li>Rich in antioxidants that fight free radicals</li>
        <li>Contains compounds that may help with weight management</li>
        <li>Supports liver health</li>
      </ul>
      
      <p>Traditional medicine practitioners across West Africa have used hibiscus for centuries to treat liver ailments, high blood pressure, and fever.</p>
      
      <h2>Conclusion: African Superfoods in Your Diet</h2>
      <p>Incorporating these African superfoods into your daily diet doesn't require dramatic changes. Start with small additions to foods you already enjoy:</p>
      <ul>
        <li>Sprinkle moringa powder into soups, stews, or smoothies</li>
        <li>Add baobab powder to yogurt, oatmeal, or baked goods</li>
        <li>Enjoy a refreshing glass of hibiscus tea (known as "zobo" in Nigeria or "bissap" in Senegal)</li>
      </ul>
      
      <p>By embracing these nutritional treasures from African culinary traditions, you can enhance your health while experiencing the rich flavors of the continent's diverse food heritage.</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    authorImage: "/placeholder.svg?height=100&width=100",
    author: "Dr. Amara Johnson",
    authorTitle: "Nutritionist & Food Researcher",
    date: "2024-01-15",
    category: "Health & Nutrition",
    readTime: "5 min read",
    tags: ["superfoods", "nutrition", "african cuisine", "health"],
    relatedPosts: [2, 3],
  },
  {
    id: "2",
    title: "Traditional Cooking Methods: Preserving Authentic Flavors",
    excerpt: "Learn about time-honored cooking techniques that bring out the best in traditional ingredients.",
    content: `<p>Traditional cooking methods are the backbone of authentic cuisine...</p>`,
    image: "/placeholder.svg?height=600&width=1200",
    authorImage: "/placeholder.svg?height=100&width=100",
    author: "Chef Kwame Asante",
    authorTitle: "Executive Chef & Culinary Historian",
    date: "2024-01-12",
    category: "Cooking Tips",
    readTime: "7 min read",
    tags: ["cooking methods", "traditional cuisine", "food preparation"],
    relatedPosts: [1, 3],
  },
  {
    id: "3",
    title: "Spice Guide: Essential Seasonings for African Cuisine",
    excerpt: "A comprehensive guide to the spices that define the rich flavors of African cooking.",
    content: `<p>The diverse spice palette of African cuisine creates its distinctive flavors...</p>`,
    image: "/placeholder.svg?height=600&width=1200",
    authorImage: "/placeholder.svg?height=100&width=100",
    author: "Fatima Al-Rashid",
    authorTitle: "Spice Merchant & Food Writer",
    date: "2024-01-10",
    category: "Ingredients",
    readTime: "6 min read",
    tags: ["spices", "seasonings", "flavor", "ingredients"],
    relatedPosts: [1, 2],
  },
]

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id)
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }
  
  return {
    title: `${post.title} | Ayotayo Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  }
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = blogPosts.find((post) => post.id === params.id)
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }
  
  const relatedPosts = blogPosts.filter((related) => 
    post.relatedPosts.includes(Number(related.id))
  )
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Button variant="outline" size="sm" className="bg-black/50 text-white border-white/30 mb-6" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <div className="border-t border-b py-6 my-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Share this post:</span>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">42</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">18</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Bio */}
            <div className="bg-muted p-6 rounded-lg flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{post.author}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.authorTitle}</p>
                <p className="text-sm">
                  An experienced food expert specializing in traditional cooking methods and ingredients.
                  Passionate about preserving culinary heritage and promoting healthy eating through cultural foods.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-8">
              {/* Categories */}
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/blog?category=health-nutrition" className="text-sm hover:text-green-600 transition-colors">
                      Health & Nutrition
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=cooking-tips" className="text-sm hover:text-green-600 transition-colors">
                      Cooking Tips
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=ingredients" className="text-sm hover:text-green-600 transition-colors">
                      Ingredients
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=recipes" className="text-sm hover:text-green-600 transition-colors">
                      Recipes
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=food-culture" className="text-sm hover:text-green-600 transition-colors">
                      Food Culture
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Related Posts */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map((related) => (
                    <div key={related.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/blog/${related.id}`} className="font-medium hover:text-green-600 transition-colors line-clamp-2 text-sm">
                          {related.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">{formatDate(related.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      href={`/blog?tag=${tag}`}
                      key={tag}
                      className="bg-secondary px-3 py-1 rounded-full text-xs hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 