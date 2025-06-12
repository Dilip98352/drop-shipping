import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Settings } from '../../types';
import { database } from '../../firebase/config';
import { ref, update } from 'firebase/database';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SettingsManagement() {
  const { data: settings, loading } = useFirebaseData<Settings>('settings');
  
  const [formData, setFormData] = useState<Settings>({
    facebookPixelId: '',
    showFakePurchase: true,
    siteName: 'DropShop',
    siteDescription: 'Your trusted dropshipping partner for quality products at amazing prices.',
    contactEmail: 'support@dropshop.com',
    contactPhone: '+91 9876543210'
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await update(ref(database, 'settings'), formData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Error updating settings');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings Management</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Site Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Site Name</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Site Description</label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Marketing Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Marketing Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={formData.facebookPixelId || ''}
                  onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Facebook Pixel ID"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Add your Facebook Pixel ID to track conversions and optimize ads
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showFakePurchase"
                  checked={formData.showFakePurchase}
                  onChange={(e) => setFormData({ ...formData, showFakePurchase: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="showFakePurchase" className="text-sm font-medium">
                  Show Fake Purchase Notifications
                </label>
              </div>
              <p className="text-xs text-gray-600">
                Display "X people just bought this" notifications to encourage purchases
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t pt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2">Getting Started</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>📝 <strong>Step 1:</strong> Update your site information and contact details</p>
          <p>📊 <strong>Step 2:</strong> Add your Facebook Pixel ID to track conversions</p>
          <p>🏷️ <strong>Step 3:</strong> Create product categories from the Categories tab</p>
          <p>📦 <strong>Step 4:</strong> Add products with images and descriptions</p>
          <p>🖼️ <strong>Step 5:</strong> Create attractive banners for your homepage</p>
          <p>💰 <strong>Step 6:</strong> Enable fake purchase notifications to boost conversions</p>
        </div>
      </div>
    </div>
  );
}