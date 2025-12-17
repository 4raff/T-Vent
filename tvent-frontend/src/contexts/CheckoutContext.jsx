'use client';

import { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState({
    eventId: null,
    quantity: 1
  });

  const setCheckout = (eventId, quantity) => {
    setCheckoutData({
      eventId,
      quantity: quantity || 1
    });
  };

  const clearCheckout = () => {
    setCheckoutData({
      eventId: null,
      quantity: 1
    });
  };

  return (
    <CheckoutContext.Provider value={{ checkoutData, setCheckout, clearCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
}
