'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  openQuoteModal as openModalAction,
  closeQuoteModal as closeModalAction,
  PreselectedProduct,
} from '@/store/slices/quoteSlice';

interface QuoteContextType {
  isOpen: boolean;
  preselectedProduct?: PreselectedProduct;
  openQuoteModal: (product?: PreselectedProduct) => void;
  closeQuoteModal: () => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isOpen, preselectedProduct } = useAppSelector((state) => state.quote);

  const openQuoteModal = (product?: PreselectedProduct) => {
    dispatch(openModalAction(product));
  };

  const closeQuoteModal = () => {
    dispatch(closeModalAction());
  };

  return (
    <QuoteContext.Provider
      value={{
        isOpen,
        preselectedProduct: preselectedProduct || undefined,
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
