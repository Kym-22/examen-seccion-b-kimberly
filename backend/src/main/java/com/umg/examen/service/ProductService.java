package com.umg.examen.service;

import com.umg.examen.dto.request.ProductRequest;
import com.umg.examen.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {
    List<ProductResponse> getAllProducts();
    List<ProductResponse> searchProducts(String query);
    ProductResponse getProductById(Long id);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
}
