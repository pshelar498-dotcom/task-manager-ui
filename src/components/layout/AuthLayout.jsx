import { CircleCheck, ListTodo } from "lucide-react";

const FEATURES = [
  "Organise tasks by status: To do, In progress and Done",
  "Track due dates and spot overdue work at a glance",
  "Your tasks are private, secured with JWT login",
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen">
      {/* Left: brand panel (hidden on small screens) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <ListTodo className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">TaskFlow</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Get things done, one task at a time.</h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-indigo-100">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-indigo-200">Task Manager API · React UI</p>
      </div>

      {/* Right: form */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ListTodo className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-slate-900">TaskFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}

          <div className="mt-8">{children}</div>

          {footer && <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>}
        </div>
      </div>
    </div>
  );
}
