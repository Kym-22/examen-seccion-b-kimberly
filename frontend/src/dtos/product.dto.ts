export interface ProductRequestDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: string;
}

export interface ProductResponseDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
}
