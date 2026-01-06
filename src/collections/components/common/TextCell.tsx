export default function TextCell(props: any) {
  const { cellData, rowData } = props

  if (rowData.role === 'admin') {
    return <span>-</span>
  }

  return <span>{cellData ? '승인' : '승인대기'}</span>
}
