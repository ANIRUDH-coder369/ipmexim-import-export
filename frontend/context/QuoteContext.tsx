'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PreselectedProduct {
  id?: string;
  name?: string;
}

interface QuoteContextType {
  isOpen: boolean;
  preselectedProduct?: PreselectedProduct;
  openQuoteModal: (product?: PreselectedProduct) => void;
  closeQuoteModal: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState<PreselectedProduct | undefined>(undefined);

  const openQuoteModal = (product?: PreselectedProduct) => {
    setPreselectedProduct(product);
    setIsOpen(true);
  };

  const closeQuoteModal = () => {
    setIsOpen(false);
    setPreselectedProduct(undefined);
  };

  return (
    <QuoteContext.Provider
      value={{
        isOpen,
        preselectedProduct,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuoteModal = (): QuoteContextType => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteProvider');
  }
  return context;
};
