import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Search, User, Phone, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Category } from '../../types';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const { data: categories } = useFirebaseData<Record<string, Category>>('categories');
  const { data: settings } = useFirebaseData<{siteName?: string; contactPhone?: string; contactEmail?: string}>('settings');

  const activeCategories = categories ? 
    Object.entries(categories).filter(([_, cat]) => cat.isActive).slice(0, 6) : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>{settings?.contactPhone || '+91 9876543210'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>{settings?.contactEmail || 'support@dropshop.com'}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              🚚 Free Shipping on Orders Above ₹499 | 📞 24/7 Support
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {settings?.siteName || 'DropShop'}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="hover:text-blue-600 transition-colors font-medium">Home</Link>
            <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">Products</Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors font-medium flex items-center">
                Categories
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                {activeCategories.map(([id, category]) => (
                  <Link
                    key={id}
                    to={`/category/${id}`}
                    className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {category.name.charAt(0)}
                        </div>
                      )}
                      <span>{category.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            <Link to="/about" className="hover:text-blue-600 transition-colors font-medium">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors font-medium">Contact</Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group">
              <ShoppingCart className="h-6 w-6 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                0
              </span>
            </Link>

            {/* Admin Login */}
            <Link to="/admin" className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden mt-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <nav className="space-y-4">
              <Link 
                to="/" 
                className="block hover:text-blue-600 transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="block hover:text-blue-600 transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              <div className="py-2 border-b border-gray-200">
                <div className="font-medium mb-3 text-gray-700">Categories</div>
                <div className="pl-4 space-y-3">
                  {activeCategories.map(([id, category]) => (
                    <Link
                      key={id}
                      to={`/category/${id}`}
                      className="block text-gray-600 hover:text-blue-600 transition-colors py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className="block hover:text-blue-600 transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block hover:text-blue-600 transition-colors font-medium py-2 border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/admin" 
                className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-center hover:from-blue-700 hover:to-purple-700 transition-all sm:hidden font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}