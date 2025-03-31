
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Freeness
              </span>
            </Link>
            <p className="text-gray-600">
              Connecting talented freelancers with amazing opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              For Freelancers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-gray-600 hover:text-gray-900">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-600 hover:text-gray-900">
                  Showcase Projects
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              For Clients
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/freelancers" className="text-gray-600 hover:text-gray-900">
                  Browse Freelancers
                </Link>
              </li>
              <li>
                <Link to="/my-jobs" className="text-gray-600 hover:text-gray-900">
                  Manage Jobs
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Freeness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
