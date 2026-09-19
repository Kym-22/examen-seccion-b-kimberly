"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Product } from "@/entities/product.entity";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CarouselProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
  products,
  onSelectProduct,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    if (products.length === 0) return;

    setCurrentIndex(
      (previous) => (previous + 1) % products.length
    );
  }, [products.length]);

  const previousSlide = useCallback(() => {
    if (products.length === 0) return;

    setCurrentIndex(
      (previous) =>
        (previous - 1 + products.length) % products.length
    );
  }, [products.length]);

  useEffect(() => {
    if (isHovered || products.length <= 1) return;

    const interval = setInterval(nextSlide, 4500);

    return () => clearInterval(interval);
  }, [isHovered, nextSlide, products.length]);

  if (!products || products.length === 0) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-800 shadow-lg">
        <Sparkles className="mb-3 h-12 w-12 animate-pulse text-amber-500" />

        <p className="text-base font-semibold">
          Cargando catálogo de productos...
        </p>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-[2rem] border border-emerald-700/60 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950 text-white shadow-2xl shadow-emerald-950/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Elementos decorativos */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-400/25 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/80 to-transparent" />

      {/* Contenido */}

      <div className="relative grid min-h-[420px] grid-cols-1 items-center gap-8 p-6 sm:min-h-[460px] sm:p-10 lg:grid-cols-12">
        {/* Información */}

        <div className="z-10 flex flex-col justify-center space-y-5 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200 backdrop-blur-sm">
              <Tag className="h-3.5 w-3.5" />
              {currentProduct.category}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                currentProduct.inStock
                  ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-200"
                  : "border-rose-300/40 bg-rose-400/15 text-rose-200"
              }`}
            >
              {currentProduct.inStock ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  {currentProduct.stock} disponibles
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Agotado
                </>
              )}
            </span>
          </div>

          <h3 className="line-clamp-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
            {currentProduct.name}
          </h3>

          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-amber-300 to-amber-600" />

          <p className="line-clamp-3 text-sm leading-relaxed text-emerald-50/80 sm:text-base">
            {currentProduct.description}
          </p>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
              {currentProduct.formattedPrice}
            </span>

            <span className="text-xs font-medium uppercase tracking-widest text-emerald-200/70">
              Precio sugerido
            </span>
          </div>

          {onSelectProduct && (
            <div className="pt-2">
              <button
                onClick={() =>
                  onSelectProduct(currentProduct)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-950/30 transition-all hover:scale-[1.03] hover:from-amber-400 hover:to-orange-500 active:scale-[0.98]"
              >
                Ver detalle del producto
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Imagen */}

        <div className="relative flex items-center justify-center lg:col-span-6">
          <div className="group relative h-64 w-full max-w-md overflow-hidden rounded-3xl border-4 border-amber-300/20 bg-white/10 shadow-2xl sm:h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentProduct.imageUrl}
              alt={currentProduct.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              onError={(event) => {
                (
                  event.target as HTMLImageElement
                ).src =
                  "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80";
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-amber-300/10" />

            <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-emerald-950/70 px-3 py-1 text-xs font-semibold text-amber-100 backdrop-blur-md">
              Producto destacado
            </div>
          </div>
        </div>
      </div>

      {/* Navegación */}

      <button
        onClick={previousSlide}
        aria-label="Producto anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-amber-300/30 bg-emerald-950/70 p-2.5 text-amber-200 backdrop-blur-md transition-all hover:scale-110 hover:bg-amber-500 hover:text-white active:scale-95"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Siguiente producto"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-amber-300/30 bg-emerald-950/70 p-2.5 text-amber-200 backdrop-blur-md transition-all hover:scale-110 hover:bg-amber-500 hover:text-white active:scale-95"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicadores */}

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-emerald-950/50 px-3 py-2 backdrop-blur-md">
        {products.map((product, index) => (
          <button
            key={product.id || index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Ir al producto ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "h-2.5 w-8 bg-amber-400"
                : "h-2.5 w-2.5 bg-white/40 hover:bg-amber-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};