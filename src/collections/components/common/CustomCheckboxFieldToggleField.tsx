'use client';

import { Label, Switch } from '@collections/components/shadcn';
import { useState } from 'react';

import { useField } from '@payloadcms/ui';

export default function CustomCheckboxFieldToggleField({ path }: { path: string }) {
  const { value, setValue } = useField({
    path,
  });
  const [checked, setChecked] = useState(value);

  return (
    <div className="flex cursor-pointer flex-col gap-4">
      <Switch
        id={path}
        className="!h-8 !w-14 px-[1px]"
        checked={checked as boolean}
        onCheckedChange={(checked) => {
          setValue(checked);
          setChecked(checked);
        }}
      />
    </div>
  );
}
