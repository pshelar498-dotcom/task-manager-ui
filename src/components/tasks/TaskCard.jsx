import { CalendarDays, Clock, Pencil, Trash2 } from "lucide-react";
import { STATUSES, getStatus } from "../../utils/taskStatus";
import { formatDate, formatDueDate, isOverdue } from "../../utils/formatDate";

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = getStatus(task.status);
  const overdue = isOverdue(task.dueDate, task.status);
  const done = task.status === "done";

  return (
    <article className="group flex flex-col rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* Status pill: also a quick way to change the status */}
        <label className="relative">
          <span className="sr-only">Change status</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task, event.target.value)}
            className={`cursor-pointer appearance-none rounded-full py-1 pl-3 pr-3 text-xs font-medium ring-1 ring-inset
              focus:outline-none focus:ring-2 focus:ring-indigo-500 ${status.badge}`}
          >
            {STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex gap-1 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3
        className={`mt-3 break-words font-semibold ${done ? "text-slate-400 line-through" : "text-slate-900"}`}
      >
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-1.5 line-clamp-3 break-words text-sm text-slate-600">{task.description}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-xs text-slate-500">
        {task.dueDate ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium
              ${overdue ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"}`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            {overdue ? "Overdue · " : "Due "}
            {formatDueDate(task.dueDate)}
          </span>
        ) : (
          <span className="text-slate-400">No due date</span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(task.createdAt)}
        </span>
      </div>
    </article>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="h-6 w-24 rounded-full bg-slate-200" />
      <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-full rounded bg-slate-100" />
      <div className="mt-1.5 h-3 w-2/3 rounded bg-slate-100" />
      <div className="mt-6 h-6 w-28 rounded bg-slate-100" />
    </div>
  );
}
