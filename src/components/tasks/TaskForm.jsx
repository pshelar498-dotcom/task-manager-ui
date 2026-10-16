import { useState } from "react";
import Button from "../common/Button";
import Input, { Select, Textarea } from "../common/Input";
import { STATUSES } from "../../utils/taskStatus";
import { toDateInputValue } from "../../utils/formatDate";

export default function TaskForm({ task, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    dueDate: toDateInputValue(task?.dueDate),
  });
  const [error, setError] = useState("");

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      // Only send a due date when one is picked
      ...(form.dueDate && { dueDate: form.dueDate }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input
        id="title"
        label="Title"
        value={form.title}
        onChange={update("title")}
        placeholder="e.g. Write API documentation"
        error={error}
        autoFocus
      />

      <Textarea
        id="description"
        label="Description"
        value={form.description}
        onChange={update("description")}
        placeholder="Add more details (optional)"
        rows={3}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select id="status" label="Status" value={form.status} onChange={update("status")}>
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </Select>

        <Input id="dueDate" label="Due date" type="date" value={form.dueDate} onChange={update("dueDate")} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {task ? "Save changes" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
