"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle, RefreshCw } from "lucide-react"

interface ConnectionStatus {
  success: boolean
  message: string
  storesFound?: number
  apiKeyConfigured?: boolean
}

export function APIConnectionTest() {
  const [testing, setTesting] = useState(false)
  const [status, setStatus] = useState<ConnectionStatus | null>(null)

  const testConnection = async () => {
    setTesting(true)
    setStatus(null)

    try {
      const response = await fetch("/api/instacart/test-connection")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: "Failed to connect to API. Please check your network connection.",
        apiKeyConfigured: false,
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instacart API Connection</CardTitle>
        <CardDescription>Test your Instacart Developer Platform API connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button onClick={testConnection} disabled={testing} className="bg-[#4A7C59] hover:bg-[#3d6849]">
            {testing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Test Connection
              </>
            )}
          </Button>

          {status && (
            <Badge variant={status.success ? "default" : "destructive"} className="flex items-center gap-1">
              {status.success ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3" />
                  Failed
                </>
              )}
            </Badge>
          )}
        </div>

        {status && (
          <div className="rounded-lg border p-4 space-y-2">
            <p className="text-sm font-medium">{status.message}</p>
            {status.success && status.storesFound !== undefined && (
              <p className="text-sm text-muted-foreground">Found {status.storesFound} stores in test area</p>
            )}
            {!status.success && !status.apiKeyConfigured && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">How to add your API key:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Click "Vars" in the left sidebar</li>
                  <li>Click "Add Variable"</li>
                  <li>Name: INSTACART_API_KEY</li>
                  <li>Value: Your Instacart API key</li>
                  <li>Click "Save" and test again</li>
                </ol>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
