import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, ShieldCheck, Trash2, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/userApi";
import { getErrorMessage } from "../api/axios";
import { formatDate } from "../utils/formatDate";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";
import EmptyState from "../components/common/EmptyState";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Spinner from "../components/common/Spinner";
import { fieldClass } from "../components/common/Input";

function RoleBadge({ role }) {
  return role === "admin" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
      <ShieldCheck className="h-3 w-3" /> Admin
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
      User
    </span>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      setUsers(await userApi.getAllUsers());
    } catch (err) {
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
  }, [users, search]);

  const adminCount = users.filter((u) => u.role === "admin").length;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userApi.deleteUser(userToDelete._id);
      setUsers((current) => current.filter((u) => u._id !== userToDelete._id));
      toast.success(`${userToDelete.name} was deleted`);
      setUserToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const closeDelete = useCallback(() => {
    if (!deleting) setUserToDelete(null);
  }, [deleting]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Users</h1>
          <p className="mt-1 text-slate-500">
            {loading ? "Loading users..." : `${users.length} users · ${adminCount} admin${adminCount === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            aria-label="Search users"
            className={`${fieldClass()} pl-9`}
          />
        </div>
      </div>

      {loadError ? (
        <div className="space-y-4">
          <Alert>{loadError}</Alert>
          <Button variant="secondary" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16 text-indigo-600">
          <Spinner className="h-8 w-8" />
        </div>
      ) : visibleUsers.length === 0 ? (
        <EmptyState icon={Users} title="No users found" message="Try a different search." />
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="hidden px-6 py-3 md:table-cell">Joined</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleUsers.map((u) => {
                  const isSelf = u._id === currentUser._id;
                  return (
                    <tr key={u._id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {u.name} {isSelf && <span className="font-normal text-slate-400">(you)</span>}
                            </p>
                            <p className="truncate text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="hidden px-6 py-4 text-slate-500 md:table-cell">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUserToDelete(u)}
                          disabled={isSelf}
                          title={isSelf ? "You can't delete yourself here" : `Delete ${u.name}`}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete user?"
        message={`${userToDelete?.name} (${userToDelete?.email}) and all of their tasks will be permanently deleted.`}
        confirmLabel="Delete user"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={closeDelete}
      />
    </div>
  );
}
