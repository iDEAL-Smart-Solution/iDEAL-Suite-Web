import api from "./api";
import type {
  Product,
  GetProductsResponse,
  UpdateProductStatusRequest,
  UpdateProductStatusResponse,
} from "../types/product";
import { mockDashboardProducts } from "../mocks/products.mock";

// Check if we're in demo mode
const isDemoMode = () => localStorage.getItem("token") === "demo-token";

export const productService = {
  /**
   * Get all products for a school
   */
  getProducts: async (schoolId: string): Promise<GetProductsResponse> => {
    try {
      // Return mock data in demo mode
      if (isDemoMode()) {
        return mockDashboardProducts;
      }

      const response = await api.get<GetProductsResponse>(
        `/productmonitoring/school/${schoolId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  /**
   * Get single product details
   */
  getProductDetails: async (productId: string): Promise<Product> => {
    try {
      const response = await api.get<Product>(
        `/productmonitoring/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  /**
   * Update product status (activate/deactivate)
   */
  updateProductStatus: async (
    data: UpdateProductStatusRequest
  ): Promise<UpdateProductStatusResponse> => {
    try {
      const response = await api.put<UpdateProductStatusResponse>(
        `/productmonitoring/product/${data.productId}/status`,
        { isActive: data.isActive }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product status:", error);
      throw error;
    }
  },

  /**
   * Launch/use a product (increment usage count)
   */
  launchProduct: async (productId: string): Promise<void> => {
    try {
      await api.post(`/productmonitoring/product/${productId}/launch`, {});
    } catch (error) {
      console.error("Error launching product:", error);
      throw error;
    }
  },

  /**
   * Search products by name or code
   */
  searchProducts: async (
    schoolId: string,
    query: string
  ): Promise<GetProductsResponse> => {
    try {
      const response = await api.get<GetProductsResponse>(
        `/productmonitoring/school/${schoolId}/search`,
        {
          params: { q: query },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },
};
