import { useCallback, useEffect, useMemo, useState } from "react";
import { Inbox, Plus, RefreshCw, SearchX } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import * as taskApi from "../api/taskApi";
import { getErrorMessage } from "../api/axios";
import { getStatus } from "../utils/taskStatus";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Alert from "../components/common/Alert";
import TaskStats from "../components/tasks/TaskStats";
import TaskFilter from "../components/tasks/TaskFilter";
import TaskCard, { TaskCardSkeleton } from "../components/tasks/TaskCard";
import TaskForm from "../components/tasks/TaskForm";

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const sorters = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  // Tasks without a due date go last
  due: (a, b) => (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity),
  title: (a, b) => a.title.localeCompare(b.title),
};

export default function DashboardPage() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setTasks(await taskApi.getTasks());
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // All filtering and sorting happens in the browser, so the stats always show every task
  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks
      .filter((task) => statusFilter === "all" || task.status === statusFilter)
      .filter(
        (task) =>
          !term ||
          task.title.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term)
      )
      .sort(sorters[sort]);
  }, [tasks, statusFilter, search, sort]);

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const closeForm = useCallback(() => {
    if (!saving) setFormOpen(false);
  }, [saving]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editingTask) {
        const updated = await taskApi.updateTask(editingTask._id, data);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
        toast.success("Task updated");
      } else {
        const created = await taskApi.createTask(data);
        setTasks((current) => [created, ...current]);
        toast.success("Task created");
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  // Optimistic update: change the card right away, undo it if the API fails
  const handleStatusChange = async (task, status) => {
    const previous = tasks;
    setTasks((current) => current.map((t) => (t._id === task._id ? { ...t, status } : t)));
    try {
      const updated = await taskApi.updateTask(task._id, { status });
      setTasks((current) => current.map((t) => (t._id === updated._id ? updated : t)));
      toast.success(`Moved to "${getStatus(status).label}"`);
    } catch (err) {
      setTasks(previous);
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskApi.deleteTask(taskToDelete._id);
      setTasks((current) => current.filter((task) => task._id !== taskToDelete._id));
      toast.success("Task deleted");
      setTaskToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = useCallback(() => {
    if (!deleting) setTaskToDelete(null);
  }, [deleting]);

  const pendingCount = tasks.filter((task) => task.status !== "done").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {greeting()}, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-slate-500">
            {loading
              ? "Loading your tasks..."
              : pendingCount === 0
                ? "You're all caught up."
                : `You have ${pendingCount} unfinished ${pendingCount === 1 ? "task" : "tasks"}.`}
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New task
        </Button>
      </div>

      <TaskStats tasks={tasks} activeStatus={statusFilter} onSelect={setStatusFilter} />

      <TaskFilter search={search} onSearchChange={setSearch} sort={sort} onSortChange={setSort} />

      {/* Task list */}
      {loadError ? (
        <div className="space-y-4">
          <Alert>{loadError}</Alert>
          <Button variant="secondary" onClick={loadTasks}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </div>
      ) : loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No tasks yet"
          message="Create your first task to start tracking your work."
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Create a task
            </Button>
          }
        />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matching tasks"
          message="Try a different search or status filter."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={setTaskToDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Create / edit modal */}
      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingTask ? "Edit task" : "New task"}
        description={editingTask ? "Update the details of this task." : "Add a task to your list."}
      >
        <TaskForm
          key={editingTask?._id || "new"}
          task={editingTask}
          onSubmit={handleSave}
          onCancel={closeForm}
          submitting={saving}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete task?"
        message={`"${taskToDelete?.title}" will be permanently deleted. This can't be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
}
