'use client';

import React, { useState } from 'react';

type FormState = 'inputInfo' | 'complete';

export const FindIdFunnel = ({ children }: { children: React.ReactNode }) => {
  const [formState, setFormState] = useState<FormState>('inputInfo');

  return <div className="w-full">{children}</div>;
};

function Step({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

FindIdFunnel.Step = Step;
