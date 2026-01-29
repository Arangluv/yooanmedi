export default function TextCell(props: any) {
  const { cellData, rowData } = props

  if (rowData.role === 'admin') {
    return <span>-</span>
  }

  return (
    <span className="dark:bg-neutral-700 bg-neutral-200 w-fit px-2 py-1 rounded-md dark:text-white text-neutral-800">
      {cellData ? '승인' : '승인대기'}
    </span>
  )
}
