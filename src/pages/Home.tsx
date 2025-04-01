
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Check, Search, Briefcase, Users, ArrowRight, Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Home: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      // Redirect based on user role
      navigate(profile.role === 'freelancer' ? '/freelancer/dashboard' : '/provider/dashboard', { replace: true });
    }
  }, [user, profile, navigate]);

  if (user && profile) {
    return null; // Render nothing while redirecting
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      text: "Freeness made it easy to find consistent freelance work with great clients. I've been able to grow my business and portfolio substantially.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      name: "Michael Chen",
      role: "Web Developer",
      text: "The quality of clients and projects on this platform is impressive. I've built long-term relationships that have been beneficial for my career.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
    {
      name: "Acme Corp",
      role: "Software Company",
      text: "We've found amazing talent through Freeness for our projects. The quality of work and communication has exceeded our expectations.",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Find top talent or work that matters
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with skilled professionals and get your projects done quickly and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/register">Join as a Freelancer</Link>
                </Button>
                <Button size="lg" asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                  <Link to="/register">Hire a Freelancer</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
                alt="Freelancer working" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">1000+</p>
              <p className="text-gray-600">Freelancers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">500+</p>
              <p className="text-gray-600">Companies</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">5000+</p>
              <p className="text-gray-600">Projects</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="text-gray-600">Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Freeness Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">Simple steps to start working with talented professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">1</div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
              <p className="text-gray-600">
                Create a detailed job posting to attract the right talents for your project.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">2</div>
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Applications</h3>
              <p className="text-gray-600">
                Browse applications from skilled freelancers and review their portfolios.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center relative">
              <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">3</div>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborate & Pay</h3>
              <p className="text-gray-600">
                Select the best match for your project and start working together immediately.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/register" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Freeness</h2>
            <p className="mt-4 text-xl text-gray-600">The platform that makes freelancing seamless and efficient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                All freelancers on our platform are verified to ensure high-quality work and professionalism.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Our secure payment system ensures that both freelancers and clients are protected.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Work</h3>
              <p className="text-gray-600">
                Our platform connects you with top-tier talent to ensure your projects are completed to the highest standard.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is available around the clock to help with any issues or questions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Instant Messaging</h3>
              <p className="text-gray-600">
                Communicate directly with freelancers or clients through our built-in messaging system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden charges or surprise fees for any of our services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">Trusted by freelancers and businesses worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of freelancers and businesses who trust Freeness for their work needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" asChild variant="outline" className="bg-transparent border-white hover:bg-white/10">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
