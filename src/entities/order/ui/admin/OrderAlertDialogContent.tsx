import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

interface OrderAlertDialogContentProps {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const OrderAlertDialogContent = () => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>10개의 상품을 배송 처리 하시겠습니까?</AlertDialogTitle>
        <AlertDialogDescription className="text-base">
          선택한 주문의 상태가 일괄 변경됩니다
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction>배송 처리</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default OrderAlertDialogContent;
