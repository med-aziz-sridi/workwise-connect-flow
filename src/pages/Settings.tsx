
import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Lock, Bell, UserCog, ArrowLeft } from 'lucide-react';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  applicationUpdates: z.boolean(),
  newMessages: z.boolean(),
  marketingEmails: z.boolean(),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

const Settings: React.FC = () => {
  const { user } = useAuth();
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      applicationUpdates: true,
      newMessages: true,
      marketingEmails: false,
    },
  });
  
  const onPasswordSubmit = (data: PasswordFormValues) => {
    // In a real app, this would update the user's password
    console.log('Password update data:', data);
    
    // Reset form
    passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    
    // Show success message
    alert('Password updated successfully!');
  };
  
  const onNotificationSubmit = (data: NotificationFormValues) => {
    // In a real app, this would update notification preferences
    console.log('Notification settings:', data);
    
    // Show success message
    alert('Notification preferences updated!');
  };
  
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">You need to be logged in to view settings</h1>
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/profile" className="flex items-center text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Profile
          </Link>
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
      </div>
      
      <Tabs defaultValue="security" className="w-full">
        <TabsList className="mb-8 grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="security" className="gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Update your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-2">
                    <Button type="submit">Update Password</Button>
                  </div>
                </form>
              </Form>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Account Deletion</h3>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications and updates
              </CardDescription>
            </CardHeader>
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                <CardContent className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Email Notifications</FormLabel>
                          <FormDescription>
                            Receive email notifications for important updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="applicationUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Application Updates</FormLabel>
                          <FormDescription>
                            Get notified when your job application status changes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="newMessages"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Messages</FormLabel>
                          <FormDescription>
                            Receive notifications when you get new messages
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="marketingEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Marketing Emails</FormLabel>
                          <FormDescription>
                            Receive news, updates, and offers from Freeness
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                
                <CardFooter>
                  <Button type="submit">Save Preferences</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
