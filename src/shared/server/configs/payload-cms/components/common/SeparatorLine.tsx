export default function SeparatorLine(props: any) {
  const {
    field: {
      admin: {
        custom: { text, description },
      },
    },
  } = props;

  return (
    <div className="mb-6 flex flex-col gap-2">
      <span className="text-2xl font-bold">{text}</span>
      <p className="text-neutral-400 dark:text-neutral-500">{description}</p>
    </div>
  );
}
