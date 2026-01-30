import { create } from 'zustand';
import type { Product } from '@collections/components/common/Columns';

// Columns에서 사용하는 Product type에 custom_price 필드를 추가한 타입
type SelectedProduct = Product & {
  custom_price: number;
};

type ProductSelectListState = {
  products: SelectedProduct[];
  addProduct: (newProduct: Product) => void;
  addAllRowsProducts: (newProducts: Product[]) => void;
  removeProduct: (removeProduct: Product) => void;
  removeAllRowsProducts: (removeProducts: Product[]) => void;
  updateProductPrice: ({ id, price }: { id: number; price: number }) => void;
  clearProducts: () => void;
};

const useProductSelectList = create<ProductSelectListState>((set) => ({
  products: [],
  addProduct: (newProduct: Product) =>
    set((state) => ({
      products: [...state.products, { ...newProduct, custom_price: 0 }],
    })),
  addAllRowsProducts: (newProducts: Product[]) =>
    set((state) => {
      // 체크한 새로운 제품은 newProduct 근데 existingProducts에 있는 제품은 추가하지 않는다.
      const addedProducts = newProducts.filter(
        (product) => !state.products.some((p) => p.id === product.id),
      );

      return {
        products: [
          ...state.products,
          ...addedProducts.map((product) => ({ ...product, custom_price: 0 })),
        ],
      };
    }),
  removeProduct: (removeProduct: Product) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== removeProduct.id),
    })),
  removeAllRowsProducts: (removeProducts: Product[]) =>
    set((state) => {
      const removedProductsIdList = removeProducts.map((product) => product.id);
      const filteredProducts = state.products.filter(
        (product) => !removedProductsIdList.includes(product.id),
      );

      return {
        products: filteredProducts,
      };
    }),
  updateProductPrice: ({ id, price }: { id: number; price: number }) =>
    set((state) => {
      const updatedProduct = state.products.map((product) =>
        product.id === id ? { ...product, custom_price: price } : product,
      );

      return {
        products: updatedProduct,
      };
    }),
  clearProducts: () => set({ products: [] }),
}));

export default useProductSelectList;
