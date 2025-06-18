import { randomUUID } from 'crypto';
import crypto from 'crypto';

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

interface CashfreeWithdrawRequest {
  beneId: string;
  amount: number;
  transferId: string;
  transferMode: string;
  remarks: string;
}

export class CashfreePaymentService {
  private appId: string;
  private secretKey: string;
  private baseUrl: string;
  private payoutsBaseUrl: string;

  constructor() {
    // Use your provided credentials
    this.appId = process.env.CASHFREE_APP_ID || 'TEST105548987e17e6996710a080920b89845501';
    this.secretKey = process.env.CASHFREE_SECRET_KEY || 'cfsk_ma_test_a2dbfa097e2b0b855045c13041c2f85e_ba39c253';
    // Use correct sandbox URLs for testing
    this.baseUrl = 'https://sandbox.cashfree.com/pg';
    this.payoutsBaseUrl = 'https://payout-gamma.cashfree.com/payout/v1';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': this.appId,
      'x-client-secret': this.secretKey,
    };
  }

  private getPayoutHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Client-Id': this.appId,
      'X-Client-Secret': this.secretKey,
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

    const paymentRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: userId.toString(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.REPLIT_DEV_DOMAIN || 'https://repl.it'}/payment-success`,
        notify_url: `${process.env.REPLIT_DEV_DOMAIN || 'https://repl.it'}/api/payment/webhook`,
      },
    };

    try {
      console.log('Creating Cashfree order with data:', JSON.stringify(paymentRequest, null, 2));
      console.log('Using headers:', this.getHeaders());
      
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentRequest),
      });

      const responseText = await response.text();
      console.log('Cashfree API response:', response.status, responseText);

      if (!response.ok) {
        throw new Error(`Cashfree API error: ${response.status} - ${responseText}`);
      }

      return JSON.parse(responseText);
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

  // Add beneficiary for withdrawals
  async addBeneficiary(
    userId: number,
    name: string,
    email: string,
    phone: string,
    bankAccount: string,
    ifsc: string,
    address: string
  ): Promise<any> {
    const beneId = `BENE_${userId}_${Date.now()}`;

    const beneficiaryData = {
      beneId,
      name,
      email,
      phone,
      bankAccount,
      ifsc,
      address1: address,
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    };

    try {
      const response = await fetch(`${this.payoutsBaseUrl}/addBeneficiary`, {
        method: 'POST',
        headers: this.getPayoutHeaders(),
        body: JSON.stringify(beneficiaryData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to add beneficiary: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to add beneficiary:', error);
      throw error;
    }
  }

  // Request withdrawal/payout
  async requestWithdraw(
    userId: number,
    amount: number,
    beneId: string,
    remarks: string = 'Gaming platform withdrawal'
  ): Promise<any> {
    const transferId = `WITHDRAW_${userId}_${Date.now()}`;

    const withdrawRequest: CashfreeWithdrawRequest = {
      beneId,
      amount,
      transferId,
      transferMode: 'banktransfer',
      remarks,
    };

    try {
      const response = await fetch(`${this.payoutsBaseUrl}/requestTransfer`, {
        method: 'POST',
        headers: this.getPayoutHeaders(),
        body: JSON.stringify(withdrawRequest),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Withdrawal request failed: ${response.status} - ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Withdrawal request failed:', error);
      throw error;
    }
  }

  // Get withdrawal status
  async getWithdrawStatus(transferId: string): Promise<any> {
    try {
      const response = await fetch(`${this.payoutsBaseUrl}/getTransferStatus?transferId=${transferId}`, {
        method: 'GET',
        headers: this.getPayoutHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to get withdrawal status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get withdrawal status:', error);
      throw error;
    }
  }

  generateSignature(orderId: string, orderAmount: string, timestamp: string): string {
    const signatureData = `${orderId}${orderAmount}${timestamp}`;
    return crypto.createHmac('sha256', this.secretKey).update(signatureData).digest('hex');
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string, timestamp: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(timestamp + payload)
      .digest('hex');

    return expectedSignature === signature;
  }
}

export const cashfreeService = new CashfreePaymentService();