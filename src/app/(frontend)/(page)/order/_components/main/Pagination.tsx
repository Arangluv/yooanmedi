'use client'

import { Pagination } from '@heroui/react'

export default function ProductListPagination() {
  return (
    <div className="w-full flex justify-center">
      <Pagination
        total={10}
        showControls
        page={1}
        onChange={(page) => console.log(page)}
        className="cursor-pointer"
      />
    </div>
  )
}
