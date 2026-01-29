import clsx from 'clsx';

// custom: {
//   check: { color: 'success', text: '승인' },
//   uncheck: { color: 'danger', text: '승인대기' },
//   admin: { color: 'default', text: '-' }
// },

export default function BadgeCell(props: any) {
  const { cellData, rowData, field } = props;
  const { check, uncheck, admin } = field?.custom || {};
  const role = rowData?.role;

  const colorMapper = {
    danger: 'bg-danger-500 text-white',
    success: 'bg-green-100 text-green-600 dark:bg-green-700 dark:text-white',
    info: 'bg-info-500 text-white',
    warning: 'bg-warning-500 text-white',
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-white',
  };

  if (role === 'admin' && admin) {
    return <span className="text-foreground-700 px-2 py-1">{admin.text}</span>;
  }

  let signal = '';
  if (cellData) {
    signal = check.color;
  } else {
    signal = uncheck.color;
  }

  return (
    <span
      className={clsx(
        'w-fit rounded-md px-2 py-1',
        colorMapper[signal as keyof typeof colorMapper] || colorMapper.default,
      )}
    >
      {cellData ? check.text : uncheck.text}
    </span>
  );
}
