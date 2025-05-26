import PaymentWebhookController from '../../../src/presentation/controllers/PaymentWebhookController';

describe('PaymentWebhookController', () => {
  let mockOrderService;
  let controller;
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    mockOrderService = {
      getOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
      cancelOrder: jest.fn()
    };

    controller = new PaymentWebhookController(mockOrderService);

    mockRequest = {
      body: {
        orderId: '12345',
        status: 'completed',
        paymentId: 'payment123'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockNext = jest.fn();
  });

  it('should handle payment completion successfully', async () => {
    // Mock successful order retrieval
    mockOrderService.getOrder.mockResolvedValue({ id: '12345' });
    mockOrderService.updateOrderStatus.mockResolvedValue({});

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockOrderService.getOrder).toHaveBeenCalledWith('12345');
    expect(mockOrderService.updateOrderStatus).toHaveBeenCalledWith('12345', 'confirmed');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Notificação processada com sucesso'
    });
  });

  it('should handle payment failure and cancel order', async () => {
    // Set payment status to failed
    mockRequest.body.status = 'failed';
    
    // Mock successful order retrieval
    mockOrderService.getOrder.mockResolvedValue({ id: '12345' });
    mockOrderService.cancelOrder.mockResolvedValue({});

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockOrderService.getOrder).toHaveBeenCalledWith('12345');
    expect(mockOrderService.cancelOrder).toHaveBeenCalledWith('12345');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Notificação processada com sucesso'
    });
  });

  it('should return 400 if orderId or status is missing', async () => {
    // Missing status
    mockRequest.body = { orderId: '12345' };

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Dados incompletos. orderId e status são obrigatórios'
    });

    // Missing orderId
    mockRequest.body = { status: 'completed' };

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
  });

  it('should return 404 if order is not found', async () => {
    // Mock order not found
    mockOrderService.getOrder.mockResolvedValue(null);

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockOrderService.getOrder).toHaveBeenCalledWith('12345');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Pedido com ID 12345 não encontrado'
    });
  });

  it('should call next with error if an exception occurs', async () => {
    const error = new Error('Database connection failed');
    mockOrderService.getOrder.mockRejectedValue(error);

    await controller.handlePaymentUpdate(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
