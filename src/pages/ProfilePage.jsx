import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck, Trash2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import * as userApi from "../api/userApi";
import * as authApi from "../api/authApi";
import { getErrorMessage } from "../api/axios";
import { formatDate } from "../utils/formatDate";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import ConfirmDialog from "../components/common/ConfirmDialog";

function Card({ icon: Icon, title, description, children, tone = "default" }) {
  return (
    <section
      className={`rounded-2xl bg-white shadow-sm ring-1 ${tone === "danger" ? "ring-red-200" : "ring-slate-200"}`}
    >
      <div className="flex items-start gap-3 border-b border-slate-100 px-6 py-4">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            ${tone === "danger" ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"}`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function ProfileForm() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [saving, setSaving] = useState(false);

  const unchanged = form.name.trim() === user.name && form.email.trim() === user.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      const updated = await userApi.updateMe({ name: form.name.trim(), email: form.email.trim() });
      updateUser(updated);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Full name"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <div className="flex justify-end">
        <Button type="submit" loading={saving} disabled={unchanged}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

function PasswordForm() {
  const { updateToken } = useAuth();
  const empty = { currentPassword: "", newPassword: "", confirmPassword: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.currentPassword) nextErrors.currentPassword = "Enter your current password";
    if (form.newPassword.length < 6) nextErrors.newPassword = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.newPassword) nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const { token } = await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      updateToken(token);
      setForm(empty);
      toast.success("Password changed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <PasswordInput
        id="currentPassword"
        label="Current password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={update("currentPassword")}
        error={errors.currentPassword}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordInput
          id="newPassword"
          label="New password"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={update("newPassword")}
          error={errors.newPassword}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          error={errors.confirmPassword}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          Update password
        </Button>
      </div>
    </form>
  );
}

export default function ProfilePage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await userApi.deleteMe();
      logout();
      toast.success("Your account has been deleted");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setDeleting(false);
    }
  };

  const closeConfirm = useCallback(() => {
    if (!deleting) setConfirmOpen(false);
  }, [deleting]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold text-slate-900">{user.name}</h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <p className="truncate text-sm text-slate-500">{user.email}</p>
          {user.createdAt && (
            <p className="mt-1 text-xs text-slate-400">Member since {formatDate(user.createdAt)}</p>
          )}
        </div>
      </div>

      <Card icon={UserRound} title="Profile details" description="Update your name and email address.">
        <ProfileForm />
      </Card>

      <Card icon={KeyRound} title="Change password" description="Use at least 6 characters.">
        <PasswordForm />
      </Card>

      <Card
        icon={Trash2}
        title="Delete account"
        description="Permanently delete your account and all of your tasks."
        tone="danger"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">This action can&apos;t be undone.</p>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete my account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete your account?"
        message="Your account and all of your tasks will be permanently deleted. You will be logged out."
        confirmLabel="Delete account"
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={closeConfirm}
      />
    </div>
  );
}
