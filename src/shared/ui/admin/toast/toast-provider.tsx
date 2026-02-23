'use client';

import { Toaster } from 'sonner';
import { Check, Info } from 'lucide-react';

const AdminToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster
        toastOptions={{
          duration: 4000,
          classNames: {
            icon: 'bg-muted rounded-full !size-6 !flex !items-center !justify-center',
            error: '!text-red-500',
          },
        }}
        position="bottom-center"
        icons={{
          success: <Check className="size-5 text-green-500" />,
          info: <Info className="text-primary size-4" />,
        }}
      />
      {children}
    </>
  );
};

export default AdminToastProvider;
