'use client';

import { useState } from 'react';

import type { User } from '@/entities/user/@x/point';

import { normalizePoint } from '../lib/helper';

const useUsedPoint = ({ user }: { user: User }) => {
  const [pointStatus, setPointStatus] = useState({
    usedPoint: 0,
    maxUseablePoint: normalizePoint(user.point),
    isDisableField: false,
  });

  const updatePoint = ({
    usedPoint,
    payablePrice,
  }: {
    usedPoint: number;
    payablePrice: number;
  }) => {
    // CASE 1. 사용 적립금이 0 이하인 경우
    if (usedPoint < 0) {
      setPointStatus({
        ...pointStatus,
        usedPoint: 0,
      });
      return;
    }

    // CASE 2. 사용 적립금이 보유 적립금을 초과하는 경우
    if (usedPoint > normalizePoint(user.point)) {
      setPointStatus({
        ...pointStatus,
        usedPoint: pointStatus.maxUseablePoint,
        maxUseablePoint: pointStatus.maxUseablePoint,
      });
      return;
    }

    // CASE 3. 사용 적립금이 지불금액을 초과하는 경우
    if (usedPoint > payablePrice) {
      setPointStatus({
        ...pointStatus,
        usedPoint: payablePrice,
        maxUseablePoint: pointStatus.maxUseablePoint,
      });
      return;
    }

    setPointStatus({
      ...pointStatus,
      usedPoint,
      maxUseablePoint: pointStatus.maxUseablePoint,
    });
  };

  const updateFieldToMaxUseablePoint = ({ payablePrice }: { payablePrice: number }) => {
    if (pointStatus.maxUseablePoint > payablePrice) {
      setPointStatus({
        ...pointStatus,
        usedPoint: payablePrice,
      });
      return;
    }

    setPointStatus({
      ...pointStatus,
      usedPoint: pointStatus.usedPoint,
    });
  };

  return { pointStatus, updatePoint, updateFieldToMaxUseablePoint };
};

export default useUsedPoint;
