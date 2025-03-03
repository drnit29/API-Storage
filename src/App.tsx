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
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    show: false,
    type: 'success',
    message: '',
  });

  // Função para carregar os serviços do banco de dados
  const loadServices = async () => {
    setIsLoading(true);
    try {
      const data = await getServices();
      setServices(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      showNotification('error', 'Failed to load services');
      setIsLoading(false);
    }
  };

  // Efeito para carregar serviços na inicialização
  useEffect(() => {
    loadServices();
  }, []);

  // Efeito para filtrar serviços quando o termo de pesquisa ou a lista de serviços mudar
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

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const success = await deleteService(id);
        if (success) {
          await loadServices(); // Recarregar a lista após a exclusão
          showNotification('success', 'Service deleted successfully');
        } else {
          showNotification('error', 'Failed to delete service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
        showNotification('error', 'An error occurred while deleting the service');
      }
    }
  };

  const handleSubmitService = async (service: ApiService) => {
    try {
      if (currentService) {
        // Atualizar serviço existente
        const updatedService = await updateService(service);
        if (updatedService) {
          showNotification('success', 'Service updated successfully');
        } else {
          showNotification('error', 'Failed to update service');
        }
      } else {
        // Adicionar novo serviço
        const newService = await addService(service);
        if (newService) {
          showNotification('success', 'Service added successfully');
        } else {
          showNotification('error', 'Failed to add service');
        }
      }
      
      // Recarregar a lista após a adição/atualização
      await loadServices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting service:', error);
      showNotification('error', 'An error occurred while saving the service');
    }
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
        
        {isLoading ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">Loading services...</p>
          </div>
        ) : (
          <ServiceTable 
            services={filteredServices} 
            onEdit={handleEditService} 
            onDelete={handleDeleteService} 
          />
        )}
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