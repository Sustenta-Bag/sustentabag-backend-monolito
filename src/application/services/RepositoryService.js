import { getRepositories } from '../bootstrap.js';

class RepositoryService {
  constructor() {
    const repositories = getRepositories();
    this.userRepository = repositories.userRepository;
    this.clientRepository = repositories.clientRepository;
    this.businessRepository = repositories.businessRepository;
    this.bagRepository = repositories.bagRepository;
    this.addressRepository = repositories.addressRepository;
  }

  getUserRepository() {
    return this.userRepository;
  }

  getClientRepository() {
    return this.clientRepository;
  }

  getBusinessRepository() {
    return this.businessRepository;
  }

  getBagRepository() {
    return this.bagRepository;
  }

  getAddressRepository() {
    return this.addressRepository;
  }
}

// Singleton pattern
let instance = null;

export const getRepositoryService = () => {
  if (!instance) {
    instance = new RepositoryService();
  }
  return instance;
};
