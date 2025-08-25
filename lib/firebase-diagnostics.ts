"use client"

import { auth, db } from "./firebase"
import { checkFirebaseConnectivity, diagnoseProfileFetchIssue } from "./firebase-auth"

// Utility functions for debugging Firebase connectivity issues

export const runFirebaseDiagnostics = async () => {
  console.log("🔍 Running Firebase Diagnostics...")
  
  const results = {
    timestamp: new Date().toISOString(),
    auth: {
      connected: false,
      currentUser: null as any,
      error: null as string | null
    },
    firestore: {
      connected: false,
      latency: null as number | null,
      error: null as string | null
    },
    environment: {
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
      online: typeof window !== 'undefined' ? window.navigator.onLine : true,
      connection: typeof window !== 'undefined' && 'connection' in window.navigator ? 
        (window.navigator as any).connection?.effectiveType : 'unknown'
    }
  }

  // Check Auth status
  try {
    results.auth.currentUser = auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName
    } : null
    results.auth.connected = true
  } catch (error: any) {
    results.auth.error = error.message
  }

  // Check Firestore connectivity
  try {
    const connectivity = await checkFirebaseConnectivity()
    results.firestore.connected = connectivity.connected
    results.firestore.latency = connectivity.latency || null
    results.firestore.error = connectivity.error || null
  } catch (error: any) {
    results.firestore.error = error.message
  }

  console.log("📊 Firebase Diagnostics Results:", results)
  return results
}

export const monitorProfileFetchPerformance = () => {
  if (typeof window === 'undefined') return

  const errors = JSON.parse(localStorage.getItem('profileFetchErrors') || '[]')
  const recentErrors = errors.filter((error: any) => 
    new Date().getTime() - new Date(error.timestamp).getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
  )

  if (recentErrors.length > 0) {
    console.warn(`⚠️ Found ${recentErrors.length} profile fetch errors in the last 24 hours:`)
    recentErrors.forEach((error: any, index: number) => {
      console.warn(`${index + 1}. ${error.timestamp}: ${error.error?.message || 'Unknown error'}`)
    })
  }

  return {
    totalErrors: errors.length,
    recentErrors: recentErrors.length,
    errors: recentErrors
  }
}

export const clearErrorHistory = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('profileFetchErrors')
    localStorage.removeItem('lastProfileFetchError')
    console.log("✅ Cleared error history")
  }
}

// Auto-run diagnostics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    runFirebaseDiagnostics()
    monitorProfileFetchPerformance()
  }, 2000)
}