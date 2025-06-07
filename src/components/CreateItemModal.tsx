import React, { useState, useEffect } from 'react';
import { X, Folder, Bookmark, Check, AlertCircle } from 'lucide-react';
import { ItemType, DesktopItem, ItemFormData, BaseFormData, isBookmarkItem, CreateItemModalProps } from '../types';
import { validateUrl } from '../utils/validation';

const CreateItemModal = React.memo<CreateItemModalProps>(({
  type,
  onSubmit,
  onClose,
  editingItem
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
  const [isValidating, setIsValidating] = useState(false);
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; error?: string } | null>(null);
  const [urlValidationTimeout, setUrlValidationTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      if (isBookmarkItem(editingItem)) {
        setUrl(editingItem.url);
      }
      setNotes(editingItem.notes || '');
    }
  }, [editingItem]);

  useEffect(() => {
    if (urlValidationTimeout) {
      clearTimeout(urlValidationTimeout);
    }

    if (type === 'bookmark' && url.trim()) {
      setIsValidating(true);
      const timeout = setTimeout(async () => {
        try {
          const result = await validateUrl(url);
          setUrlValidation(result);
        } catch (error) {
          setUrlValidation({ isValid: false, error: 'Failed to validate URL' });
        } finally {
          setIsValidating(false);
        }
      }, 500);
      setUrlValidationTimeout(timeout);
    } else {
      setUrlValidation(null);
    }

    return () => {
      if (urlValidationTimeout) {
        clearTimeout(urlValidationTimeout);
      }
    };
  }, [url, type]);

  const validateForm = () => {
    const newErrors: { name?: string; url?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (type === 'bookmark') {
      if (!url.trim()) {
        newErrors.url = 'URL is required';
      } else if (!isValidUrl(url)) {
        newErrors.url = 'Please enter a valid URL';
      } else if (urlValidation && !urlValidation.isValid) {
        newErrors.url = urlValidation.error || 'Invalid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const baseData: BaseFormData = {
      name: name.trim(),
      notes: notes.trim() || undefined
    };

    const formData: ItemFormData = type === 'bookmark' 
      ? {
          ...baseData,
          type: 'bookmark',
          url: url.startsWith('http') ? url : `https://${url}`
        }
      : {
          ...baseData,
          type: 'folder'
        };

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {type === 'folder' ? (
              <Folder className="text-yellow-500" size={24} />
            ) : (
              <Bookmark className="text-blue-500" size={24} />
            )}
            <h2 className="text-xl font-semibold text-gray-800">
              {editingItem ? 'Edit' : 'Create'} {type === 'folder' ? 'Folder' : 'Bookmark'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder={`Enter ${type} name`}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {type === 'bookmark' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 ${
                    errors.url ? 'border-red-300 bg-red-50' : 
                    urlValidation?.isValid ? 'border-green-300 bg-green-50' :
                    'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="https://example.com"
                />
                {isValidating ? (
                  <div className="absolute right-3 top-2.5">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                ) : urlValidation && (
                  <div className="absolute right-3 top-2.5">
                    {urlValidation.isValid ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
              )}
              {!errors.url && urlValidation?.error && (
                <p className="text-red-500 text-sm mt-1">{urlValidation.error}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-all duration-150 resize-none"
              rows={3}
              placeholder="Optional notes..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 font-medium"
              disabled={isValidating}
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default CreateItemModal;