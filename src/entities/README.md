## Entity Layer

### 규칙

- 모든 함수는 순수함수여야 합니다.
- 사이드 이펙트가 없어야 합니다.
- 외부와 종속성이 없어야 합니다.
- 자체 스키마를 사용한 데이터 변환에만 집중해야합니다.
- 다양한 도메인 혹은 features에서 재사용이 가능해야 합니다
- 순수 단위 테스트로 테스트가 가능해야 합니다.
- `ui`: 데이터를 통해 순수 프레젠테이션 역할만 담당합니다
- `model`: 순수 함수, 비즈니스 로직 및 타입 정의를 포함합니다.

**ex:**

Good Case✅

```javascript
// entities/product/model/validation.ts
export const isValidProduct = (product: Product): boolean => {
  return product.price > 0 && product.stock >= 0;
};
```

Bad Case😂

```javascript
// entities/product/model/validation.ts
export const updateProductPrice = (product: Product, newPrice: number) => {
  // Impure function -> side effect를 발생시킵니다

  product.price = newPrice;  // Mutation!
  api.updateProduct(product); // Side effect!
};
```

### 엔티티간 종속성이 필요한 경우

상호참조가 필요한 경우 명시적으로 `@x` 폴더를 두어 사용하는 entity에 타입만 노출시킵니다.
