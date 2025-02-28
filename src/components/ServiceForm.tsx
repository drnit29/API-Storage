import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { ApiService, ApiKey } from '../types';

interface ServiceFormProps {
  service?: ApiService;
  onSubmit: (service: ApiService) => void;
  onCancel: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelInput, setModelInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setName(service.name);
      setBaseUrl(service.baseUrl);
      setApiKeys([...service.apiKeys]);
      setModels([...service.models]);
    } else {
      // Initialize with one empty API key field
      setApiKeys([{ id: crypto.randomUUID(), name: '', key: '' }]);
    }
  }, [service]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!baseUrl.trim()) {
      newErrors.baseUrl = 'Base URL is required';
    } else if (!isValidUrl(baseUrl)) {
      newErrors.baseUrl = 'Please enter a valid URL';
    }
    
    let hasKeyErrors = false;
    apiKeys.forEach((apiKey, index) => {
      if (!apiKey.name.trim()) {
        newErrors[`keyName-${index}`] = 'Key name is required';
        hasKeyErrors = true;
      }
      
      if (!apiKey.key.trim()) {
        newErrors[`keyValue-${index}`] = 'Key value is required';
        hasKeyErrors = true;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const newService: ApiService = {
      id: service?.id || crypto.randomUUID(),
      name,
      baseUrl,
      apiKeys,
      models
    };
    
    onSubmit(newService);
  };

  const addApiKey = () => {
    setApiKeys([...apiKeys, { id: crypto.randomUUID(), name: '', key: '' }]);
  };

  const removeApiKey = (id: string) => {
    if (apiKeys.length > 1) {
      setApiKeys(apiKeys.filter(key => key.id !== id));
    }
  };

  const updateApiKey = (id: string, field: 'name' | 'key', value: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, [field]: value } : key
    ));
  };

  const addModel = () => {
    if (modelInput.trim()) {
      setModels([...models, modelInput.trim()]);
      setModelInput('');
    }
  };

  const removeModel = (index: number) => {
    setModels(models.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && modelInput.trim()) {
      e.preventDefault();
      addModel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        {service ? 'Edit Service' : 'Add New Service'}
      </h2>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2" htmlFor="name">
          Service Name*
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter service name"
        />
        {errors.name && <p className="text-red-400 mt-1 text-sm">{errors.name}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2" htmlFor="baseUrl">
          Base URL*
        </label>
        <input
          id="baseUrl"
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://api.example.com"
        />
        {errors.baseUrl && <p className="text-red-400 mt-1 text-sm">{errors.baseUrl}</p>}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">
          API Keys*
        </label>
        {apiKeys.map((apiKey, index) => (
          <div key={apiKey.id} className="flex gap-2 mb-2">
            <div className="flex-1">
              <input
                type="text"
                value={apiKey.name}
                onChange={(e) => updateApiKey(apiKey.id, 'name', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Key Name"
              />
              {errors[`keyName-${index}`] && (
                <p className="text-red-400 mt-1 text-sm">{errors[`keyName-${index}`]}</p>
              )}
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={apiKey.key}
                onChange={(e) => updateApiKey(apiKey.id, 'key', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Key Value"
              />
              {errors[`keyValue-${index}`] && (
                <p className="text-red-400 mt-1 text-sm">{errors[`keyValue-${index}`]}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeApiKey(apiKey.id)}
              className="p-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 focus:outline-none"
              disabled={apiKeys.length <= 1}
            >
              <X size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addApiKey}
          className="mt-2 flex items-center gap-1 text-blue-400 hover:text-blue-300"
        >
          <Plus size={16} /> Add API Key
        </button>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-300 mb-2">
          Models (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={modelInput}
            onChange={(e) => setModelInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a model"
          />
          <button
            type="button"
            onClick={addModel}
            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {models.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {models.map((model, index) => (
              <div key={index} className="flex items-center bg-gray-700 text-white px-3 py-1 rounded-full">
                <span>{model}</span>
                <button
                  type="button"
                  onClick={() => removeModel(index)}
                  className="ml-2 text-gray-400 hover:text-gray-200"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none"
        >
          {service ? 'Update' : 'Add'} Service
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
