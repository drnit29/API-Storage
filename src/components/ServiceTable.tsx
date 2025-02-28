import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { ApiService } from '../types';
import CopyButton from './CopyButton';

interface ServiceTableProps {
  services: ApiService[];
  onEdit: (service: ApiService) => void;
  onDelete: (id: string) => void;
}

const ServiceTable: React.FC<ServiceTableProps> = ({ services, onEdit, onDelete }) => {
  if (services.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400 text-lg">No API services added yet.</p>
        <p className="text-gray-500 mt-2">Add your first service using the form above.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-3 text-left text-gray-300">Service Name</th>
            <th className="px-4 py-3 text-left text-gray-300">Base URL</th>
            <th className="px-4 py-3 text-left text-gray-300">API Keys</th>
            <th className="px-4 py-3 text-left text-gray-300">Models</th>
            <th className="px-4 py-3 text-right text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-t border-gray-700 hover:bg-gray-750">
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="text-white">{service.name}</span>
                  <CopyButton text={service.name} className="ml-2" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <span className="text-white truncate max-w-[200px]">{service.baseUrl}</span>
                  <CopyButton text={service.baseUrl} className="ml-2" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  {service.apiKeys.map((key) => (
                    <div key={key.id} className="flex items-center">
                      <div className="flex items-center mr-2">
                        <span className="text-blue-400 mr-1">{key.name}:</span>
                        <span className="text-white truncate max-w-[100px]">{key.key}</span>
                      </div>
                      <div className="flex space-x-1">
                        <CopyButton text={key.name} />
                        <CopyButton text={key.key} />
                      </div>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                {service.models.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {service.models.map((model, index) => (
                      <div key={index} className="flex items-center bg-gray-700 px-2 py-1 rounded text-sm">
                        <span className="text-white">{model}</span>
                        <CopyButton text={model} className="ml-1" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500">None</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(service)}
                    className="p-1 text-blue-400 hover:text-blue-300 rounded"
                    title="Edit service"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(service.id)}
                    className="p-1 text-red-400 hover:text-red-300 rounded"
                    title="Delete service"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
