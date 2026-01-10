export const ProductStatus = {
  Active: "active",
  Inactive: "inactive",
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];

export type Product = {
  productId: string;
  productName: string;
  productCode: string;
  description: string;
  isActive: boolean;
  requiresSubscription: boolean;
  usageCount: number;
  lastUsed?: string;
  activeSince?: string;
  category?: string;
  version?: string;
  features?: string[];
};

export type GetProductsResponse = {
  products: Product[];
  total?: number;
};

export type UpdateProductStatusRequest = {
  productId: string;
  isActive: boolean;
};

export type UpdateProductStatusResponse = {
  success: boolean;
  product: Product;
  message?: string;
};
