//[slug]/PaymentOptions.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentOptionsProps {
  paypalEmail?: string | null;
  wiseEmail?: string | null;
  price?: number | null;
}

export default function PaymentOptions({ paypalEmail, wiseEmail, price }: PaymentOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState<'paypal' | 'wise' | null>(null);
  const [paymentSent, setPaymentSent] = useState(false);

  const handlePayment = () => {
    // In a real app, you would integrate with PayPal/Wise APIs
    console.log(`Processing ${selectedMethod} payment to instructor`);
    setPaymentSent(true);
  };

  if (paymentSent) {
    return (
      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Payment Sent!</h4>
        <p className="text-gray-600">
          Your payment of ${price?.toFixed(2)} has been successfully processed via {selectedMethod === 'paypal' ? 'PayPal' : 'Wise'}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {price && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Amount to Pay:</span>
            <span className="text-2xl font-bold text-blue-600">${price.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Select Payment Method</h4>
        
        {paypalEmail && (
          <div 
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedMethod === 'paypal' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMethod('paypal')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24">
                  <path d="M10.5 17.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" fill="#253B80"/>
                  <path d="M19.4 7.5c-1.2-1.2-3.1-1.2-4.3 0l-.7.7-.7-.7c-1.2-1.2-3.1-1.2-4.3 0-1.2 1.2-1.2 3.1 0 4.3l.7.7-4.3 4.3c-1.2 1.2-1.2 3.1 0 4.3 1.2 1.2 3.1 1.2 4.3 0l4.3-4.3.7.7c1.2 1.2 3.1 1.2 4.3 0 1.2-1.2 1.2-3.1 0-4.3l-.7-.7.7-.7c1.2-1.2 1.2-3.1 0-4.3z" fill="#179BD7"/>
                </svg>
              </div>
              <div>
                <h5 className="font-medium">PayPal</h5>
                <p className="text-sm text-gray-500">Send to: {paypalEmail}</p>
              </div>
            </div>
          </div>
        )}

        {wiseEmail && (
          <div 
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedMethod === 'wise' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMethod('wise')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" fill="#00B9FF"/>
                </svg>
              </div>
              <div>
                <h5 className="font-medium">Wise</h5>
                <p className="text-sm text-gray-500">Send to: {wiseEmail}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMethod && (
        <Button 
          onClick={handlePayment}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
        >
          Send Payment via {selectedMethod === 'paypal' ? 'PayPal' : 'Wise'}
        </Button>
      )}
    </div>
  );
}