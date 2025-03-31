
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Check, Search, Briefcase, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      navigate(user.role === 'freelancer' ? '/freelancer/dashboard' : '/provider/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the perfect freelance services for your business
            </h1>
            <p className="text-xl mb-8">
              Connect with talented professionals and get your projects done quickly and efficiently.
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
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Freeness Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple steps to start working with talented professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Post a Job</h3>
              <p className="text-gray-600">
                Create a detailed job posting to attract the right talents for your project.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Review Applications</h3>
              <p className="text-gray-600">
                Browse applications from skilled freelancers and review their portfolios.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Hire & Work Together</h3>
              <p className="text-gray-600">
                Select the best match for your project and start working together immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Freeness</h2>
            <p className="mt-4 text-xl text-gray-600">The platform that makes freelancing seamless and efficient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Verified Professionals</h3>
                <p className="mt-2 text-gray-600">
                  All freelancers on our platform are verified to ensure high-quality work and professionalism.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Secure Payments</h3>
                <p className="mt-2 text-gray-600">
                  Our secure payment system ensures that both freelancers and clients are protected.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Quality Work</h3>
                <p className="mt-2 text-gray-600">
                  Our platform connects you with top-tier talent to ensure your projects are completed to the highest standard.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <Check className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">24/7 Support</h3>
                <p className="mt-2 text-gray-600">
                  Our dedicated support team is available around the clock to help with any issues or questions.
                </p>
              </div>
            </div>
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
