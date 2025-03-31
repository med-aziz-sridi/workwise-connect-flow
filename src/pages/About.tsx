
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Code, Users, Shield, GlassWater, Zap } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Freeness</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connecting talented freelancers with businesses and individuals looking for skilled professionals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 mb-6">
            Freeness was founded with a simple yet powerful mission: to create a platform that connects talented 
            freelancers with the businesses and individuals who need their skills, all while eliminating unnecessary 
            barriers and excessive fees.
          </p>
          <p className="text-lg text-gray-600">
            We believe in creating meaningful connections that benefit both freelancers and clients, 
            fostering a community where quality work is recognized and fairly compensated.
          </p>
        </div>
        
        <div className="relative">
          <div className="bg-blue-100 rounded-lg h-full w-full absolute -top-6 -right-6"></div>
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop" 
            alt="Team collaboration" 
            className="rounded-lg relative z-10 h-full w-full object-cover"
          />
        </div>
      </div>
      
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Passionate Community</h3>
              <p className="text-gray-600">
                We foster a community of passionate freelancers and businesses who care deeply about their work and the connections they make.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Quality</h3>
              <p className="text-gray-600">
                We prioritize trust and quality, ensuring that every interaction on our platform is secure, transparent, and valuable.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <GlassWater className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-gray-600">
                We believe in being transparent with our community about how our platform works, our fees, and our policies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-2xl p-8 md:p-12 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Growing Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a freelancer looking for your next exciting project or a business searching for the perfect talent to bring your vision to life, Freeness is the platform for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/register">Join as a Freelancer</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Join as a Client</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gray-100 rounded-full h-48 w-48 mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" 
                alt="Sarah Johnson" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Sarah Johnson</h3>
            <p className="text-blue-600 mb-2">Founder & CEO</p>
            <p className="text-gray-600">
              Former freelance designer who built Freeness to solve the problems she experienced firsthand.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full h-48 w-48 mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" 
                alt="David Chen" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">David Chen</h3>
            <p className="text-blue-600 mb-2">CTO</p>
            <p className="text-gray-600">
              Tech leader with a passion for building platforms that connect people and create opportunities.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-gray-100 rounded-full h-48 w-48 mx-auto mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop" 
                alt="Maya Rodriguez" 
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-1">Maya Rodriguez</h3>
            <p className="text-blue-600 mb-2">Head of Community</p>
            <p className="text-gray-600">
              Community builder focused on creating a supportive environment for freelancers and clients alike.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to get started?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Join thousands of freelancers and businesses already using Freeness to connect, collaborate, and create amazing work together.
        </p>
        <Button asChild size="lg">
          <Link to="/register">Create Your Free Account</Link>
        </Button>
      </div>
    </div>
  );
};

export default About;
