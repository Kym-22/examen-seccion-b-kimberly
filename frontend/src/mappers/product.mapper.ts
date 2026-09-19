import { ProductRequestDto, ProductResponseDto } from "@/dtos/product.dto";
import { Product } from "@/entities/product.entity";

export class ProductMapper {
  private static readonly DEFAULT_IMAGE = "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80";

  static toEntity(dto: ProductResponseDto): Product {
    const price = Number(dto.price) || 0;
    const stock = Number(dto.stock) || 0;

    return {
      id: dto.id,
      name: dto.name,
      description: dto.description || "Sin descripción disponible.",
      price: price,
      stock: stock,
      imageUrl: dto.imageUrl && dto.imageUrl.trim() !== "" ? dto.imageUrl : this.DEFAULT_IMAGE,
      category: dto.category || "General",
      formattedPrice: new Intl.NumberFormat("es-GT", {
        style: "currency",
        currency: "GTQ",
      }).format(price),
      inStock: stock > 0,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toEntities(dtos: ProductResponseDto[]): Product[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map((dto) => this.toEntity(dto));
  }

  static toRequestDto(entity: Partial<Product>): ProductRequestDto {
    return {
      name: entity.name?.trim() || "",
      description: entity.description?.trim(),
      price: Number(entity.price) || 0,
      stock: Number(entity.stock) || 0,
      imageUrl: entity.imageUrl?.trim() || undefined,
      category: entity.category?.trim() || "General",
    };
  }
}
