import clsx from 'clsx';

type DetailDefaultRowProps = {
  label: string;
  value: string;
  variant?: 'brand' | 'danger' | 'default';
  isAccent?: boolean;
};

const DetailDefaultRow = ({
  label,
  value,
  variant = 'default',
  isAccent = false,
}: DetailDefaultRowProps) => {
  if (!value) {
    return null;
  }

  let accentColor = '';
  switch (variant) {
    case 'brand':
      accentColor = 'text-brandWeek';
      break;
    case 'danger':
      accentColor = 'text-danger';
      break;
    default:
      accentColor = 'text-foreground-600';
      break;
  }

  const fontWeight = isAccent ? 'font-bold' : '';

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{label}</span>
      <span className={clsx(accentColor, fontWeight)}>{value}</span>
    </div>
  );
};

export default DetailDefaultRow;
