export default function ArrayLabel(props: any) {
  const { rowNumber, field } = props

  return (
    <div>
      <span className="bg-green-700 text-white px-2 py-1 rounded-full">
        {/* @ts-ignore */}
        {field.label} ({rowNumber ?? 1})
      </span>
    </div>
  )
}
