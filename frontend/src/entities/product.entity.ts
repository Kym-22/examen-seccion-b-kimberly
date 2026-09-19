export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  formattedPrice: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
}
