export default function BadgeCell(props: any) {
  const { cellData, rowData, field } = props;

  console.log('field');
  console.log(field);

  return <span className="rounded-md bg-blue-500 px-2 py-1 text-white">{cellData}</span>;
}
