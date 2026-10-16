import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import PasswordInput from "../components/common/PasswordInput";
import Button from "../components/common/Button";
import Alert from "../components/common/Alert";

const validate = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = "Enter a valid email";
  if (password.length < 6) errors.password = "Password must be at least 6 characters";
  if (confirmPassword !== password) errors.confirmPassword = "Passwords do not match";
  return errors;
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast.success(`Welcome, ${user.name}! Your account is ready.`);
      navigate("/", { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organising your work in seconds."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{serverError}</Alert>

        <Input
          id="name"
          label="Full name"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
          placeholder="Your name"
          error={errors.name}
        />
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
          error={errors.email}
        />
        <PasswordInput
          id="password"
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={update("password")}
          placeholder="At least 6 characters"
          error={errors.password}
        />
        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update("confirmPassword")}
          placeholder="Repeat your password"
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
