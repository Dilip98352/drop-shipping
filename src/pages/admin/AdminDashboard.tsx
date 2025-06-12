import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  Image,
  Tag,
  Megaphone,
  TrendingUp,
  Eye
} from 'lucide-react';
import ProductsManagement from './ProductsManagement';
import CategoriesManagement from './CategoriesManagement';
import BannersManagement from './BannersManagement';
import OrdersManagement from './OrdersManagement';
import SettingsManagement from './SettingsManagement';
import DashboardStats from './DashboardStats';

type Tab = 'dashboard' | 'products' | 'categories' | 'banners' | 'orders' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: BarChart3, color: 'bg-blue-600' },
    { id: 'products' as Tab, label: 'Products', icon: Package, color: 'bg-green-600' },
    { id: 'categories' as Tab, label: 'Categories', icon: Tag, color: 'bg-purple-600' },
    { id: 'banners' as Tab, label: 'Banners', icon: Image, color: 'bg-orange-600' },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart, color: 'bg-red-600' },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings, color: 'bg-gray-600' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats />;
      case 'products':
        return <ProductsManagement />;
      case 'categories':
        return <CategoriesManagement />;
      case 'banners':
        return <BannersManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'settings':
        return <SettingsManagement />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your dropshipping store</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                <span className="font-medium">Welcome back, Admin</span>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>View Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-semibold">Navigation</h3>
                <p className="text-sm text-blue-100">Manage your store</p>
              </div>
              <nav className="space-y-1 p-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-all rounded-lg ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mr-3 ${
                        activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          activeTab === tab.id ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats Card */}
            <div className="mt-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8" />
                <span className="text-2xl font-bold">📈</span>
              </div>
              <h3 className="font-semibold mb-2">Store Performance</h3>
              <p className="text-sm text-green-100">
                Your store is performing well! Keep adding great products.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow-md min-h-[600px]">
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}