import AppError from "../../infrastructure/errors/AppError.js";

class AddressService {
  constructor(addressRepository, locationService = null) {
    this.addressRepository = addressRepository;
    this.locationService = locationService;
  }

  async createAddress(addressData) {
    const { zipCode, state } = addressData;

    if (!/^\d{8}$/.test(zipCode)) {
      throw new AppError("CEP inválido. Deve conter exatamente 8 dígitos numéricos.", "INVALID_ZIPCODE");
    }
    if (!/^[A-Z]{2}$/.test(state)) {
      throw new AppError("Estado inválido. Deve ser a sigla de 2 letras maiúsculas.", "INVALID_STATE");
    }

    if (this.locationService) {
      try {
        const processedAddress = await this.locationService.processAddress(addressData);
        return this.addressRepository.create(processedAddress);
      } catch (error) {
        console.error("Erro ao geocodificar endereço:", error);
        return this.addressRepository.create(addressData);
      }
    }

    return this.addressRepository.create(addressData);
  }

  async getAddress(id) {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw AppError.notFound("Endereço", id);
    }
    return address;
  }

  async listAddresses({ page = 1, limit = 10, city, state, zipCode } = {}) {
    const where = {};
    if (city)  where.City = city;
    if (state) where.State = state;
    if (zipCode)   where.ZipCode = zipCode;

    if(zipCode && !/^\d{8}$/.test(zipCode)) {
      throw new AppError("CEP inválido. Deve conter exatamente 8 dígitos numéricos.", "INVALID_ZIPCODE");
    }

    if(state && !/^[A-Z]{2}$/.test(state)) {
      throw new AppError("Estado inválido. Deve ser a sigla de 2 letras maiúsculas.", "INVALID_STATE");
    }

    if(page < 1) page = 1;

    const offset = (page - 1) * limit;
    const result = await this.addressRepository.findAndCountAll({
      where,
      offset,
      limit
    });
    return {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      data: result.rows
    };
  }

  async updateAddress(id, addressData) {
    const existing = await this.addressRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Endereço", id);
    }

    if (addressData.ZipCode && !/^\d{8}$/.test(addressData.ZipCode)) {
      throw new AppError("CEP inválido. Deve conter exatamente 8 dígitos numéricos.", "INVALID_ZIPCODE");
    }
    if (addressData.State && !/^[A-Z]{2}$/.test(addressData.State)) {
      throw new AppError("Estado inválido.A sigla deve ser 2 letras maiúsculas.", "INVALID_STATE");
    }

    return this.addressRepository.update(id, addressData);
  }

  async deleteAddress(id) {
    const deleted = await this.addressRepository.delete(id);
    if (!deleted) {
      throw AppError.notFound("Endereço", id);
    }
    return deleted;
  }
}

export default AddressService;