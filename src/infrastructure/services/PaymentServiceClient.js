import axios from 'axios';
import AppError from '../errors/AppError.js';

class PaymentServiceClient {
  constructor(baseURL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  async createPayment(paymentData) {
    try {
      const response = await this.client.post('/api/payments', paymentData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          error.response.data.message || 'Erro ao processar pagamento',
          'PAYMENT_ERROR',
          error.response.status
        );
      }
      throw new AppError('Erro ao comunicar com o serviço de pagamento', 'PAYMENT_SERVICE_ERROR');
    }
  }

  async getPayment(paymentId) {
    try {
      const response = await this.client.get(`/api/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw AppError.notFound('Pagamento', paymentId);
      }
      throw new AppError('Erro ao buscar pagamento', 'PAYMENT_SERVICE_ERROR');
    }
  }

  async cancelPayment(paymentId) {
    try {
      const response = await this.client.post(`/api/payments/${paymentId}/cancel`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          error.response.data.message || 'Erro ao cancelar pagamento',
          'PAYMENT_ERROR',
          error.response.status
        );
      }
      throw new AppError('Erro ao comunicar com o serviço de pagamento', 'PAYMENT_SERVICE_ERROR');
    }
  }

  async refundPayment(paymentId) {
    try {
      const response = await this.client.post(`/api/payments/${paymentId}/refund`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new AppError(
          error.response.data.message || 'Erro ao reembolsar pagamento',
          'PAYMENT_ERROR',
          error.response.status
        );
      }
      throw new AppError('Erro ao comunicar com o serviço de pagamento', 'PAYMENT_SERVICE_ERROR');
    }
  }
}

export default PaymentServiceClient; 