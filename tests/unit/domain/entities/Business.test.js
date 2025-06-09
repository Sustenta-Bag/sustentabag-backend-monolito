import Business from '../../../../src/domain/entities/Business.js';

describe('Business Entity', () => {
  let business;
  const currentDate = new Date();

  beforeEach(() => {
    business = new Business(
      1,
      'Test Business',
      '12345678901234',
      'Test App',
      '11987654321',
      'Test Description',
      'logo.png',
      true,
      5.0,
      1,
      1,
      currentDate
    );
  });

  test('should initialize with all properties correctly', () => {
    expect(business.id).toBe(1);
    expect(business.legalName).toBe('Test Business');
    expect(business.cnpj).toBe('12345678901234');
    expect(business.appName).toBe('Test App');
    expect(business.cellphone).toBe('11987654321');
    expect(business.description).toBe('Test Description');
    expect(business.logo).toBe('logo.png');
    expect(business.delivery).toBe(true);
    expect(business.deliveryTax).toBe(5.0);
    expect(business.idAddress).toBe(1);
    expect(business.status).toBe(1);
    expect(business.createdAt).toBeInstanceOf(Date);
  });

  test('should initialize with default values when not provided', () => {
    const partialBusiness = new Business(
      1,
      'Test Business',
      '12345678901234',
      'Test App',
      '11987654321',
      'Test Description',
      'logo.png',
      true,
      5.0,
      1
    );

    expect(partialBusiness.status).toBe(1);
    expect(partialBusiness.createdAt).toBeInstanceOf(Date);
  });

  describe('Update methods', () => {
    test('updateStatus should update status property', () => {
      const updatedBusiness = business.updateStatus(0);
      
      expect(updatedBusiness.status).toBe(0);
      expect(updatedBusiness).toBe(business); // Ensures it returns this
    });

    test('updateDescription should update description property', () => {
      const updatedBusiness = business.updateDescription('New Description');
      
      expect(updatedBusiness.description).toBe('New Description');
      expect(updatedBusiness).toBe(business);
    });

    test('updateDelivery should update delivery property', () => {
      const updatedBusiness = business.updateDelivery(false);
      
      expect(updatedBusiness.delivery).toBe(false);
      expect(updatedBusiness).toBe(business);
    });

    test('updateDeliveryTax should update deliveryTax property', () => {
      const updatedBusiness = business.updateDeliveryTax(10.0);
      
      expect(updatedBusiness.deliveryTax).toBe(10.0);
      expect(updatedBusiness).toBe(business);
    });

    test('updateLogo should update logo property', () => {
      const updatedBusiness = business.updateLogo('new-logo.png');
      
      expect(updatedBusiness.logo).toBe('new-logo.png');
      expect(updatedBusiness).toBe(business);
    });

    test('updateCellphone should update cellphone property', () => {
      const updatedBusiness = business.updateCellphone('11999998888');
      
      expect(updatedBusiness.cellphone).toBe('11999998888');
      expect(updatedBusiness).toBe(business);
    });

    test('updateLegalName should update legalName property', () => {
      const updatedBusiness = business.updateLegalName('New Legal Name');
      
      expect(updatedBusiness.legalName).toBe('New Legal Name');
      expect(updatedBusiness).toBe(business);
    });

    test('updateCnpj should update cnpj property', () => {
      const updatedBusiness = business.updateCnpj('98765432109876');
      
      expect(updatedBusiness.cnpj).toBe('98765432109876');
      expect(updatedBusiness).toBe(business);
    });

    test('updateAppName should update appName property', () => {
      const updatedBusiness = business.updateAppName('New App Name');
      
      expect(updatedBusiness.appName).toBe('New App Name');
      expect(updatedBusiness).toBe(business);
    });

    test('updateIdAddress should update idAddress property', () => {
      const updatedBusiness = business.updateIdAddress(2);
      
      expect(updatedBusiness.idAddress).toBe(2);
      expect(updatedBusiness).toBe(business);
    });
  });

  describe('Status change methods', () => {
    test('deactivate should set status to 0', () => {
      const deactivatedBusiness = business.deactivate();
      
      expect(deactivatedBusiness.status).toBe(0);
      expect(deactivatedBusiness).toBe(business);
    });

    test('activate should set status to 1', () => {
      // First deactivate
      business.deactivate();
      
      // Then activate
      const activatedBusiness = business.activate();
      
      expect(activatedBusiness.status).toBe(1);
      expect(activatedBusiness).toBe(business);
    });
  });
});