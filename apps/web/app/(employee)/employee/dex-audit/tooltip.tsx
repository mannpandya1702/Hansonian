export default function Tooltip({
  children,
  content,
}: {
  children: React.ReactNode;
  content: string;
}) {
  return (
    <span className="relative group cursor-help">
      {children}
      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {content}
      </span>
    </span>
  );
}
