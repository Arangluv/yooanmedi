const OrderListTable = () => {
  return (
    <div className="mt-8 flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">주문내역</span>
        {/* <OrderListExportButton data={data as OrderListType[]} /> */}
      </div>
      <table>
        <thead>
          <tr className="text-foreground-700 bg-neutral-100 text-sm font-normal">
            <th className="py-2">번호</th>
            <th>주문일시</th>
            <th>제조사</th>
            <th>상품명</th>
            <th>가격</th>
            <th>주문수량</th>
            <th>총 금액</th>
            <th>주문상태</th>
            <th>주문취소</th>
          </tr>
        </thead>
        <tbody>
          {/* {data && data.length > 0 ? <ListBodySection data={data} /> : <ListEmptyBody />} */}
        </tbody>
      </table>
    </div>
  );
};

export default OrderListTable;
