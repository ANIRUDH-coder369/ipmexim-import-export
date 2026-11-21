import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getApiUrl } from '@/utils/apiConfig';

export interface QuotationItem {
  id?: string;
  _id?: string;
  fullName: string;
  corporateEmail?: string;
  businessEmail?: string;
  company?: string;
  companyName?: string;
  destinationCountry: string;
  destinationPort?: string;
  productOfInterest?: string;
  productName?: string;
  estimatedQuantity?: string;
  quantity?: string;
  status: string;
  createdAt: string;
  technicalSpecifications?: string;
  message?: string;
}

export interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  adminUser: { name: string; email: string; role: string } | null;
  quotations: QuotationItem[];
  isLoading: boolean;
  error: string | null;
  statusFilter: string;
  searchQuery: string;
}

const initialState: AdminState = {
  isAuthenticated: false,
  token: null,
  adminUser: null,
  quotations: [],
  isLoading: false,
  error: null,
  statusFilter: 'ALL',
  searchQuery: '',
};

export const fetchQuotationsThunk = createAsyncThunk(
  'admin/fetchQuotations',
  async (token: string, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/admin/quotations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to fetch quotations from backend.');
      }
      return data.quotations || data.enquiries || [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error connecting to backend.');
    }
  }
);

export const sendCustomerEmailThunk = createAsyncThunk(
  'admin/sendCustomerEmail',
  async (
    payload: { recipientEmail: string; subject: string; message: string; quotationId?: string; newStatus?: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/admin/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`,
        },
        body: JSON.stringify({
          recipientEmail: payload.recipientEmail,
          subject: payload.subject,
          message: payload.message,
          quotationId: payload.quotationId,
          updateStatus: payload.newStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to dispatch email from backend.');
      }
      return { data, quotationId: payload.quotationId, newStatus: payload.newStatus };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error dispatching email.');
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; user?: any }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      if (action.payload.user) state.adminUser = action.payload.user;
    },
    logoutAdmin: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.adminUser = null;
      state.quotations = [];
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateQuotationStatusLocal: (state, action: PayloadAction<{ id: string; status: string }>) => {
      state.quotations = state.quotations.map((q) => {
        if (q.id === action.payload.id || q._id === action.payload.id) {
          return { ...q, status: action.payload.status };
        }
        return q;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuotationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotations = action.payload;
      })
      .addCase(fetchQuotationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(sendCustomerEmailThunk.fulfilled, (state, action) => {
        if (action.payload.quotationId && action.payload.newStatus) {
          state.quotations = state.quotations.map((q) => {
            if (q.id === action.payload.quotationId || q._id === action.payload.quotationId) {
              return { ...q, status: action.payload.newStatus! };
            }
            return q;
          });
        }
      });
  },
});

export const { setAuth, logoutAdmin, setStatusFilter, setSearchQuery, updateQuotationStatusLocal } = adminSlice.actions;
export default adminSlice.reducer;
