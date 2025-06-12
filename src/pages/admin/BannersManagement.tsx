import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import { useFirebaseData } from '../../hooks/useFirebaseData';
import { Banner } from '../../types';
import { database } from '../../firebase/config';
import { ref, push, update, remove } from 'firebase/database';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function BannersManagement() {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const { data: banners, loading } = useFirebaseData<Record<string, Banner>>('banners');

  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    subtitle: '',
    link: '',
    order: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const bannerData = {
        ...formData,
        order: parseInt(formData.order) || 0
      };

      if (editingBanner) {
        await update(ref(database, `banners/${editingBanner.id}`), bannerData);
        toast.success('Banner updated successfully!');
      } else {
        await push(ref(database, 'banners'), bannerData);
        toast.success('Banner added successfully!');
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Error saving banner');
      console.error(error);
    }
  };

  const handleEdit = (id: string, banner: Banner) => {
    setEditingBanner({ ...banner, id });
    setFormData({
      imageUrl: banner.imageUrl,
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      link: banner.link || '',
      order: banner.order.toString(),
      isActive: banner.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await remove(ref(database, `banners/${id}`));
        toast.success('Banner deleted successfully!');
      } catch (error) {
        toast.error('Error deleting banner');
        console.error(error);
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await update(ref(database, `banners/${id}`), { isActive: !isActive });
      toast.success(`Banner ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error('Error updating banner status');
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      imageUrl: '',
      title: '',
      subtitle: '',
      link: '',
      order: '',
      isActive: true
    });
    setEditingBanner(null);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  const bannerList = banners ? 
    Object.entries(banners).sort(([_, a], [__, b]) => a.order - b.order) : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Banners Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {bannerList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            No banners found. Add your first banner to get started.
          </div>
        ) : (
          bannerList.map(([id, banner]) => (
            <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title || 'Banner'}
                    className="w-full h-48 md:h-32 object-cover"
                  />
                </div>
                
                <div className="md:w-2/3 p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {banner.title || 'Untitled Banner'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {banner.subtitle && (
                      <p className="text-gray-600 mb-2">{banner.subtitle}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Order: {banner.order}</span>
                      {banner.link && (
                        <span>Link: {banner.link}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(id, banner)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(id, banner.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.isActive 
                          ? 'text-red-600 hover:bg-red-100' 
                          : 'text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle (Optional)</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Link (Optional)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/products or /category/electronics"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active Banner
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingBanner ? 'Update' : 'Add'} Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}