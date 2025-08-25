"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { runFirebaseDiagnostics, monitorProfileFetchPerformance, clearErrorHistory } from "@/lib/firebase-diagnostics"
import { useAuth } from "@/components/auth-provider"

export default function FirebaseConnectivityDebug() {
  const { user, profile, isLoading } = useAuth()
  const [diagnosticsResult, setDiagnosticsResult] = useState<any>(null)
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false)
  const [errorHistory, setErrorHistory] = useState<any>(null)

  useEffect(() => {
    // Load error history on mount
    const history = monitorProfileFetchPerformance()
    setErrorHistory(history)
  }, [])

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true)
    try {
      const result = await runFirebaseDiagnostics()
      setDiagnosticsResult(result)
    } catch (error) {
      console.error("Failed to run diagnostics:", error)
    } finally {
      setIsRunningDiagnostics(false)
    }
  }

  const handleClearHistory = () => {
    clearErrorHistory()
    setErrorHistory({ totalErrors: 0, recentErrors: 0, errors: [] })
  }

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    return status ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (status: boolean | null, text: string) => {
    if (status === null) return <Badge variant="secondary">{text}</Badge>
    return status ? 
      <Badge variant="default" className="bg-green-500">{text}</Badge> : 
      <Badge variant="destructive">{text}</Badge>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Firebase Connectivity Debug</h1>
      
      {/* Auth Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(!isLoading && user !== null)}
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Loading State:</span>
              {getStatusBadge(!isLoading, isLoading ? "Loading..." : "Loaded")}
            </div>
            <div className="flex items-center justify-between">
              <span>User Authenticated:</span>
              {getStatusBadge(user !== null, user ? "Yes" : "No")}
            </div>
            <div className="flex items-center justify-between">
              <span>Profile Loaded:</span>
              {getStatusBadge(profile !== null, profile ? "Yes" : "No")}
            </div>
            {user && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p><strong>User ID:</strong> {user.uid}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {profile && <p><strong>Role:</strong> {profile.role}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error History */}
      {errorHistory && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getStatusIcon(errorHistory.recentErrors === 0)}
                Error History
              </span>
              <Button variant="outline" size="sm" onClick={handleClearHistory}>
                Clear History
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Total Errors:</span>
                <Badge variant={errorHistory.totalErrors > 0 ? "destructive" : "default"}>
                  {errorHistory.totalErrors}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Recent Errors (24h):</span>
                <Badge variant={errorHistory.recentErrors > 0 ? "destructive" : "default"}>
                  {errorHistory.recentErrors}
                </Badge>
              </div>
              {errorHistory.errors.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Recent Errors:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {errorHistory.errors.slice(-5).map((error: any, index: number) => (
                      <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <p><strong>{new Date(error.timestamp).toLocaleString()}</strong></p>
                        <p>{error.error?.message || 'Unknown error'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diagnostics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Firebase Diagnostics
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunningDiagnostics}
              className="flex items-center gap-2"
            >
              {isRunningDiagnostics && <Loader2 className="h-4 w-4 animate-spin" />}
              Run Diagnostics
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {diagnosticsResult ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Firebase Auth</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Connection:</span>
                    {getStatusBadge(diagnosticsResult.auth.connected, 
                      diagnosticsResult.auth.connected ? "Connected" : "Disconnected")}
                  </div>
                  {diagnosticsResult.auth.error && (
                    <p className="text-red-600 text-sm">{diagnosticsResult.auth.error}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Firestore</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Connection:</span>
                    {getStatusBadge(diagnosticsResult.firestore.connected,
                      diagnosticsResult.firestore.connected ? "Connected" : "Disconnected")}
                  </div>
                  {diagnosticsResult.firestore.latency && (
                    <div className="flex items-center justify-between">
                      <span>Latency:</span>
                      <Badge variant={diagnosticsResult.firestore.latency > 3000 ? "destructive" : "default"}>
                        {diagnosticsResult.firestore.latency}ms
                      </Badge>
                    </div>
                  )}
                  {diagnosticsResult.firestore.error && (
                    <p className="text-red-600 text-sm">{diagnosticsResult.firestore.error}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Environment</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Online:</span>
                    {getStatusBadge(diagnosticsResult.environment.online, 
                      diagnosticsResult.environment.online ? "Yes" : "No")}
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connection Type:</span>
                    <Badge variant="secondary">{diagnosticsResult.environment.connection}</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Timestamp:</strong> {new Date(diagnosticsResult.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Click "Run Diagnostics" to test Firebase connectivity</p>
          )}
        </CardContent>
      </Card>

      {/* Troubleshooting Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">If you're experiencing profile fetch timeouts:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Check your internet connection stability</li>
                <li>Try refreshing the page</li>
                <li>Clear browser cache and cookies</li>
                <li>Disable browser extensions temporarily</li>
                <li>Try using an incognito/private browsing window</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">If Firestore latency is high (&gt;3000ms):</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Check your internet connection speed</li>
                <li>Try switching to a different network</li>
                <li>Contact your ISP if the issue persists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}