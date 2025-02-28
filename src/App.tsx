import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
import Modal from './components/Modal';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import { ApiService } from './types';
import { getServices, addService, updateService, deleteService } from './utils/storage';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [filteredServices, setFilteredServices] = useState<ApiService[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ApiService | undefined>(undefined);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  useEffect(() => {
    setServices(getServices());
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredServices(
        services.filter((service) => {
          return (
            service.name.toLowerCase().includes(lowercasedSearch) ||
            service.baseUrl.toLowerCase().includes(lowercasedSearch) ||
            service.models.some(model => model.toLowerCase().includes(lowercasedSearch)) ||
            service.apiKeys.some(key => 
              key.name.toLowerCase().includes(lowercasedSearch) || 
              key.key.toLowerCase().includes(lowercasedSearch)
            )
          );
        })
      );
    }
  }, [searchTerm, services]);

  const handleAddService = () => {
    setCurrentService(undefined);
    setIsModalOpen(true);
  };

  const handleEditService = (service: ApiService) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      setServices(getServices());
      showNotification('success', 'Service deleted successfully');
    }
  };

  const handleSubmitService = (service: ApiService) => {
    if (currentService) {
      updateService(service);
      showNotification('success', 'Service updated successfully');
    } else {
      addService(service);
      showNotification('success', 'Service added successfully');
    }
    setServices(getServices());
    setIsModalOpen(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  const closeNotification = () => {
    setNotification({
      ...notification,
      show: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">API Services</h2>
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} />
            Add Service
          </button>
        </div>
        
        <div className="mb-6">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
            placeholder="Search by name, URL, model, or API key..."
          />
        </div>
        
        <ServiceTable 
          services={filteredServices} 
          onEdit={handleEditService} 
          onDelete={handleDeleteService} 
        />
      </main>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <ServiceForm
          service={currentService}
          onSubmit={handleSubmitService}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
      
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default App;
