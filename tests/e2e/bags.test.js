const { getTestClient, clearDatabase, setupDatabase, teardownDatabase } = require('./setup');

describe('E2E Tests - Bag API Endpoints', () => {
  let request;
  let createdBagId;
  const testCompanyId = 1;

  // Executa antes de todos os testes
  beforeAll(async () => {
    await setupDatabase();
    request = getTestClient();
  });

  // Limpa o banco de dados entre os testes
  beforeEach(async () => {
    await clearDatabase();
  });

  // Fecha a conexão após todos os testes
  afterAll(async () => {
    await teardownDatabase();
  });

  describe('POST /api/bags', () => {
    test('deve criar uma nova sacola quando dados são válidos', async () => {
      const bagData = {
        type: 'Doce',
        price: 15.99,
        description: 'Sacola com produtos doces',
        companyId: testCompanyId,
        status: 1
      };

      const response = await request
        .post('/api/bags')
        .send(bagData)
        .expect(201);

      // Guardamos o ID para usar em outros testes
      createdBagId = response.body.id;

      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(bagData.type);
      expect(response.body.price).toBe(bagData.price);
      expect(response.body.companyId).toBe(bagData.companyId);
    });

    test('deve retornar erro 400 quando dados são inválidos', async () => {
      const invalidBagData = {
        // type está faltando
        price: -5, // preço negativo, inválido
        companyId: 'abc' // deve ser um número
      };

      const response = await request
        .post('/api/bags')
        .send(invalidBagData)
        .expect(400);

      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });
  });

  describe('GET /api/bags', () => {
    test('deve retornar lista de sacolas', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Salgada',
        price: 12.99,
        description: 'Sacola com produtos salgados',
        companyId: testCompanyId,
        status: 1
      };

      await request
        .post('/api/bags')
        .send(bagData);

      // Depois obtemos a lista
      const response = await request
        .get('/api/bags')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('type');
    });
  });

  describe('GET /api/bags/:id', () => {
    test('deve retornar uma sacola por ID', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Mista',
        price: 18.99,
        description: 'Sacola com produtos variados',
        companyId: testCompanyId,
        status: 1
      };

      const createResponse = await request
        .post('/api/bags')
        .send(bagData);

      const bagId = createResponse.body.id;

      // Depois buscamos por ID
      const response = await request
        .get(`/api/bags/${bagId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', bagId);
      expect(response.body.type).toBe(bagData.type);
      expect(response.body.price).toBe(bagData.price);
    });

    test('deve retornar 404 quando sacola não existe', async () => {
      const nonExistentId = 9999;
      
      await request
        .get(`/api/bags/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /api/bags/:id', () => {
    test('deve atualizar uma sacola existente', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Doce',
        price: 10.99,
        description: 'Sacola original',
        companyId: testCompanyId,
        status: 1
      };

      const createResponse = await request
        .post('/api/bags')
        .send(bagData);

      const bagId = createResponse.body.id;

      // Depois atualizamos
      const updateData = {
        price: 14.99,
        description: 'Sacola atualizada'
      };

      const response = await request
        .put(`/api/bags/${bagId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', bagId);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.type).toBe(bagData.type); // Mantido do original
    });
  });

  describe('DELETE /api/bags/:id', () => {
    test('deve excluir uma sacola existente', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Salgada',
        price: 11.99,
        description: 'Sacola para exclusão',
        companyId: testCompanyId,
        status: 1
      };

      const createResponse = await request
        .post('/api/bags')
        .send(bagData);

      const bagId = createResponse.body.id;

      // Depois excluímos
      await request
        .delete(`/api/bags/${bagId}`)
        .expect(204); // No content

      // Verificamos se realmente foi excluída
      await request
        .get(`/api/bags/${bagId}`)
        .expect(404);
    });
  });

  describe('GET /api/company/:companyId/bags', () => {
    test('deve retornar sacolas de uma empresa específica', async () => {
      // Criamos duas sacolas para a mesma empresa
      const bagData1 = {
        type: 'Doce',
        price: 10.99,
        companyId: testCompanyId,
        status: 1
      };

      const bagData2 = {
        type: 'Salgada',
        price: 12.99,
        companyId: testCompanyId,
        status: 1
      };

      await request.post('/api/bags').send(bagData1);
      await request.post('/api/bags').send(bagData2);

      const response = await request
        .get(`/api/company/${testCompanyId}/bags`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body.every(bag => bag.companyId === testCompanyId)).toBe(true);
    });
  });

  describe('GET /api/company/:companyId/bags/active', () => {
    test('deve retornar apenas sacolas ativas de uma empresa', async () => {
      // Criamos uma sacola ativa
      const activeBag = {
        type: 'Doce',
        price: 10.99,
        companyId: testCompanyId,
        status: 1 // Ativa
      };

      // Criamos uma sacola inativa
      const inactiveBag = {
        type: 'Salgada',
        price: 12.99,
        companyId: testCompanyId,
        status: 0 // Inativa
      };

      await request.post('/api/bags').send(activeBag);
      await request.post('/api/bags').send(inactiveBag);

      const response = await request
        .get(`/api/company/${testCompanyId}/bags/active`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.every(bag => bag.status === 1)).toBe(true);
      expect(response.body.every(bag => bag.companyId === testCompanyId)).toBe(true);
    });
  });

  describe('PATCH /api/bags/:id/status', () => {
    test('deve alterar o status de uma sacola', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Doce',
        price: 10.99,
        companyId: testCompanyId,
        status: 1 // Ativa
      };

      const createResponse = await request
        .post('/api/bags')
        .send(bagData);

      const bagId = createResponse.body.id;

      // Agora alteramos o status para inativa
      const response = await request
        .patch(`/api/bags/${bagId}/status`)
        .send({ status: 0 })
        .expect(200);

      expect(response.body).toHaveProperty('id', bagId);
      expect(response.body.status).toBe(0);
    });

    test('deve retornar erro 400 se status for inválido', async () => {
      // Primeiro criamos uma sacola
      const bagData = {
        type: 'Doce',
        price: 10.99,
        companyId: testCompanyId,
        status: 1
      };

      const createResponse = await request
        .post('/api/bags')
        .send(bagData);

      const bagId = createResponse.body.id;

      // Agora tentamos com um status inválido
      await request
        .patch(`/api/bags/${bagId}/status`)
        .send({ status: 2 }) // Status inválido
        .expect(400);
    });
  });
});