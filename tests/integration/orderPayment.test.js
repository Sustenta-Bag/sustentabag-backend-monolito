// tests/integration/orderPayment.test.js

import axios from 'axios'; // Usar axios para fazer chamadas HTTP reais

// URL base do monolito (seria o endereço do contêiner no Docker Compose)
const MONOLITO_BASE_URL = process.env.MONOLITO_BASE_URL || 'http://localhost:4041';
// URL base do micro-serviço de pagamento (seria o endereço do contêiner no Docker Compose)
const PAYMENT_SERVICE_BASE_URL = process.env.PAYMENT_SERVICE_BASE_URL || 'http://localhost:3000'; // Verifique a porta correta do payment-service

describe('Order and Payment Integration', () => {

  // Antes de rodar os testes, garantir que os serviços estejam rodando
  // Você precisaria ter o Docker Compose configurado e rodando antes de executar a suíte de testes de integração.
  // Exemplo: rodar 'docker compose up -d' na linha de comando antes de 'npm test tests/integration'
  beforeAll(async () => {
    console.log(`Verificando se os serviços estão acessíveis: ${MONOLITO_BASE_URL} e ${PAYMENT_SERVICE_BASE_URL}`);
    // Adicionar verificações de saúde/health check aqui se os serviços tiverem endpoints de saúde
    // Ex: await axios.get(`${MONOLITO_BASE_URL}/health`);
    // Ex: await axios.get(`${PAYMENT_SERVICE_BASE_URL}/health`);
  });

  it('should successfully create an order and then initiate payment via payment service', async () => {
    // 1. Criar um pedido no monolito
    const orderData = {
      userId: 1, // Substitua por um ID de usuário válido no seu ambiente de teste
      businessId: 1, // Substitua por um ID de negócio válido no seu ambiente de teste
      items: [
        { bagId: 1, quantity: 1 }, // Substitua por IDs de sacolas válidos
      ],
      // Não inclua paymentMethod aqui, pois o monolito não lida mais com isso na criação
    };

    let orderResponse;
    try {
      orderResponse = await axios.post(`${MONOLITO_BASE_URL}/api/orders`, orderData, {
        // Adicionar headers de autenticação se necessário
        // headers: { 'Authorization': 'Bearer SEU_TOKEN_AQUI' }
      });
      expect(orderResponse.status).toBe(201);
      expect(orderResponse.data).toHaveProperty('id'); // Verificar se a resposta contém o ID do pedido criado
    } catch (error) {
      console.error("Erro ao criar pedido no monolito:", error.response?.data || error.message);
      throw error;
    }

    const createdOrder = orderResponse.data;
    console.log('Pedido criado no monolito com ID:', createdOrder.id);

    // 2. Preparar dados para iniciar o pagamento no micro-serviço de pagamento
    // Traduzir os itens do pedido para o formato esperado pelo payment-service
    // Note: O OrderService no monolito adiciona o preço aos itens ao criar o pedido, então usamos createdOrder.items
    const paymentItems = createdOrder.items.map(item => ({
        title: `Bag ID ${item.bagId}`, // Exemplo de como mapear
        description: 'Descrição da sacola', // Exemplo
        quantity: item.quantity,
        unitPrice: item.price // Usar o preço que veio do monolito
    }));    const paymentData = {
        userId: createdOrder.userId.toString(), // userId no payment-service parece ser string
        items: paymentItems,
        payer: { // Dados do pagador - podem ser fixos para o teste ou obtidos de um usuário de teste
            email: "teste_integracao@example.com",
            name: "Teste Integracao",
            identification: { // Verifique os tipos e números de documento suportados pelo payment-service
                type: "CPF",
                number: "11122233344"
            }
        },
        callbackUrl: `${MONOLITO_BASE_URL}/api/payments/webhook`, // Endpoint do webhook no monolito para receber notificações do payment-service
        metadata: {
            orderId: createdOrder.id, // Associar o pagamento ao pedido criado
            businessId: createdOrder.businessId, // Incluir businessId nos metadados
            // Adicionar outros metadados úteis, como userId do monolito se for diferente do userId do pagador no payment-service
            monolitoUserId: createdOrder.userId,
        }
    };

    let paymentResponse;
    try {
        paymentResponse = await axios.post(`${PAYMENT_SERVICE_BASE_URL}/api/payments`, paymentData);
        expect(paymentResponse.status).toBe(201); // Ou o status esperado para sucesso (ex: 200 ou 201)
        expect(paymentResponse.data).toHaveProperty('id'); // Verificar se a resposta contém o ID do pagamento criado
        // Adicionar mais asserções relevantes com base na resposta do payment-service
        console.log("Pagamento iniciado com sucesso com ID:", paymentResponse.data.id);
    } catch (error) {
        console.error("Erro ao iniciar pagamento no payment-service:", error.response?.data || error.message);
        // Se o erro for uma resposta HTTP, você pode querer assertar o status de erro específico
        // ex: expect(error.response.status).toBe(400);
        throw error; // Relança o erro para falhar o teste
    }

    // Opcional: Adicionar passos posteriores, como simular um webhook recebido pelo monolito
    // para testar a atualização do status do pedido com base na notificação de pagamento.
  });

  // Teste para verificar o webhook funcionando
  it('should successfully process a payment webhook', async () => {
    // 1. Criar um pedido no monolito
    const orderData = {
      userId: 1,
      businessId: 1,
      items: [{ bagId: 1, quantity: 1 }],
    };

    let orderResponse;
    try {
      orderResponse = await axios.post(`${MONOLITO_BASE_URL}/api/orders`, orderData);
      expect(orderResponse.status).toBe(201);
    } catch (error) {
      console.error("Erro ao criar pedido no monolito:", error.response?.data || error.message);
      throw error;
    }

    const createdOrder = orderResponse.data;

    // 2. Simular o webhook de notificação de pagamento do payment-service para o monolito
    const webhookData = {
      orderId: createdOrder.id,
      status: 'completed',
      paymentId: 'test-payment-id',
    };

    try {
      // Enviar a notificação para o endpoint de webhook do monolito
      const webhookResponse = await axios.post(`${MONOLITO_BASE_URL}/api/payments/webhook`, webhookData);
      expect(webhookResponse.status).toBe(200);
    } catch (error) {
      console.error("Erro ao enviar webhook para o monolito:", error.response?.data || error.message);
      throw error;
    }

    // 3. Verificar se o status do pedido foi atualizado corretamente
    try {
      const updatedOrderResponse = await axios.get(`${MONOLITO_BASE_URL}/api/orders/${createdOrder.id}`);
      expect(updatedOrderResponse.status).toBe(200);
      expect(updatedOrderResponse.data.status).toBe('confirmed');
    } catch (error) {
      console.error("Erro ao verificar pedido atualizado:", error.response?.data || error.message);
      throw error;
    }
  });

  // Adicionar mais testes de integração para outros fluxos (cancelamento, reembolso, etc.) se necessário

});