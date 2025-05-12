import mapboxSdk from '@mapbox/mapbox-sdk';
import geocodingService from '@mapbox/mapbox-sdk/services/geocoding.js';
import AppError from '../../infrastructure/errors/AppError.js';

class LocationService {
  constructor(businessRepository, addressRepository, mapboxToken) {
    this.businessRepository = businessRepository;
    this.addressRepository = addressRepository;
    this.mapboxClient = mapboxSdk({ accessToken: mapboxToken });
    this.geocodingClient = geocodingService(this.mapboxClient);
  }

  /**
   * Geocodifica um endereço para obter suas coordenadas
   * @param {Object} address - Objeto de endereço com campos como street, number, city, state, zipCode
   * @returns {Promise<{latitude: number, longitude: number}>} - Coordenadas do endereço
   */
  async geocodeAddress(address) {
    try {
      const query = `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.zipCode}`;
      
      const response = await this.geocodingClient
        .forwardGeocode({
          query,
          limit: 1,
          countries: ['br'],
          types: ['address']
        })
        .send();

      if (
        !response.body ||
        !response.body.features ||
        response.body.features.length === 0
      ) {
        throw new AppError('Não foi possível geocodificar este endereço', 'GEOCODING_ERROR');
      }

      const [lng, lat] = response.body.features[0].center;
      return { latitude: lat, longitude: lng };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Erro ao geocodificar endereço: ${error.message}`, 'GEOCODING_ERROR');
    }
  }

  /**
   * Processa um endereço novo, adicionando coordenadas geográficas
   * @param {Object} addressData - Dados do endereço
   * @returns {Promise<Object>} - Endereço processado com coordenadas
   */
  async processAddress(addressData) {
    try {
      const coordinates = await this.geocodeAddress(addressData);
      return {
        ...addressData,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      };
    } catch (error) {
      // Falha silenciosa para geocodificação, apenas registra o erro
      console.error('Erro ao processar coordenadas:', error);
      return addressData; // Retorna o endereço sem coordenadas
    }
  }

  /**
   * Busca estabelecimentos próximos a um endereço
   * @param {number} addressId - ID do endereço de referência
   * @param {Object} options - Opções de busca como raio e limite
   * @returns {Promise<Array>} - Lista de estabelecimentos próximos
   */
  async findNearbyBusinesses(addressId, { radius = 10, limit = 10 } = {}) {
    const address = await this.addressRepository.findById(addressId);
    
    if (!address) {
      throw AppError.notFound('Endereço', addressId);
    }

    // Se o endereço não tem coordenadas, tenta geocodificá-lo primeiro
    if (!address.latitude || !address.longitude) {
      const updatedAddress = await this.processAddress(address);
      
      // Atualiza o endereço com as coordenadas
      if (updatedAddress.latitude && updatedAddress.longitude) {
        await this.addressRepository.update(addressId, { 
          latitude: updatedAddress.latitude, 
          longitude: updatedAddress.longitude 
        });
        address.latitude = updatedAddress.latitude;
        address.longitude = updatedAddress.longitude;
      } else {
        throw new AppError('Não foi possível determinar as coordenadas do endereço', 'GEOCODING_ERROR');
      }
    }

    // Buscar todos os estabelecimentos com endereços
    const businesses = await this.businessRepository.findAllWithAddress();
    
    // Filtrar estabelecimentos por distância
    const nearbyBusinesses = businesses
      .filter(business => {
        // Verificar se o negócio tem endereço com coordenadas
        const businessAddress = business.address;
        if (!businessAddress || !businessAddress.latitude || !businessAddress.longitude) {
          return false;
        }

        // Calcular distância usando a fórmula de Haversine
        const distance = this.calculateDistance(
          address.latitude, address.longitude,
          businessAddress.latitude, businessAddress.longitude
        );

        // Adicionar a distância ao objeto de negócio para ordenação posterior
        business.distance = distance;
        
        // Filtrar por raio (em km)
        return distance <= radius;
      })
      .sort((a, b) => a.distance - b.distance) // Ordenar por distância
      .slice(0, limit); // Limitar resultados
      
    return nearbyBusinesses;
  }

  /**
   * Calcula a distância entre dois pontos usando a fórmula de Haversine
   * @param {number} lat1 - Latitude do ponto 1
   * @param {number} lon1 - Longitude do ponto 1
   * @param {number} lat2 - Latitude do ponto 2
   * @param {number} lon2 - Longitude do ponto 2
   * @returns {number} - Distância em quilômetros
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distância em km
    return distance;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}

export default LocationService;
