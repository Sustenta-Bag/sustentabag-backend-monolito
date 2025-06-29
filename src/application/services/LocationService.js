import mapboxSdk from '@mapbox/mapbox-sdk';
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding.js';
import AppError from '../../infrastructure/errors/AppError.js';

class LocationService {
  constructor(businessRepository, addressRepository, clientRepository, mapboxToken, options = {}) {
    this.businessRepository = businessRepository;
    this.addressRepository = addressRepository;
    this.clientRepository = clientRepository;
    
    if (options.isTesting) {
      this.mapboxClient = options.mockClient || {};
      this.geocodingClient = options.mockGeocoding || {
        forwardGeocode: () => ({
          send: async () => ({
            body: {
              features: [
                {
                  place_name: 'Test Address',
                  center: [10.1234, -23.5678]
                }
              ]
            }
          })
        })
      };
    } else if (mapboxToken) {
      this.mapboxClient = mapboxSdk({ accessToken: mapboxToken });
      this.geocodingClient = geocodingService(this.mapboxClient);
    } else {
      console.warn('MAPBOX_ACCESS_TOKEN não definido. Serviço de geocodificação estará indisponível.');
      this.mapboxClient = null;
      this.geocodingClient = null;
    }
  }

  /**
   * Geocodifica um endereço para obter suas coordenadas
   * @param {Object} address - Objeto de endereço com campos como street, number, city, state, zipCode
   * @returns {Promise<{latitude: number, longitude: number}>} - Coordenadas do endereço
   */  async geocodeAddress(address) {
    try {
      if (!this.mapboxClient || !this.geocodingClient) {
        throw new AppError(
          'Serviço de geocodificação não disponível. Verifique a variável MAPBOX_ACCESS_TOKEN.', 
          'GEOCODING_SERVICE_UNAVAILABLE',
          503
        );
      }

      if (!address) {
        throw new AppError('Dados de endereço não fornecidos', 'GEOCODING_ERROR', 400);
      }
      
      const queryParts = [];
      
      if (address.street) queryParts.push(address.street);
      if (address.number) queryParts.push(address.number);
      if (address.city) queryParts.push(address.city);
      if (address.state) queryParts.push(address.state);
      if (address.zipCode) queryParts.push(address.zipCode);
      
      if (queryParts.length < 3) {
        throw new AppError(
          'Dados insuficientes para geocodificar endereço. Necessário pelo menos rua, cidade e estado.', 
          'INSUFFICIENT_ADDRESS_DATA',
          400
        );
      }
      
      const query = queryParts.join(', ');
      console.log(`Enviando consulta de geocodificação: "${query}"`);
      
      let timeoutId;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Timeout na requisição de geocodificação')), 10000);
      });
      
      const geocodePromise = this.geocodingClient
        .forwardGeocode({
          query,
          limit: 1,
          countries: ['br'],
          types: ['address']
        })
        .send();
      
      try {
        const response = await Promise.race([geocodePromise, timeoutPromise]);
        clearTimeout(timeoutId); 

        if (
          !response.body ||
          !response.body.features ||
          response.body.features.length === 0
        ) {
          console.warn(`Nenhum resultado encontrado para o endereço: "${query}"`);
          throw new AppError('Não foi possível geocodificar este endereço', 'GEOCODING_ERROR', 400);
        }

        const feature = response.body.features[0];
        console.log(`Resultado encontrado: ${feature.place_name}`);
        
        const [lng, lat] = feature.center;
        
        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
          throw new AppError('Coordenadas inválidas retornadas pelo serviço', 'INVALID_COORDINATES', 400);
        }
        
        return { latitude: lat, longitude: lng };
      } catch (error) {
        clearTimeout(timeoutId); 
        throw error;
      }
    } catch (error) {
      console.error('Erro durante geocodificação:', error);
      
      if (error.name === 'AbortError') {
        throw new AppError('Requisição de geocodificação abortada', 'GEOCODING_REQUEST_ABORTED', 408);
      }
      
      if (error instanceof AppError) throw error;
      
      throw new AppError(
        `Erro ao geocodificar endereço: ${error.message}`, 
        'GEOCODING_ERROR',
        error.statusCode || 400
      );
    }
  }

  /**
   * Processa um endereço novo, adicionando coordenadas geográficas
   * @param {Object} addressData - Dados do endereço
   * @returns {Promise<Object>} - Endereço processado com coordenadas
   */  async processAddress(addressData) {
    try {
      if (!addressData || typeof addressData !== 'object') {
        throw new Error('Dados de endereço inválidos');
      }
      
      if (!addressData.street || !addressData.city || !addressData.state) {
        console.warn('Dados de endereço incompletos para geocodificação', 
          JSON.stringify({
            hasStreet: Boolean(addressData.street),
            hasCity: Boolean(addressData.city),
            hasState: Boolean(addressData.state)
          })
        );
      }
      
      if (addressData.latitude && addressData.longitude) {
        console.log(`Endereço já possui coordenadas: ${addressData.latitude}, ${addressData.longitude}`);
        return addressData;
      }

      if (!this.mapboxClient || !this.geocodingClient) {
        console.warn('Serviço de geocodificação não disponível. Retornando endereço sem coordenadas.');
        return addressData;
      }
      
      const coordinates = await this.geocodeAddress(addressData);
      console.log(`Coordenadas obtidas via geocodificação: ${coordinates.latitude}, ${coordinates.longitude}`);
      
      return {
        ...addressData,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
    } catch (error) {
      console.error('Erro ao processar coordenadas:', error);
      
      if (process.env.NODE_ENV === 'development') {
        return addressData;
      }
      
      throw new AppError(`Erro ao processar coordenadas do endereço: ${error.message}`, 'ADDRESS_PROCESSING_ERROR');
    }
  }

  /**
   * Busca estabelecimentos próximos a um endereço
   * @param {number} idAddress - ID do endereço de referência
   * @param {Object} options - Opções de busca como raio e limite
   * @returns {Promise<Array>} - Lista de estabelecimentos próximos
   */  async findNearbyBusinesses(idAddress, { radius = 10, limit = 10 } = {}) {
    try {
      if (!idAddress || isNaN(parseInt(idAddress))) {
        throw new AppError('ID de endereço inválido', 'INVALID_ADDRESS_ID', 400);
      }
      
      console.log(`Buscando endereço com ID: ${idAddress}`);
      const address = await this.addressRepository.findById(parseInt(idAddress));
      
      if (!address) {
        throw new AppError(`Endereço não encontrado com o ID ${idAddress}`, 'ADDRESS_NOT_FOUND', 404);
      }
      
      console.log(`Endereço encontrado: ${JSON.stringify({
        id: address.id,
        street: address.street,
        city: address.city,
        hasCoordinates: Boolean(address.latitude) && Boolean(address.longitude)
      })}`);

      if (!address.latitude || !address.longitude) {
        console.log(`Endereço sem coordenadas, tentando geocodificar...`);
        
        if (!address.street || !address.city || !address.state) {
          throw new AppError('Endereço incompleto, impossível geocodificar', 'INCOMPLETE_ADDRESS', 400);
        }
        
        try {
          const updatedAddress = await this.processAddress(address);
          
          if (updatedAddress.latitude && updatedAddress.longitude) {
            console.log(`Coordenadas obtidas: ${updatedAddress.latitude}, ${updatedAddress.longitude}`);
            await this.addressRepository.update(idAddress, { 
              latitude: updatedAddress.latitude, 
              longitude: updatedAddress.longitude 
            });
            address.latitude = updatedAddress.latitude;
            address.longitude = updatedAddress.longitude;
          } else {
            throw new AppError('Não foi possível determinar as coordenadas do endereço', 'GEOCODING_ERROR', 400);
          }
        } catch (geocodeError) {
          console.error('Erro durante geocodificação:', geocodeError);
          throw new AppError(`Erro ao geocodificar endereço: ${geocodeError.message}`, 'GEOCODING_ERROR', 400);
        }
      }

      console.log(`Usando coordenadas: ${address.latitude}, ${address.longitude}`);

      const businesses = await this.businessRepository.findAllWithAddress();
      console.log(`Encontrados ${businesses.length} estabelecimentos com endereço`);
      
      if (!businesses || businesses.length === 0) {
        console.log('Nenhum estabelecimento encontrado no banco de dados');
        return []; 
      }
      
      const nearbyBusinesses = [];
      
      for (const business of businesses) {
        const businessAddress = business.address;
        if (!businessAddress || !businessAddress.latitude || !businessAddress.longitude) {
          console.log(`Negócio ${business.id} ignorado - endereço sem coordenadas`);
          continue;
        }

        try {
          const distance = this.calculateDistance(
            address.latitude, address.longitude,
            businessAddress.latitude, businessAddress.longitude
          );

          business.distance = distance;
          
          const isNearby = distance <= radius;
          if (isNearby) {
            console.log(`Negócio ${business.id} está a ${distance.toFixed(2)}km de distância`);
            nearbyBusinesses.push(business);
          }
        } catch (err) {
          console.error(`Erro ao calcular distância para negócio ${business.id}:`, err);
        }
      }
      
      nearbyBusinesses.sort((a, b) => {
        const distA = typeof a.distance === 'number' ? a.distance : Infinity;
        const distB = typeof b.distance === 'number' ? b.distance : Infinity;
        return distA - distB;
      });
      
      const limitedResults = nearbyBusinesses.slice(0, limit);
      
      console.log(`Retornando ${limitedResults.length} estabelecimentos próximos`);
      return limitedResults;
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos próximos:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao buscar estabelecimentos próximos: ${error.message}`, 'LOCATION_SERVICE_ERROR', 500);
    }
  }

  /**
   * Calcula a distância entre dois pontos usando a fórmula de Haversine
   * @param {number} lat1 - Latitude do ponto 1
   * @param {number} lon1 - Longitude do ponto 1
   * @param {number} lat2 - Latitude do ponto 2
   * @param {number} lon2 - Longitude do ponto 2
   * @returns {number} - Distância em quilômetros
   */  calculateDistance(lat1, lon1, lat2, lon2) {
    if (
      lat1 === null || lat1 === undefined || isNaN(parseFloat(lat1)) ||
      lon1 === null || lon1 === undefined || isNaN(parseFloat(lon1)) ||
      lat2 === null || lat2 === undefined || isNaN(parseFloat(lat2)) ||
      lon2 === null || lon2 === undefined || isNaN(parseFloat(lon2))
    ) {
      throw new Error('Coordenadas inválidas para cálculo de distância');
    }
    
    const latitude1 = parseFloat(lat1);
    const longitude1 = parseFloat(lon1);
    const latitude2 = parseFloat(lat2);
    const longitude2 = parseFloat(lon2);
    
    const R = 6371; 
    const dLat = this.deg2rad(latitude2 - latitude1);
    const dLon = this.deg2rad(longitude2 - longitude1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.deg2rad(latitude1)) * Math.cos(this.deg2rad(latitude2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; 
    
    return isNaN(distance) ? Infinity : Math.max(0, distance);
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }

  /**
   * Busca estabelecimentos próximos ao endereço de um cliente
   * @param {number} clientId - ID do cliente
   * @param {Object} options - Opções de busca como raio e limite
   * @returns {Promise<Array>} - Lista de estabelecimentos próximos
   */
  async findNearbyBusinessesByClient(clientId, { radius = 10, limit = 10 } = {}) {
    try {
      if (!clientId || isNaN(parseInt(clientId))) {
        throw new AppError('ID do cliente inválido', 'INVALID_CLIENT_ID', 400);
      }

      console.log(`Buscando cliente com ID: ${clientId}`);
      const client = await this.clientRepository.findByIdWithAddress(clientId);

      console.log(`Resultado de findByIdWithAddress para cliente ${clientId}:`, JSON.stringify(client, null, 2));

      if (!client) {
        throw new AppError(`Cliente não encontrado com o ID ${clientId}`, 'CLIENT_NOT_FOUND', 404);
      }

      if (!client.address) {
        throw new AppError('Cliente não possui endereço cadastrado', 'CLIENT_NO_ADDRESS', 400);
      }

      console.log(`Cliente encontrado com endereço: ${JSON.stringify({
        id: client.id,
        idAddress: client.address.id,
        street: client.address.street,
        city: client.address.city,
        hasCoordinates: Boolean(client.address.latitude) && Boolean(client.address.longitude)
      })}`);

      // Add log here to show the address ID being passed to findNearbyBusinesses
      console.log(`Passando idAddress ${client.address.id} para findNearbyBusinesses`);

      return this.findNearbyBusinesses(client.address.id, { radius, limit });
    } catch (error) {
      console.error('Erro ao buscar estabelecimentos próximos ao cliente:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao buscar estabelecimentos próximos ao cliente: ${error.message}`,
        'LOCATION_SERVICE_ERROR',
        500
      );
    }
  }

  /**
   * Busca todas as bags disponíveis das empresas próximas ao endereço de um cliente
   * @param {number} clientId - ID do cliente
   * @param {Object} bagRepository - Repositório de bags
   * @param {Object} options - Opções de busca como raio e limite
   * @returns {Promise<Array>} - Lista de bags disponíveis das empresas próximas
   */
  async findNearbyAvailableBagsByClient(clientId, bagRepository, { radius = 10, limit = 50 } = {}) {
    try {
      if (!clientId || isNaN(parseInt(clientId))) {
        throw new AppError('ID do cliente inválido', 'INVALID_CLIENT_ID', 400);
      }

      if (!bagRepository) {
        throw new AppError('Repositório de bags não foi fornecido', 'BAG_REPOSITORY_NOT_PROVIDED', 500);
      }

      console.log(`Buscando bags disponíveis próximas para cliente com ID: ${clientId}`);
      
      const nearbyBusinesses = await this.findNearbyBusinessesByClient(clientId, { radius, limit: 100 });
      
      console.log(`Encontradas ${nearbyBusinesses.length} empresas próximas`);
      
      if (!nearbyBusinesses || nearbyBusinesses.length === 0) {
        console.log('Nenhuma empresa próxima encontrada');
        return [];
      }
      const allBags = [];
      for (const business of nearbyBusinesses) {
        try {
          const activeBagsResult = await bagRepository.findAll({ idBusiness: business.id, status: 1 }, limit, 0);
          const activeBags = activeBagsResult.rows || [];
          
          for (const bag of activeBags) {
            allBags.push({
              id: bag.id,
              type: bag.type,
              price: bag.price,
              description: bag.description,
              idBusiness: bag.idBusiness,
              status: bag.status,
              tags: bag.tags,
              createdAt: bag.createdAt,
              business: {
                id: business.id,
                name: business.appName,
                legalName: business.legalName,
                logo: business.logo,
                distance: business.distance,
                address: business.address
              }
            });
          }
          
          console.log(`Empresa ${business.id} (${business.appName}) tem ${activeBags.length} bags ativas`);
        } catch (error) {
          console.error(`Erro ao buscar bags da empresa ${business.id}:`, error);
        }
      }

      allBags.sort((a, b) => {
        const distA = typeof a.business.distance === 'number' ? a.business.distance : Infinity;
        const distB = typeof b.business.distance === 'number' ? b.business.distance : Infinity;
        return distA - distB;
      });

      console.log(`Retornando ${allBags.length} bags disponíveis das empresas próximas`);
      return allBags;
      
    } catch (error) {
      console.error('Erro ao buscar bags disponíveis próximas ao cliente:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        `Erro ao buscar bags disponíveis próximas ao cliente: ${error.message}`,
        'LOCATION_SERVICE_ERROR',
        500
      );
    }
  }
}

export default LocationService;
