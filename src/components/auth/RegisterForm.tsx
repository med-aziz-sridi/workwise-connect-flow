import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-toastify';

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Confirm your password' }),
  role: z.enum(['freelancer', 'provider']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { registerWithEmail, loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'freelancer',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      // First, check if the email already exists
      const { data: existingUser } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      // If we get a successful response but the user doesn't exist, the OTP won't be sent
      // but there's no specific error for this. Let's check the user table directly
      const { data: existingProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', data.email)
        .limit(1);
      
      if (profileError) throw profileError;
      
      if (existingProfiles && existingProfiles.length > 0) {
        setError(`This email is already in use. Did you mean to <a href="/login" class="text-blue-600 hover:underline">Sign in</a> or <a href="/reset-password" class="text-blue-600 hover:underline">Reset your password</a>?`);
        return;
      }
      
      // Proceed with registration if email doesn't exist
      await registerWithEmail(data.email, data.password, data.name, data.role);
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account.",
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      // Note: onSuccess will not be called here since Google OAuth redirects
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Google');
    }
  };

  if (registrationSuccess) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <AlertTitle className="text-green-800 text-lg font-semibold">Registration Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          <p className="mb-4">Please check your email to confirm your account.</p>
          <p className="text-sm">Once confirmed, you'll be able to sign in to your account.</p>
          <Button variant="link" className="p-0 mt-2" asChild>
            <Link to="/login">Return to Login</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 8.13161C15.5 7.55161 15.4563 6.98161 15.3563 6.43161H8V9.31161H12.2188C12.0375 10.2616 11.4812 11.0766 10.6406 11.6116V13.4816H13.1906C14.6625 12.1416 15.5 10.3116 15.5 8.13161Z" fill="#4285F4"/>
          <path d="M8 15.9999C10.1 15.9999 11.8625 15.2899 13.1906 13.4812L10.6406 11.6112C9.93751 12.0812 9.02501 12.3612 8.00001 12.3612C5.98751 12.3612 4.2875 11.0399 3.66251 9.24988H1.02501V11.1699C2.34376 13.9887 4.97501 15.9999 8 15.9999Z" fill="#34A853"/>
          <path d="M3.6625 9.25C3.5 8.80999 3.4063 8.35 3.4063 7.88C3.4063 7.41 3.5 6.95001 3.6625 6.51001V4.59001H1.025C0.55 5.61001 0.28125 6.73 0.28125 7.88C0.28125 9.03 0.55 10.15 1.025 11.17L3.6625 9.25Z" fill="#FBBC05"/>
          <path d="M8 3.39899C9.15625 3.39899 10.1938 3.82149 11.0063 4.58149L13.2688 2.31899C11.8625 0.985992 10.1 0.169992 8 0.169992C4.97501 0.169992 2.34376 2.18124 1.02501 4.99999L3.66251 6.91999C4.2875 5.12999 5.98751 3.39899 8 3.39899Z" fill="#EA4335"/>
        </svg>
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>I am a</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="freelancer" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Freelancer
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="provider" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Job Provider
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && (
            <div className="text-sm font-medium text-destructive">
              {error.includes("reset your password") ? (
                <p>
                  {error.split("Did you mean to")[0]} 
                  Did you mean to <Link to="/login" className="text-blue-600 hover:underline" onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('[aria-label="Forgot password?"]')?.dispatchEvent(
                      new MouseEvent('click', { bubbles: true })
                    );
                  }}>Reset your password</Link>?
                </p>
              ) : (
                <p>{error}</p>
              )}
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
