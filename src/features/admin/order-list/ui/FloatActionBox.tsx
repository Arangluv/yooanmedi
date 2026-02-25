import { Button } from '@/shared/ui/shadcn/button';

const FloatActionBox = () => {
  return (
    <div className="fixed right-1/2 bottom-12 z-50 translate-x-1/2">
      <div className="bg-foreground flex items-center gap-4 rounded-xl p-4">
        <Button className="bg-secondary rounded-xl px-4 py-6">
          <span className="text-secondary-foreground text-lg font-normal">주문처리</span>
        </Button>
        <Button variant="ghost" className="bg-muted rounded-xl px-4 py-6">
          <span className="text-muted-foreground text-lg font-normal">취소처리</span>
        </Button>
      </div>
    </div>
  );
};

export default FloatActionBox;
