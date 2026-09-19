package com.umg.examen.mapper;

import com.umg.examen.dto.request.ProductRequest;
import com.umg.examen.dto.response.ProductResponse;
import com.umg.examen.entity.Product;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        return product;
    }

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setImageUrl(product.getImageUrl());
        response.setCategory(product.getCategory());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }

    public List<ProductResponse> toResponseList(List<Product> products) {
        if (products == null) {
            return List.of();
        }
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public void updateEntityFromRequest(ProductRequest request, Product product) {
        if (request == null || product == null) {
            return;
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
    }
}
