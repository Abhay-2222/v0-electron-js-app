import { APIConnectionTest } from "@/components/settings/api-connection-test"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export function SettingsScreen() {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <APIConnectionTest />

        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
          </CardHeader>
          {/* Added missing closing tags */}
        </Card>
      </div>
    </div>
  )
}
