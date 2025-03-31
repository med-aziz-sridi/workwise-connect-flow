
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = (data: ContactFormValues) => {
    // In a real app, this would send the contact form data to a backend
    console.log('Contact form data:', data);
    
    // Show success message
    alert('Your message has been sent! We will get back to you soon.');
    
    // Reset form
    form.reset();
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions or feedback? We'd love to hear from you. Reach out to our team using the form below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
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
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is your message about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Get in touch with our team directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Our Address</h3>
                  <p className="text-gray-600">
                    123 Freelance Street<br />
                    San Francisco, CA 94107<br />
                    United States
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Email Us</h3>
                  <p className="text-gray-600">
                    info@freeness.com<br />
                    support@freeness.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Call Us</h3>
                  <p className="text-gray-600">
                    +1 (555) 123-4567<br />
                    Mon-Fri 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Live Chat</h3>
                  <p className="text-gray-600">
                    Available on our website<br />
                    Mon-Fri 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-3">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="bg-blue-100 hover:bg-blue-200 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-lg overflow-hidden h-96 mb-16">
        {/* Google Map iframe would go here in a real app */}
        <div className="w-full h-full flex items-center justify-center bg-blue-50">
          <p className="text-gray-500">Interactive map would be displayed here</p>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-2xl p-8 md:p-12 text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
          Find quick answers to common questions about our platform and services.
        </p>
        <Button>Visit Our FAQ Page</Button>
      </div>
    </div>
  );
};

export default Contact;
