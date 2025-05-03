import Business from '../../../../src/domain/entities/Business.js';

describe('Business Entity Unit Tests', () => {
  // Dados de teste para reuso
  const businessData = {
    id: 1,
    legalName: 'Sustenta Bag LTDA',
    cnpj: '12345678000199',
    appName: 'Sustenta Bag App',
    cellphone: '11987654321',
    description: 'Empresa especializada em sacolas sustentáveis',
    logo: 'logo.png',
    delivery: true,
    deliveryTax: 5.99,
    idAddress: 5,
    status: 1,
    createdAt: new Date('2023-01-01')
  };

  describe('Constructor', () => {
    test('should initialize with all properties correctly', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        businessData.status,
        businessData.createdAt
      );

      expect(business.id).toBe(businessData.id);
      expect(business.legalName).toBe(businessData.legalName);
      expect(business.cnpj).toBe(businessData.cnpj);
      expect(business.appName).toBe(businessData.appName);
      expect(business.cellphone).toBe(businessData.cellphone);
      expect(business.description).toBe(businessData.description);
      expect(business.logo).toBe(businessData.logo);
      expect(business.delivery).toBe(businessData.delivery);
      expect(business.deliveryTax).toBe(businessData.deliveryTax);
      expect(business.idAddress).toBe(businessData.idAddress);
      expect(business.status).toBe(businessData.status);
      expect(business.createdAt).toEqual(businessData.createdAt);
    });

    test('should initialize with default status when not provided', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress
      );

      expect(business.status).toBe(1);
    });

    test('should initialize with default createdAt when not provided', () => {
      const beforeCreation = new Date();
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        businessData.status
      );
      const afterCreation = new Date();

      expect(business.createdAt).toBeInstanceOf(Date);
      expect(business.createdAt >= beforeCreation).toBeTruthy();
      expect(business.createdAt <= afterCreation).toBeTruthy();
    });
  });

  describe('Methods', () => {
    test('updateStatus should change status and return this', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        1
      );
      
      const returnValue = business.updateStatus(0);
      
      expect(business.status).toBe(0);
      expect(returnValue).toBe(business);
    });

    test('updateDescription should change description and return this', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description
      );
      
      const newDescription = 'Nova descrição da empresa';
      const returnValue = business.updateDescription(newDescription);
      
      expect(business.description).toBe(newDescription);
      expect(returnValue).toBe(business);
    });

    test('updateDelivery should change delivery and return this', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        true
      );
      
      const returnValue = business.updateDelivery(false);
      
      expect(business.delivery).toBe(false);
      expect(returnValue).toBe(business);
    });

    test('deactivate should set status to 0 and return this', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        1
      );
      
      const returnValue = business.deactivate();
      
      expect(business.status).toBe(0);
      expect(returnValue).toBe(business);
    });

    test('activate should set status to 1 and return this', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        0
      );
      
      const returnValue = business.activate();
      
      expect(business.status).toBe(1);
      expect(returnValue).toBe(business);
    });
    
    test('methods should support chaining', () => {
      const business = new Business(
        businessData.id,
        businessData.legalName,
        businessData.cnpj,
        businessData.appName,
        businessData.cellphone,
        businessData.description,
        businessData.logo,
        businessData.delivery,
        businessData.deliveryTax,
        businessData.idAddress,
        1
      );
      
      business
        .updateLegalName('Nova Empresa LTDA')
        .updateCellphone('11999998888')
        .updateDelivery(false)
        .deactivate();
      
      expect(business.legalName).toBe('Nova Empresa LTDA');
      expect(business.cellphone).toBe('11999998888');
      expect(business.delivery).toBe(false);
      expect(business.status).toBe(0);
      
      business.activate().updateDescription('Empresa reativada');
      
      expect(business.status).toBe(1);
      expect(business.description).toBe('Empresa reativada');
    });
  });
});