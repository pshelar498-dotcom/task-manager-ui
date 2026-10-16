import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      toast.success(`Welcome back, ${user.name}!`);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your tasks."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Alert>{error}</Alert>

        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          id="password"
          label="Password"
          autoComplete="current-password"
          value={form.password}
          onChange={update("password")}
          placeholder="••••••••"
          required
        />

        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  );
}
