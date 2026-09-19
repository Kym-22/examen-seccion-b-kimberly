"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/entities/product.entity";
import { ProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { DataTable } from "@/components/DataTable";
import {
  ViewProductModal,
  ProductFormModal,
  DeleteConfirmModal,
} from "@/components/ProductModals";
import {
  Boxes,
  ShieldCheck,
  User as UserIcon,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function ProductsPage() {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal states
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formProduct, setFormProduct] = useState<Product | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err: any) {
      showToast(err.message || "Error al cargar la lista de productos", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // View Handler
  const handleView = (product: Product) => {
    setViewProduct(product);
    setIsViewModalOpen(true);
  };

  // Create Handler
  const handleCreate = () => {
    setFormProduct(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  };

  // Edit Handler
  const handleEdit = (product: Product) => {
    setFormProduct(product);
    setFormMode("edit");
    setIsFormModalOpen(true);
  };

  // Delete Handler
  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Submit Form (Create / Edit)
  const handleFormSubmit = async (data: Partial<Product>) => {
    if (formMode === "create") {
      await ProductService.create(data);
      showToast("¡Producto creado exitosamente!");
    } else if (formMode === "edit" && formProduct) {
      await ProductService.update(formProduct.id, data);
      showToast("¡Producto actualizado exitosamente!");
    }
    await loadProducts();
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    await ProductService.delete(deleteProduct.id);
    showToast(`El producto "${deleteProduct.name}" ha sido eliminado.`);
    await loadProducts();
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl w-full mx-auto">
      {/* Toast alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl border text-sm font-medium animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4 text-blue-600" />
            <span>Módulo de Inventario</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consulta, busca y gestiona el inventario de productos en tiempo real.
          </p>
        </div>

        {/* User Role Badge & Refresh */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={loading}
            title="Recargar listado"
            className="p-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          </button>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
            {isAdmin ? (
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
            ) : (
              <UserIcon className="w-4 h-4 text-emerald-600" />
            )}
            <span>Rol:</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                isAdmin
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {isAdmin ? "ADMINISTRADOR" : "USUARIO"}
            </span>
          </div>
        </div>
      </div>

      {/* Main DataTable */}
      <DataTable
        products={products}
        isAdmin={isAdmin}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
      />

      {/* View Modal */}
      <ViewProductModal
        product={viewProduct}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />

      {/* Form Modal (Create / Edit) */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={formProduct}
        mode={formMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={deleteProduct?.name || ""}
      />
    </div>
  );
}
