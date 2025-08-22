import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">ShopEase</span>
            </div>
            <p className="text-gray-300">
              Your one-stop shop for quality products at great prices. We're committed to providing 
              the best shopping experience online.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/products" className="block text-gray-300 hover:text-white transition-colors">
                Products
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-300 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link to="/returns" className="block text-gray-300 hover:text-white transition-colors">
                Returns & Exchanges
              </Link>
              <Link to="/shipping" className="block text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">support@shopease.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">123 Commerce St, City, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-300 text-sm">
              © 2024 ShopEase. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-white text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;