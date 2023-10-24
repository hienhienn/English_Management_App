type Props = {
  text: string;
  bgColor?: string;
  textColor?: string;
};

const Tag = ({ text, bgColor = '#d1d5db', textColor = '#000' }: Props) => {
  return (
    <div
      className="rounded-lg px-2 py-1 text-[14px] w-fit"
      style={{ background: bgColor, color: textColor }}
    >
      {text}
    </div>
  );
};

export default Tag;
