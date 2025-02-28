import { ApiService } from '../types';

const STORAGE_KEY = 'api-storage-services';

export const getServices = (): ApiService[] => {
  const servicesJson = localStorage.getItem(STORAGE_KEY);
  return servicesJson ? JSON.parse(servicesJson) : [];
};

export const saveServices = (services: ApiService[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

export const addService = (service: ApiService): void => {
  const services = getServices();
  saveServices([...services, service]);
};

export const updateService = (updatedService: ApiService): void => {
  const services = getServices();
  const updatedServices = services.map(service => 
    service.id === updatedService.id ? updatedService : service
  );
  saveServices(updatedServices);
};

export const deleteService = (id: string): void => {
  const services = getServices();
  const filteredServices = services.filter(service => service.id !== id);
  saveServices(filteredServices);
};
