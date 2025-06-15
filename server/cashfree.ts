import { randomUUID } from 'crypto';

interface CashfreePaymentRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl: string;
  };
}

interface CashfreePaymentResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: string;
  payment_session_id: string;
  order_expiry_time: string;
  order_note: string;
  created_at: string;
  order_splits: any[];
}

export class CashfreePaymentService {
  private appId: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.appId = process.env.CASHFREE_APP_ID!;
    this.secretKey = process.env.CASHFREE_SECRET_KEY!;
    // Use sandbox URL for testing
    this.baseUrl = 'https://sandbox.cashfree.com/pg';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
    };
  }

  async createOrder(
    userId: number,
    amount: number,
    customerName: string,
    customerEmail: string = `user${userId}@kirda.com`,
    customerPhone: string = '9999999999'
  ): Promise<CashfreePaymentResponse> {
    const orderId = `KIRDA_${userId}_${Date.now()}`;
    
    const paymentRequest: CashfreePaymentRequest = {
      orderId,
      orderAmount: amount,
      orderCurrency: 'INR',
      customerDetails: {
        customerId: userId.toString(),
        customerName,
        customerEmail,
        customerPhone,
      },
      orderMeta: {
        returnUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/payment-success`,
        notifyUrl: `${process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000'}/api/payment/webhook`,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentRequest),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Cashfree API error: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Cashfree order creation failed:', error);
      throw error;
    }
  }

  async getPaymentSession(orderId: string): Promise<{ payment_session_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/payments`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment session: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get payment session:', error);
      throw error;
    }
  }

  async verifyPayment(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to verify payment: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }

  generateSignature(orderId: string, orderAmount: string, timestamp: string): string {
    // Implement signature generation for webhook verification
    // This is a simplified version - in production, use proper HMAC
    return Buffer.from(`${orderId}${orderAmount}${timestamp}${this.secretKey}`).toString('base64');
  }
}

export const cashfreeService = new CashfreePaymentService();