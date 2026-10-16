import { ClipboardList } from "lucide-react";
import { STATUSES } from "../../utils/taskStatus";

// Summary cards. Clicking a card filters the task list by that status.
export default function TaskStats({ tasks, activeStatus, onSelect }) {
  const cards = [
    {
      value: "all",
      label: "All tasks",
      icon: ClipboardList,
      accent: "text-indigo-600 bg-indigo-50",
      count: tasks.length,
    },
    ...STATUSES.map((status) => ({
      ...status,
      count: tasks.filter((task) => task.status === status.value).length,
    })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {cards.map(({ value, label, icon: Icon, accent, count }) => {
        const active = activeStatus === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            aria-pressed={active}
            className={`flex items-center gap-4 rounded-xl bg-white p-4 text-left shadow-sm ring-1 transition
              hover:shadow-md ${active ? "ring-2 ring-indigo-500" : "ring-slate-200"}`}
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accent}`}>
              <Icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-2xl font-bold text-slate-900">{count}</span>
              <span className="block text-sm text-slate-500">{label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
