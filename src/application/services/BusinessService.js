import AppError from "../../infrastructure/errors/AppError.js";
import bcrypt from 'bcrypt';

class BusinessService {
  constructor(businessRepository, addressRepository, diskRepository) {
    this.businessRepository = businessRepository;
    this.addressRepository = addressRepository;
    this.diskRepository = diskRepository;
  }

  async createBusiness(data, file) {
    if (!data.idAddress) {
      throw new AppError("Endereço é obrigatório", "ADDRESS_REQUIRED");
    }

    const address = await this.addressRepository.findById(data.idAddress);
    if (!address) {
      throw AppError.notFound("Address", data.idAddress);
    }

    const exists = await this.businessRepository.findByCnpj(data.cnpj);
    if (exists) {
      throw new AppError("CNPJ já cadastrado", "CNPJ_ALREADY_EXISTS");
    }

    if(file) {
      const imgPath = await this.diskRepository.save(file);
      data.logo = imgPath;
    }

    const hashed = await bcrypt.hash(data.password, 10);
    data.password = hashed;
    data.status = 1;

    return await this.businessRepository.create(data);
  }

  async getBusiness(id, includeAddress = {}) {
    let business;
    if (includeAddress) {
      business = await this.businessRepository.findByIdWithAddress(id);
    } else {
      business = await this.businessRepository.findById(id);
    }
    if (!business) {
      throw AppError.notFound("Empresa", id);
    }
    return business;
  }

  async listBusinesses(page, limit, onlyActive) {
    const offset = (page - 1) * limit;
    const options = { offset, limit };

    if (onlyActive === true) {
      options.where = { status: true };
    }

    const result = await this.businessRepository.findAll(options);

    return {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      data: result.rows
    }
  }

  async updateBusiness(id, data, file) {
    const existing = await this.businessRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Empresa", id);
    }

    if (data.cnpj && data.cnpj !== existing.cnpj) {
      const byCnpj = await this.businessRepository.findByCnpj(data.cnpj);
      if (byCnpj && byCnpj.idBusiness !== id) {
        throw new AppError(
          "CNPJ já cadastrado por outra empresa",
          "CNPJ_ALREADY_EXISTS"
        );
      }
    }

    if (data.idAddress && data.idAddress !== existing.idAddress) {
      const addr = await this.addressRepository.findById(data.idAddress);
      if (!addr) {
        throw AppError.notFound("Address", data.idAddress);
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    if(file) {
      const imgPath = await this.diskRepository.save(file);
      data.logo = imgPath;
    }

    return await this.businessRepository.update(id, data);
  }

  async deleteBusiness(id) {
    const existing = await this.businessRepository.findById(id);
    if (!existing) {
      throw AppError.notFound("Empresa", id);
    }

    await this.diskRepository.delete(existing.logo);

    const deleted = await this.businessRepository.delete(id);

    if (!deleted) {
      throw AppError.notFound("Empresa", id);
    }

    return deleted;
  }

  async changeBusinessStatus(id, status) {
    if (typeof status === "boolean") {
      status = status ? 1 : 0;
    }
    if (status !== 0 && status !== 1) {
      throw new AppError(
        "Status inválido. Deve ser 0 (inativo) ou 1 (ativo)",
        "INVALID_STATUS"
      );
    }

    const business = await this.businessRepository.findById(id);
    if (!business) {
      throw AppError.notFound("Empresa", id);
    }

    return await this.businessRepository.update(id, { status });
  }
}

export default BusinessService;