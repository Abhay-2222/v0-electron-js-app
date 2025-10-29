"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Palette, Database, Info, Mail, BarChart3, History } from "lucide-react"
import { useState, useMemo } from "react"
import type { WeeklyMealPlans } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { APIConnectionTest } from "@/components/settings/api-connection-test"

interface SettingsProps {
  highContrast: boolean
  onHighContrastChange: (value: boolean) => void
  allMealPlans: WeeklyMealPlans
  weeklyBudget: number
  onViewHistory?: () => void
}

export function Settings({
  highContrast,
  onHighContrastChange,
  allMealPlans,
  weeklyBudget,
  onViewHistory,
}: SettingsProps) {
  const [notifications, setNotifications] = useState(true)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [savedProfile, setSavedProfile] = useState({ fullName: "", email: "", phone: "", bio: "" })
  const { toast } = useToast()

  const handleSaveProfile = () => {
    setSavedProfile({ fullName, email, phone, bio })
    toast({
      title: "Profile saved",
      description: "Your profile changes have been saved successfully.",
    })
  }

  const hasUnsavedChanges =
    fullName !== savedProfile.fullName ||
    email !== savedProfile.email ||
    phone !== savedProfile.phone ||
    bio !== savedProfile.bio

  const analytics = useMemo(() => {
    const weeks = Object.keys(allMealPlans).sort().reverse().slice(0, 4)

    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalSpent = 0
    let mealCount = 0
    const recipeCounts: Record<string, number> = {}

    weeks.forEach((weekKey) => {
      const weekPlan = allMealPlans[weekKey]
      Object.values(weekPlan).forEach((dayMeals) => {
        Object.values(dayMeals).forEach((recipe) => {
          mealCount++
          if (recipe.nutrition) {
            totalCalories += recipe.nutrition.calories
            totalProtein += recipe.nutrition.protein
            totalCarbs += recipe.nutrition.carbs
            totalFat += recipe.nutrition.fat
          }
          if (recipe.cost) {
            totalSpent += recipe.cost
          }
          recipeCounts[recipe.name] = (recipeCounts[recipe.name] || 0) + 1
        })
      })
    })

    const avgCalories = mealCount > 0 ? Math.round(totalCalories / mealCount) : 0
    const avgProtein = mealCount > 0 ? Math.round(totalProtein / mealCount) : 0
    const avgCarbs = mealCount > 0 ? Math.round(totalCarbs / mealCount) : 0
    const avgFat = mealCount > 0 ? Math.round(totalFat / mealCount) : 0
    const avgWeeklySpend = weeks.length > 0 ? totalSpent / weeks.length : 0
    const budgetAdherence = weeklyBudget > 0 ? ((weeklyBudget - avgWeeklySpend) / weeklyBudget) * 100 : 0

    const topRecipes = Object.entries(recipeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    return {
      avgCalories,
      avgProtein,
      avgCarbs,
      avgFat,
      avgWeeklySpend,
      budgetAdherence,
      topRecipes,
      weeksAnalyzed: weeks.length,
      totalMeals: mealCount,
    }
  }, [allMealPlans, weeklyBudget])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* API Connection Test */}
      <APIConnectionTest />

      {/* Profile Section */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription className="text-xs">Manage your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs text-muted-foreground">
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-9 text-sm border-border/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs text-muted-foreground">
              Email Address
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-9 text-sm border-border/40"
              />
              <Button variant="outline" size="sm" className="h-9 px-4 border-border/40 shrink-0 bg-transparent">
                Update
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs text-muted-foreground">
              Phone Number <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-9 text-sm border-border/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs text-muted-foreground">
              About <span className="text-muted-foreground/60">(optional)</span>
            </Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself and your dietary preferences..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[80px] text-sm resize-none border-border/40"
            />
          </div>

          <Button className="w-full h-9 text-sm" onClick={handleSaveProfile} disabled={!hasUnsavedChanges}>
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Preferences</CardTitle>
              <CardDescription className="text-xs">Customize your experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/40">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast" className="text-sm cursor-pointer">
                High Contrast Mode
              </Label>
              <p className="text-xs text-muted-foreground">Increase contrast for visibility</p>
            </div>
            <Switch
              id="high-contrast"
              checked={highContrast}
              onCheckedChange={onHighContrastChange}
              aria-label="Toggle high contrast mode"
              className="data-[state=checked]:bg-primary scale-90"
            />
          </div>

          <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/40">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-sm cursor-pointer">
                Meal Reminders
              </Label>
              <p className="text-xs text-muted-foreground">Get notified about meals</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
              aria-label="Toggle meal reminders"
              className="data-[state=checked]:bg-primary scale-90"
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management Section */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">Data</CardTitle>
              <CardDescription className="text-xs">Manage your meal data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {onViewHistory && (
            <Button
              variant="outline"
              className="w-full justify-start h-9 text-sm border-border/40 bg-transparent"
              size="sm"
              onClick={onViewHistory}
            >
              <History className="h-4 w-4 mr-2" aria-hidden="true" />
              View Week History
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full justify-start h-9 text-sm border-border/40 bg-transparent"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" aria-hidden="true" />
            Export Meal Plans
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive h-9 text-sm border-border/40 bg-transparent"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" aria-hidden="true" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Section */}
      {analytics.totalMeals > 0 && (
        <Card className="shadow-sm border-border/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-base">Analytics</CardTitle>
                <CardDescription className="text-xs">
                  Last {analytics.weeksAnalyzed} weeks • {analytics.totalMeals} meals
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-0.5">Avg Calories</p>
                <p className="text-lg">{analytics.avgCalories}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground mb-0.5">Avg Protein</p>
                <p className="text-lg">{analytics.avgProtein}g</p>
              </div>
            </div>

            {weeklyBudget > 0 && (
              <div className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Avg Weekly Spend</span>
                  <span className="text-lg">${analytics.avgWeeklySpend.toFixed(2)}</span>
                </div>
                <div className="mt-1 text-xs">
                  {analytics.budgetAdherence >= 0 ? (
                    <span className="text-green-600">
                      ${(weeklyBudget - analytics.avgWeeklySpend).toFixed(2)} under budget
                    </span>
                  ) : (
                    <span className="text-red-600">
                      ${Math.abs(weeklyBudget - analytics.avgWeeklySpend).toFixed(2)} over budget
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-base">About</CardTitle>
              <CardDescription className="text-xs">App info & support</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-muted-foreground">Version</span>
            <span className="text-sm">1.0.0</span>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start h-9 text-sm border-border/40 bg-transparent"
            size="sm"
          >
            <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
