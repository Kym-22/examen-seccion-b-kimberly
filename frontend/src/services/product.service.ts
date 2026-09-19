import { ProductResponseDto } from "@/dtos/product.dto";
import { Product } from "@/entities/product.entity";
import { ProductMapper } from "@/mappers/product.mapper";
import { ApiClient } from "./api.client";

export class ProductService {
  static async getAll(): Promise<Product[]> {
    const response = await ApiClient.get<ProductResponseDto[]>("/api/products");
    return ProductMapper.toEntities(response.data);
  }

  static async search(query: string): Promise<Product[]> {
    const endpoint = query.trim() ? `/api/products?query=${encodeURIComponent(query.trim())}` : "/api/products";
    const response = await ApiClient.get<ProductResponseDto[]>(endpoint);
    return ProductMapper.toEntities(response.data);
  }

  static async getById(id: number): Promise<Product> {
    const response = await ApiClient.get<ProductResponseDto>(`/api/products/${id}`);
    return ProductMapper.toEntity(response.data);
  }

  static async create(product: Partial<Product>): Promise<Product> {
    const dto = ProductMapper.toRequestDto(product);
    const response = await ApiClient.post<ProductResponseDto>("/api/products", dto);
    return ProductMapper.toEntity(response.data);
  }

  static async update(id: number, product: Partial<Product>): Promise<Product> {
    const dto = ProductMapper.toRequestDto(product);
    const response = await ApiClient.put<ProductResponseDto>(`/api/products/${id}`, dto);
    return ProductMapper.toEntity(response.data);
  }

  static async delete(id: number): Promise<void> {
    await ApiClient.delete<void>(`/api/products/${id}`);
  }
}
