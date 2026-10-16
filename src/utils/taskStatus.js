import { CircleCheck, CircleDashed, LoaderCircle } from "lucide-react";

// Must match the enum in the backend Task model: ["todo", "in-progress", "done"]
export const STATUSES = [
  {
    value: "todo",
    label: "To do",
    icon: CircleDashed,
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
    accent: "text-slate-500 bg-slate-100",
  },
  {
    value: "in-progress",
    label: "In progress",
    icon: LoaderCircle,
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    accent: "text-amber-600 bg-amber-50",
  },
  {
    value: "done",
    label: "Done",
    icon: CircleCheck,
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    accent: "text-emerald-600 bg-emerald-50",
  },
];

export const getStatus = (value) => STATUSES.find((s) => s.value === value) || STATUSES[0];
