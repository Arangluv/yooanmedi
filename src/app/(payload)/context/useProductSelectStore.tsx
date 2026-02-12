import { create } from 'zustand';
import type { Product } from '@collections/components/common/Columns';

// Columns에서 사용하는 Product type에 custom_price 필드를 추가한 타입
export type SelectedProduct = Product & {
  custom_price: number;
};

type ProductSelectListState = {
  products: Map<number, SelectedProduct>;
  addProduct: (newProduct: Product) => void;
  addAllRowsProducts: (newProducts: Product[]) => void;
  removeProduct: (removeProduct: Product) => void;
  removeAllRowsProducts: (removeProducts: Product[]) => void;
  updateProductPrice: ({ id, price }: { id: number; price: number }) => void;
  clearProducts: () => void;
};

const useProductSelectList = create<ProductSelectListState>((set, get) => ({
  products: new Map<number, SelectedProduct>(),
  addProduct: (newProduct: Product) => {
    set((state) => {
      // 참조 값을 변경해야하기에 새로운 Map을 만들어줘야한다.
      const newMap = new Map(state.products);
      newMap.set(newProduct.id, { ...newProduct, custom_price: 0 });

      return {
        products: newMap,
      };
    });
  },
  addAllRowsProducts: (newProducts: Product[]) =>
    set((state) => {
      // 체크한 새로운 제품은 newProduct 근데 existingProducts에 있는 제품은 추가하지 않는다.
      const newMap = new Map(state.products);

      newProducts.forEach((product) => {
        if (!newMap.has(product.id)) {
          newMap.set(product.id, { ...product, custom_price: 0 });
        }
      });

      return { products: newMap };
    }),
  removeProduct: (removeProduct: Product) =>
    set((state) => {
      const newMap = new Map(state.products);
      newMap.delete(removeProduct.id);

      return {
        products: newMap,
      };
    }),
  removeAllRowsProducts: (removeProducts: Product[]) =>
    set((state) => {
      const newMap = new Map(state.products);
      removeProducts.forEach((product) => {
        newMap.delete(product.id);
      });

      return {
        products: newMap,
      };
    }),
  updateProductPrice: ({ id, price }: { id: number; price: number }) =>
    set((state) => {
      const targetProduct = state.products.get(id);

      if (!targetProduct) {
        throw new Error(`Product with id ${id} not found`);
      }

      targetProduct.custom_price = price;
      state.products.set(id, targetProduct);

      return {
        products: state.products,
      };
    }),
  clearProducts: () => set((state) => ({ products: new Map<number, SelectedProduct>() })),
}));

export default useProductSelectList;
