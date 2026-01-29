export default function BestProductCell({ cellData }: { cellData: boolean }) {
  return <span>{cellData ? 'O' : 'X'}</span>
}
