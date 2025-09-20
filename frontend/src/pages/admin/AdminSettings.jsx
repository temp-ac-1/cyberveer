import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, User, Bell, Shield, Globe } from 'lucide-react';

const AdminSettings = () => {
  const [profileData, setProfileData] = useState({
    displayName: 'Admin User',
    email: 'admin@cyberveer.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    newUserRegistration: true,
    newQuizSubmission: true,
    systemAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  });

  const [siteSettings, setSiteSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    quizSubmissions: true,
    publicAccess: true,
    autoApproval: false
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting, value) => {
    setNotifications(prev => ({ ...prev, [setting]: value }));
  };

  const handleSiteSettingChange = (setting, value) => {
    setSiteSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
  };

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications);
  };

  const handleSaveSiteSettings = () => {
    console.log('Saving site settings:', siteSettings);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profileData.displayName}
                onChange={(e) => handleProfileChange('displayName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="gap-2">
            <Save className="h-4 w-4" />
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newUser">New User Registration</Label>
                <p className="text-sm text-muted-foreground">Get notified when new users register</p>
              </div>
              <Switch
                id="newUser"
                checked={notifications.newUserRegistration}
                onCheckedChange={(value) => handleNotificationChange('newUserRegistration', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newQuiz">New Quiz Submission</Label>
                <p className="text-sm text-muted-foreground">Get notified when users submit quizzes</p>
              </div>
              <Switch
                id="newQuiz"
                checked={notifications.newQuizSubmission}
                onCheckedChange={(value) => handleNotificationChange('newQuizSubmission', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="systemAlerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">Critical system notifications</p>
              </div>
              <Switch
                id="systemAlerts"
                checked={notifications.systemAlerts}
                onCheckedChange={(value) => handleNotificationChange('systemAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly analytics reports</p>
              </div>
              <Switch
                id="weeklyReports"
                checked={notifications.weeklyReports}
                onCheckedChange={(value) => handleNotificationChange('weeklyReports', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityAlerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Important security-related notifications</p>
              </div>
              <Switch
                id="securityAlerts"
                checked={notifications.securityAlerts}
                onCheckedChange={(value) => handleNotificationChange('securityAlerts', value)}
              />
            </div>
          </div>

          <Button onClick={handleSaveNotifications} className="gap-2">
            <Save className="h-4 w-4" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Site Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the site in maintenance mode</p>
              </div>
              <Switch
                id="maintenance"
                checked={siteSettings.maintenanceMode}
                onCheckedChange={(value) => handleSiteSettingChange('maintenanceMode', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="userReg">User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new user registrations</p>
              </div>
              <Switch
                id="userReg"
                checked={siteSettings.userRegistration}
                onCheckedChange={(value) => handleSiteSettingChange('userRegistration', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quizSub">Quiz Submissions</Label>
                <p className="text-sm text-muted-foreground">Allow users to take quizzes</p>
              </div>
              <Switch
                id="quizSub"
                checked={siteSettings.quizSubmissions}
                onCheckedChange={(value) => handleSiteSettingChange('quizSubmissions', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="publicAccess">Public Access</Label>
                <p className="text-sm text-muted-foreground">Allow public access to content</p>
              </div>
              <Switch
                id="publicAccess"
                checked={siteSettings.publicAccess}
                onCheckedChange={(value) => handleSiteSettingChange('publicAccess', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoApproval">Auto Approval</Label>
                <p className="text-sm text-muted-foreground">Automatically approve new content</p>
              </div>
              <Switch
                id="autoApproval"
                checked={siteSettings.autoApproval}
                onCheckedChange={(value) => handleSiteSettingChange('autoApproval', value)}
              />
            </div>
          </div>

          <Button onClick={handleSaveSiteSettings} className="gap-2">
            <Save className="h-4 w-4" />
            Save Site Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium text-orange-900">Security Notice</p>
              <p className="text-sm text-orange-700">
                Changes to critical settings will be logged for security purposes. 
                Please ensure you have proper authorization before making changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
