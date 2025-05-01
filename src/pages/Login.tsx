
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

// Define form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      // Error is handled by the login function
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-10">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#61DAFB] p-3 rounded-full mb-4">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                <span className="text-[#61DAFB]">Fitness</span>
                <span>Minder</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access your fitness dashboard
              </p>
            </div>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email" 
                        {...field} 
                        className="h-11"
                      />
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
                      <Input 
                        placeholder="Enter your password" 
                        type="password" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#61DAFB] hover:bg-[#4ecca3] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="flex justify-between items-center text-sm pt-2">
                <Link to="/forgot-password" className="text-[#61DAFB] hover:underline">
                  Forgot Password?
                </Link>
                <Link to="/register" className="text-[#61DAFB] hover:underline">
                  Create Account
                </Link>
              </div>
            </form>
          </Form>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Don't have an account? <Link to="/register" className="text-[#61DAFB] hover:underline">Sign up now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
