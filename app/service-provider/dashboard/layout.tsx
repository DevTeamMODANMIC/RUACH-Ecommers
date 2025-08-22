"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  Home,
  Wrench,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  { name: "Overview", href: "/service-provider/dashboard", icon: Home },
  { name: "My Services", href: "/service-provider/dashboard/services", icon: Wrench },
  { name: "Bookings", href: "/service-provider/dashboard/bookings", icon: Calendar },
  { name: "Analytics", href: "/service-provider/dashboard/analytics", icon: BarChart3 },
  { name: "Reviews", href: "/service-provider/dashboard/reviews", icon: MessageSquare },
  { name: "Settings", href: "/service-provider/dashboard/settings", icon: Settings },
]

export default function ServiceProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/service-provider/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">SP Dashboard</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/service-provider/dashboard" && pathname.startsWith(item.href))
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${isActive
                        ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.displayName || user?.email || "Service Provider"}
              </p>
              <p className="text-xs text-gray-500 truncate">Professional</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="ml-2 h-8 w-8"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header for mobile */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Service Provider Dashboard</h1>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}