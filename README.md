### 조건부 렌더링은 다음과 같이 처리합니다.

- 빠른 코드 컨텍스트 파악을 위해 `entity` 혹은 `shared` 레이어 ui 내부에서 조건을 처리하지 않습니다.
- 조건부 렌더링이 필요한 부모 컴포넌트에서 `삼항 연산자`를 통해 처리합니다.
- 조건이 `3개 이상`인 경우 `switch`문을 사용합니다

```javascript
//entities/product/ui

const EmptyRankingProductList = () => {
  return (
    <div className="flex h-[260px] w-full items-center justify-center rounded-lg bg-neutral-50">
      <span className="text-foreground-600">인기상품을 준비중입니다.</span>
    </div>
  );
};
```

```javascript
// page/product/ui
// 혹은 feature/product/ui

function ProductList({ data }: { data: ProductItemType[] }) {
  return (
    <div className="flex w-full flex-col gap-6">
      {data.length > 0 ? (
        <div className="grid grid-cols-4 gap-x-4 gap-y-8">
          {data.map((item) => (
            <ProductItem key={item.id} productItem={item} />
          ))}
        </div>
      ) : (
        <EmptyRankingProductList />
      )}
    </div>
  );
}
```
