"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setupDatabase } from "@/lib/db-setup"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: any } | null>(null)

  const handleSetup = async () => {
    setLoading(true)
    try {
      const setupResult = await setupDatabase()
      setResult(setupResult)
    } catch (error) {
      setResult({ success: false, error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md flex items-center justify-center min-h-screen">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">SurveyMadness Setup</CardTitle>
          <CardDescription>Initialize the database for your polling application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This will create the necessary database and tables for the SurveyMadness application.</p>
          {result && (
            <div
              className={`p-3 rounded mb-4 ${
                result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {result.success
                ? "Database setup completed successfully! You can now use the application."
                : `Setup failed: ${result.error?.message || "Unknown error"}`}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetup} disabled={loading} className="w-full">
            {loading ? "Setting up..." : "Setup Database"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

