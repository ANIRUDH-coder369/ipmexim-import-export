import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getApiUrl } from '@/utils/apiConfig';
import { PRODUCTS } from '@/data/products';

export interface ProductItem {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription?: string;
  specifications?: Record<string, string>;
  origin: string;
  hsCode: string;
  minimumOrderQuantity: string;
  imageUrls: string[];
  status: string;
  featured: boolean;
  sortOrder?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface ProductState {
  products: ProductItem[];
  featuredProducts: ProductItem[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  successNotice: string | null;
}

// Initial fallback featured products from local dataset
const INITIAL_FEATURED: ProductItem[] = PRODUCTS.slice(0, 4).map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  categoryId: p.categoryId,
  categoryName: p.categoryName,
  shortDescription: p.shortDescription,
  fullDescription: p.fullDescription,
  specifications: p.specifications as any,
  origin: p.origin,
  hsCode: p.hsCode,
  minimumOrderQuantity: p.minimumOrderQuantity,
  imageUrls: p.imageUrls,
  status: p.status,
  featured: true,
}));

const initialState: ProductState = {
  products: [],
  featuredProducts: INITIAL_FEATURED,
  isLoading: false,
  isSaving: false,
  error: null,
  successNotice: null,
};

// Async Thunks
export const fetchProductsThunk = createAsyncThunk(
  'products/fetchProducts',
  async (filter: { category?: string; search?: string; featured?: boolean } | void, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const params = new URLSearchParams();
      const f = filter || {};
      if (f.featured !== undefined) params.append('featured', String(f.featured));
      if (f.category) params.append('category', f.category);
      if (f.search) params.append('search', f.search);

      const res = await fetch(`${apiUrl}/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch products');
      return data.products || [];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to connect to backend');
    }
  }
);

export const fetchFeaturedProductsThunk = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products/featured`);
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to fetch featured products');
      return data.products && data.products.length > 0 ? data.products : INITIAL_FEATURED;
    } catch (err: any) {
      return INITIAL_FEATURED;
    }
  }
);

export const createProductThunk = createAsyncThunk(
  'products/createProduct',
  async ({ formData, token }: { formData: FormData; token: string }, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to create product');
      return data.product;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to transmit product');
    }
  }
);

export const updateProductThunk = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData, token }: { id: string; formData: FormData; token: string }, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to update product');
      return data.product;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update product');
    }
  }
);

export const toggleFeaturedThunk = createAsyncThunk(
  'products/toggleFeatured',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to toggle featured');
      return data.product;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to toggle status');
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'products/deleteProduct',
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || 'Failed to delete product');
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete product');
    }
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProductNotice: (state) => {
      state.successNotice = null;
      state.error = null;
    },
    setFeaturedProductsFallback: (state, action: PayloadAction<ProductItem[]>) => {
      state.featuredProducts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProductsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Featured
      .addCase(fetchFeaturedProductsThunk.fulfilled, (state, action) => {
        state.featuredProducts = action.payload;
      })
      // Create Product
      .addCase(createProductThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        state.products.unshift(action.payload);
        if (action.payload.featured) {
          state.featuredProducts.unshift(action.payload);
        }
        state.successNotice = `Product "${action.payload.name}" published successfully!`;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Update Product
      .addCase(updateProductThunk.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.isSaving = false;
        const updated = action.payload;
        state.products = state.products.map((p) =>
          (p._id === updated._id || p.id === updated.id) ? updated : p
        );
        state.featuredProducts = state.featuredProducts.map((p) =>
          (p._id === updated._id || p.id === updated.id) ? updated : p
        );
        if (updated.featured && !state.featuredProducts.some(p => p._id === updated._id)) {
          state.featuredProducts.unshift(updated);
        } else if (!updated.featured) {
          state.featuredProducts = state.featuredProducts.filter(p => p._id !== updated._id);
        }
        state.successNotice = `Product "${updated.name}" updated successfully!`;
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })
      // Toggle Featured
      .addCase(toggleFeaturedThunk.fulfilled, (state, action) => {
        const updated = action.payload;
        state.products = state.products.map((p) =>
          (p._id === updated._id || p.id === updated.id) ? updated : p
        );
        if (updated.featured) {
          if (!state.featuredProducts.some((p) => p._id === updated._id)) {
            state.featuredProducts.unshift(updated);
          }
        } else {
          state.featuredProducts = state.featuredProducts.filter((p) => p._id !== updated._id);
        }
      })
      // Delete Product
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        const id = action.payload;
        state.products = state.products.filter((p) => p._id !== id && p.id !== id);
        state.featuredProducts = state.featuredProducts.filter((p) => p._id !== id && p.id !== id);
        state.successNotice = 'Product removed from catalogue.';
      });
  },
});

export const { clearProductNotice, setFeaturedProductsFallback } = productSlice.actions;
export default productSlice.reducer;
