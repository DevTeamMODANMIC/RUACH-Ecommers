"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { getUserProfile, type UserProfile, diagnoseProfileFetchIssue } from "@/lib/firebase-auth"

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set a maximum loading timeout as a safety net
    const maxLoadingTimeout = setTimeout(() => {
      console.warn("AuthProvider: Maximum loading timeout reached, forcing loading to false")
      setIsLoading(false)
    }, 20000) // 20 seconds max

    const fetchUserProfileWithRetry = async (uid: string, maxRetries = 3): Promise<any> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`AuthProvider: Attempting to fetch profile for user ${uid} (attempt ${attempt}/${maxRetries})`)
          
          const profilePromise = getUserProfile(uid)
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Profile fetch timeout on attempt ${attempt}`)), 8000)
          )
          
          const userProfile = await Promise.race([profilePromise, timeoutPromise])
          console.log(`AuthProvider: Successfully fetched profile for user ${uid} on attempt ${attempt}`)
          return userProfile
        } catch (error) {
          console.warn(`AuthProvider: Profile fetch attempt ${attempt} failed:`, error)
          
          if (attempt === maxRetries) {
            console.error(`AuthProvider: All ${maxRetries} profile fetch attempts failed for user ${uid}`)
            throw error
          }
          
          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
          console.log(`AuthProvider: Waiting ${delay}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log("AuthProvider: onAuthStateChanged - user:", user ? user.uid : "null", "email:", user ? user.email : "null");
        setUser(user)

        if (user) {
          try {
            const userProfile = await fetchUserProfileWithRetry(user.uid)
            setProfile(userProfile)
          } catch (profileError) {
            console.error("AuthProvider: All profile fetch attempts failed:", profileError)
            
            // Run diagnostics to help identify the issue
            try {
              const diagnosis = await diagnoseProfileFetchIssue(user.uid)
              console.error("AuthProvider: Profile fetch diagnosis:", diagnosis)
              
              // You could also show this to the user in a toast or modal
              if (typeof window !== 'undefined' && window.localStorage) {
                localStorage.setItem('lastProfileFetchError', JSON.stringify({
                  timestamp: new Date().toISOString(),
                  uid: user.uid,
                  error: profileError,
                  diagnosis
                }))
              }
            } catch (diagError) {
              console.error("AuthProvider: Failed to run diagnostics:", diagError)
            }
            
            // Create a minimal profile fallback to prevent auth issues
            const fallbackProfile = {
              uid: user.uid,
              email: user.email || '',
              name: user.displayName || user.email?.split('@')[0] || 'User',
              role: 'user' as const,
              preferences: {
                currency: 'GBP',
                language: 'en',
                notifications: true
              },
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            console.log("AuthProvider: Using fallback profile for user", user.uid)
            setProfile(fallbackProfile)
          }
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error("AuthProvider: Error in auth state change:", error)
      } finally {
        clearTimeout(maxLoadingTimeout)
        setIsLoading(false)
      }
    })

    return () => {
      unsubscribe()
      clearTimeout(maxLoadingTimeout)
    }
  }, [])

  const adminEmail = ""

  const login = async (email: string, password: string) => {
    const { signIn } = await import("@/lib/firebase-auth")
    await signIn(email, password)
  }

  const register = async (email: string, password: string, name: string) => {
    const { signUp } = await import("@/lib/firebase-auth")
    const { user, profile } = await signUp(email, password, name)
    setProfile(profile)
  }

  const loginWithGoogle = async (): Promise<void> => {
    const { signInWithGoogle } = await import("@/lib/firebase-auth")
    const getUserInfo = await signInWithGoogle()

    const configBody = {
          email: getUserInfo?.email,
          password: ""
      }

    const config = {
        'method': "POST",
        'headers': {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        "body": JSON.stringify(configBody)
    }

    // console.log(configBody)
    const handeLocalhostLocation = "https://custome-backend.onrender.com/api/"
    const url = `${handeLocalhostLocation}SMTP`


    const response = await fetch(url, config)
    let data = await response.json();
    console.log("getUserInfo", getUserInfo)
    
    return
  }

  const logout = async () => {
    const { logOut } = await import("@/lib/firebase-auth")
    await logOut()
  }

  const resetPassword = async (email: string) => {
    const { resetPassword: resetPwd } = await import("@/lib/firebase-auth")
    await resetPwd(email)
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user")

    const { updateUserProfile } = await import("@/lib/firebase-auth")
    await updateUserProfile(user.uid, updates)

    // Update local profile state
    if (profile) {
      setProfile({ ...profile, ...updates })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
