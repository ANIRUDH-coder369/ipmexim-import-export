import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getApiUrl } from '@/utils/apiConfig';

export interface PreselectedProduct {
  id?: string;
  name?: string;
  category?: string;
  unit?: string;
}

export interface QuoteFormState {
  fullName: string;
  businessEmail: string;
  companyName: string;
  country: string;
  destinationPort?: string;
  productId: string;
  productName: string;
  quantity: string;
  contactMethod: string;
  phone: string;
  message: string;
}

export interface QuoteState {
  isOpen: boolean;
  preselectedProduct: PreselectedProduct | null;
  formData: QuoteFormState;
  isSubmitting: boolean;
  submissionSuccess: boolean;
  submissionError: string | null;
  submittedEnquiry: any | null;
}

const initialFormData: QuoteFormState = {
  fullName: '',
  businessEmail: '',
  companyName: '',
  country: '',
  destinationPort: '',
  productId: '',
  productName: '',
  quantity: '',
  contactMethod: 'Email',
  phone: '',
  message: '',
};

const initialState: QuoteState = {
  isOpen: false,
  preselectedProduct: null,
  formData: initialFormData,
  isSubmitting: false,
  submissionSuccess: false,
  submissionError: null,
  submittedEnquiry: null,
};

export const submitQuotationThunk = createAsyncThunk(
  'quote/submitQuotation',
  async (quoteData: Partial<QuoteFormState>, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: quoteData.fullName?.trim(),
          corporateEmail: quoteData.businessEmail?.trim(),
          company: quoteData.companyName?.trim(),
          destinationCountry: quoteData.country?.trim(),
          destinationPort: quoteData.destinationPort?.trim() || quoteData.country?.trim(),
          productOfInterest: quoteData.productName || 'Export Sourcing',
          estimatedQuantity: quoteData.quantity?.trim(),
          phoneWhatsApp: quoteData.phone?.trim(),
          technicalSpecifications: quoteData.message?.trim(),
          consent: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to submit quotation to backend server.');
      }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error connecting to backend server.');
    }
  }
);

export const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    openQuoteModal: (state, action: PayloadAction<PreselectedProduct | undefined>) => {
      state.isOpen = true;
      state.submissionSuccess = false;
      state.submissionError = null;
      if (action.payload) {
        state.preselectedProduct = action.payload;
        state.formData.productId = action.payload.id || action.payload.name || '';
        state.formData.productName = action.payload.name || '';
        state.formData.message = `Requesting formal commercial export quotation and FOB/CIF terms for ${action.payload.name}.`;
      }
    },
    closeQuoteModal: (state) => {
      state.isOpen = false;
    },
    updateFormData: (state, action: PayloadAction<Partial<QuoteFormState>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetQuoteForm: (state) => {
      state.formData = initialFormData;
      state.isSubmitting = false;
      state.submissionSuccess = false;
      state.submissionError = null;
      state.submittedEnquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuotationThunk.pending, (state) => {
        state.isSubmitting = true;
        state.submissionError = null;
      })
      .addCase(submitQuotationThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = true;
        state.submittedEnquiry = action.payload;
      })
      .addCase(submitQuotationThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submissionSuccess = false;
        state.submissionError = (action.payload as string) || 'Submission failed';
      });
  },
});

export const { openQuoteModal, closeQuoteModal, updateFormData, resetQuoteForm } = quoteSlice.actions;
export default quoteSlice.reducer;
