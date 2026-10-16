import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">404 error</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">Page not found</h1>
      <p className="mt-4 text-slate-500">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
    </div>
  );
}
