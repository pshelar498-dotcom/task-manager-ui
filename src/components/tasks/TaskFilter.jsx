import { Search } from "lucide-react";
import { fieldClass } from "../common/Input";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "due", label: "Due date" },
  { value: "title", label: "Title (A–Z)" },
];

export default function TaskFilter({ search, onSearchChange, sort, onSortChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className={`${fieldClass()} pl-9`}
        />
      </div>
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        aria-label="Sort tasks"
        className={`${fieldClass()} sm:w-48`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
