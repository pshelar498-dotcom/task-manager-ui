const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
};

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

export default function Avatar({ name, size = "md" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br
        from-indigo-500 to-violet-500 font-semibold text-white ${SIZES[size]}`}
    >
      {initials(name)}
    </span>
  );
}
