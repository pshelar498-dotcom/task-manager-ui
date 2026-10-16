import { TriangleAlert } from "lucide-react";

export default function Alert({ children }) {
  if (!children) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
