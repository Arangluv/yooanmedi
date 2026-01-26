'use client';

import { useEffect, useState } from 'react';
import { X, MonitorUp } from 'lucide-react';
import * as xlsx from 'xlsx';
import { registerProduct } from '@collections/actions';
import { useMutation } from '@tanstack/react-query';
import Loading from '../common/Loading';

export default function ProductListTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex">
      <button
        className="cursor-pointer rounded-md bg-[#257449] px-4 py-2 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        엑셀 대량 업로드
      </button>
      <ExcelUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function ExcelUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dtoData, setDtoData] = useState<any[]>([]);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          const workbook = xlsx.read(arrayBuffer, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = xlsx.utils.sheet_to_json(worksheet);
          const trimmedJsonData = jsonData.slice(0, -2);
          const dto = trimmedJsonData.map((item: any) => {
            return {
              specification: item['규격'],
              name: item['제품출력명'],
              insurance_code: item['보험코드'],
              manufacturer: item['제조사'],
              price: item['보험금액'],
            };
          });

          setDtoData(dto);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div
        className="flex min-h-[600px] w-1/2 flex-col gap-8 rounded-lg bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex w-full items-center justify-between">
          <span className="text-2xl font-bold text-black">엑셀 대량 업로드</span>
          <button className="bg-transparent" onClick={() => onClose()}>
            <X className="h-5 w-5 cursor-pointer text-black/60 transition-all duration-300 hover:text-black" />
          </button>
        </div>
        {/* Modal Body */}
        {!file ? (
          <FileUploadForm setFile={setFile} />
        ) : (
          <ProductList dtoData={dtoData} onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function FileUploadForm({ setFile }: { setFile: (file: File) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <form>
      <label
        htmlFor="excelFile"
        className="flex h-[300px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 bg-neutral-50"
      >
        <MonitorUp className="h-10 w-10 text-black/60" />
        <span className="font-medium text-black">엑셀 파일 업로드</span>
      </label>
      <input
        type="file"
        id="excelFile"
        className="hidden"
        accept=".xlsx, .xls"
        onChange={(e) => handleFileChange(e)}
      />
    </form>
  );
}

function ProductList({ dtoData, onClose }: { dtoData: any[]; onClose: () => void }) {
  const { mutate: registerProductMutation, isPending } = useMutation({
    mutationFn: () => registerProduct(dtoData),
    onSuccess: () => {
      alert('제품 대량등록이 완료되었습니다.');
      onClose();
    },
    onError: () => {
      alert('제품을 등록하는데 문제가 발생했습니다');
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 h-full max-h-[400px] w-full overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 text-[14px] text-black/70">
              <th className="border-r-1 border-black/20">번호</th>
              <th className="border-r-1 border-black/20">제품명</th>
              <th className="border-r-1 border-black/20">보험코드</th>
              <th className="border-r-1 border-black/20">제조사명</th>
              <th className="border-r-1 border-black/20">가격</th>
              <th>규격</th>
            </tr>
          </thead>
          <tbody>
            {dtoData.map((item, index) => (
              <tr className="border-foreground-200 border-1 text-[14px] text-black/70" key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">{item.name}</td>
                <td className="text-center">{item.insurance_code}</td>
                <td className="text-center">{item.manufacturer}</td>
                <td className="text-center">{item.price.toLocaleString()}</td>
                <td className="text-center">{item.specification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="bg-brand cursor-pointer rounded-md py-4 text-white"
        onClick={() => {
          registerProductMutation();
        }}
      >
        <span></span>
        제품 등록
      </button>
      {isPending && <Loading />}
    </div>
  );
}
