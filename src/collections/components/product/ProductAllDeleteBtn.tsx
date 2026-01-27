'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteAllProducts } from '@collections/actions';
import Loading from '../common/Loading';
import { useRouter } from 'next/navigation';

export default function ProductAllDeleteBtn() {
  const router = useRouter();
  const { mutate: deleteAllProductsMutation, isPending } = useMutation({
    mutationFn: deleteAllProducts,
    onSuccess: () => {
      alert('제품을 전체 삭제했습니다.');
      router.refresh();
    },
    onError: () => {},
  });

  const handleAllDelete = () => {
    const ok = confirm(
      '제품을 전체 삭제하시겠습니까? 임시기능이며 이후 해당 기능은 삭제될 예정입니다.',
    );

    if (ok) {
      deleteAllProductsMutation();
    }
  };

  return (
    <>
      <button
        className="cursor-pointer rounded-md bg-red-500 px-4 py-2 text-white"
        onClick={handleAllDelete}
      >
        전체 삭제(임시)
      </button>
      {isPending && <Loading />}
    </>
  );
}
