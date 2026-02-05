'use client';

import { useState } from 'react';

import DeliveryInfo from './DeliveryInfo';
import DeliveryRequest from './DeliveryRequest';
import OrderList from './OrderList';
import PaymentsAction from './PaymentsAction';

const PaymentsOverview = () => {
  const [userRequest, setUserRequest] = useState<string>('');

  return (
    <div className="mt-6 flex min-h-[calc(100vh-469px)] gap-8">
      <div className="flex w-[60%] flex-col gap-12">
        <DeliveryInfo />
        <DeliveryRequest userRequest={userRequest} setUserRequest={setUserRequest} />
        <OrderList />
      </div>
      <div className="w-[40%]">
        <PaymentsAction userRequest={userRequest} />
      </div>
    </div>
  );
};

export default PaymentsOverview;
