const TextWithIconAlignVertical = ({
  text,
  icon,
  onClick,
}: {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      className="hover:bg-muted flex cursor-pointer flex-col items-center gap-1 rounded-lg p-2"
      onClick={onClick}
    >
      <span className="text-foreground/90">{icon}</span>
      <span className="text-foreground/90 text-[14px]">{text}</span>
    </button>
  );
};

export default TextWithIconAlignVertical;
