const CartToast = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold">알림</span>
      <span className="text-[15px] font-normal">{message}</span>
    </div>
  );
};

export default CartToast;
