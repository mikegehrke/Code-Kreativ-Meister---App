import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Shield,
  DollarSign,
  Mail,
  Database,
  Server,
  Save,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: "NightHub",
    platformDescription: "The ultimate nightlife social platform",
    allowRegistrations: true,
    requireEmailVerification: true,
    enableTwoFactor: false,
    
    // Content Settings
    maxUploadSize: "100",
    allowedFileTypes: "mp4,mp3,jpg,png,gif",
    autoModeration: true,
    contentRetentionDays: "90",
    
    // Payment Settings
    stripePublicKey: "",
    paypalClientId: "",
    commissionRate: "15",
    minimumPayout: "50",
    payoutSchedule: "weekly",
    
    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    emailFromAddress: "noreply@nighthub.com",
    
    // Security Settings
    sessionTimeout: "24",
    passwordMinLength: "8",
    requireStrongPasswords: true,
    enableRateLimiting: true,
    maxLoginAttempts: "5",
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving settings:", settings);
    // Here you would typically save to your backend
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure platform settings and preferences</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="platform" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="platform" className="gap-2">
            <Settings className="h-4 w-4" />
            Platform
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Server className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange("platformName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="platformDescription">Description</Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.platformDescription}
                    onChange={(e) => handleSettingChange("platformDescription", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registration Settings</CardTitle>
                <CardDescription>User registration preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowRegistrations">Allow New Registrations</Label>
                  <Switch
                    id="allowRegistrations"
                    checked={settings.allowRegistrations}
                    onCheckedChange={(checked) => handleSettingChange("allowRegistrations", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <Switch
                    id="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => handleSettingChange("requireEmailVerification", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableTwoFactor">Enable Two-Factor Authentication</Label>
                  <Switch
                    id="enableTwoFactor"
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange("enableTwoFactor", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>File upload and content moderation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                  <Input
                    id="maxUploadSize"
                    type="number"
                    value={settings.maxUploadSize}
                    onChange={(e) => handleSettingChange("maxUploadSize", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => handleSettingChange("allowedFileTypes", e.target.value)}
                    placeholder="mp4,mp3,jpg,png,gif"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoModeration">Enable Auto Moderation</Label>
                  <Switch
                    id="autoModeration"
                    checked={settings.autoModeration}
                    onCheckedChange={(checked) => handleSettingChange("autoModeration", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="contentRetentionDays">Content Retention (Days)</Label>
                  <Input
                    id="contentRetentionDays"
                    type="number"
                    value={settings.contentRetentionDays}
                    onChange={(e) => handleSettingChange("contentRetentionDays", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
                <CardDescription>User authentication and session management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (Hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireStrongPasswords">Require Strong Passwords</Label>
                  <Switch
                    id="requireStrongPasswords"
                    checked={settings.requireStrongPasswords}
                    onCheckedChange={(checked) => handleSettingChange("requireStrongPasswords", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
                <CardDescription>Advanced security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableRateLimiting">Enable Rate Limiting</Label>
                  <Switch
                    id="enableRateLimiting"
                    checked={settings.enableRateLimiting}
                    onCheckedChange={(checked) => handleSettingChange("enableRateLimiting", checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => handleSettingChange("maxLoginAttempts", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>Configure payment providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stripePublicKey">Stripe Public Key</Label>
                  <Input
                    id="stripePublicKey"
                    type="password"
                    value={settings.stripePublicKey}
                    onChange={(e) => handleSettingChange("stripePublicKey", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                  <Input
                    id="paypalClientId"
                    value={settings.paypalClientId}
                    onChange={(e) => handleSettingChange("paypalClientId", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission & Payouts</CardTitle>
                <CardDescription>Revenue sharing and payout settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleSettingChange("commissionRate", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="minimumPayout">Minimum Payout (€)</Label>
                  <Input
                    id="minimumPayout"
                    type="number"
                    value={settings.minimumPayout}
                    onChange={(e) => handleSettingChange("minimumPayout", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                  <Select value={settings.payoutSchedule} onValueChange={(value) => handleSettingChange("payoutSchedule", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>SMTP settings for email delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={settings.smtpHost}
                      onChange={(e) => handleSettingChange("smtpHost", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => handleSettingChange("smtpPort", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emailFromAddress">From Address</Label>
                    <Input
                      id="emailFromAddress"
                      type="email"
                      value={settings.emailFromAddress}
                      onChange={(e) => handleSettingChange("emailFromAddress", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      value={settings.smtpUser}
                      onChange={(e) => handleSettingChange("smtpUser", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleSettingChange("smtpPassword", e.target.value)}
                    />
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Test Email Configuration
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                      System maintenance operations
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      These actions may affect system performance or availability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cache Management</CardTitle>
                  <CardDescription>Manage system cache and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Clear Application Cache
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Database className="h-4 w-4" />
                    Clear Database Cache
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Server className="h-4 w-4" />
                    Restart Application
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Backup & Maintenance</CardTitle>
                  <CardDescription>System backup and maintenance tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full gap-2">
                    <Database className="h-4 w-4" />
                    Create Database Backup
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Run System Maintenance
                  </Button>
                  <Button variant="destructive" className="w-full gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Enable Maintenance Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};