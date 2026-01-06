'use client'

import { useEffect, useState } from 'react'
import { X, MonitorUp } from 'lucide-react'
import * as xlsx from 'xlsx'
import { registerProduct } from '@collections/actions'
import { useMutation } from '@tanstack/react-query'
import Loading from '../common/Loading'

export default function ProductListTest() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex">
      <button
        className="bg-[#257449] text-white px-4 py-2 rounded-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        엑셀 대량 업로드
      </button>
      <ExcelUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

function ExcelUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [dtoData, setDtoData] = useState<any[]>([])

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer
        if (arrayBuffer) {
          const workbook = xlsx.read(arrayBuffer, { type: 'array' })

          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]

          const jsonData = xlsx.utils.sheet_to_json(worksheet)
          const trimmedJsonData = jsonData.slice(0, -2)
          const dto = trimmedJsonData.map((item: any) => {
            return {
              specification: item['규격'],
              name: item['제품출력명'],
              insurance_code: item['보험코드'],
              manufacturer: item['제조사'],
              price: item['보험금액'],
            }
          })

          setDtoData(dto)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }, [file])

  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50"
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div
        className="w-1/2 min-h-[600px] bg-white rounded-lg p-8 flex flex-col gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="w-full flex items-center justify-between">
          <span className="text-black font-bold text-2xl">엑셀 대량 업로드</span>
          <button className="bg-transparent" onClick={() => onClose()}>
            <X className="w-5 h-5 text-black/60 cursor-pointer hover:text-black transition-all duration-300" />
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
  )
}

function FileUploadForm({ setFile }: { setFile: (file: File) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  return (
    <form>
      <label
        htmlFor="excelFile"
        className="w-full h-[300px] bg-neutral-50 rounded-md flex flex-col items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-neutral-200"
      >
        <MonitorUp className="w-10 h-10 text-black/60" />
        <span className="text-black font-medium">엑셀 파일 업로드</span>
      </label>
      <input
        type="file"
        id="excelFile"
        className="hidden"
        accept=".xlsx, .xls"
        onChange={(e) => handleFileChange(e)}
      />
    </form>
  )
}

function ProductList({ dtoData, onClose }: { dtoData: any[]; onClose: () => void }) {
  const { mutate: registerProductMutation, isPending } = useMutation({
    mutationFn: () => registerProduct(dtoData),
    onSuccess: () => {
      alert('제품 대량등록이 완료되었습니다.')
      onClose()
    },
    onError: () => {
      alert('제품을 등록하는데 문제가 발생했습니다')
    },
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full h-full overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        <table className="w-full">
          <thead>
            <tr className="text-[14px] text-black/70 bg-neutral-100">
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
              <tr className="text-[14px] text-black/70 border-1 border-foreground-200" key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center ">{item.name}</td>
                <td className="text-center ">{item.insurance_code}</td>
                <td className="text-center">{item.manufacturer}</td>
                <td className="text-center">{item.price.toLocaleString()}</td>
                <td className="text-center">{item.specification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="bg-brand text-white py-4 rounded-md cursor-pointer"
        onClick={() => {
          registerProductMutation()
        }}
      >
        <span></span>
        제품 등록
      </button>
      {isPending && <Loading />}
    </div>
  )
}
