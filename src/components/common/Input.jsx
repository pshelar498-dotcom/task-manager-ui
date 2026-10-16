export const fieldClass = (error) =>
  `w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition
   placeholder:text-slate-400 focus:outline-none focus:ring-4
   ${error
     ? "border-red-400 focus:border-red-500 focus:ring-red-100"
     : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"}`;

export function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

export function FieldError({ children }) {
  if (!children) return null;
  return <p className="mt-1.5 text-sm text-red-600">{children}</p>;
}

export default function Input({ label, error, id, className = "", ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <input id={id} {...props} className={fieldClass(error)} />
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function Textarea({ label, error, id, className = "", rows = 4, ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <textarea id={id} rows={rows} {...props} className={`${fieldClass(error)} resize-y`} />
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function Select({ label, error, id, className = "", children, ...props }) {
  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <select id={id} {...props} className={fieldClass(error)}>
        {children}
      </select>
      <FieldError>{error}</FieldError>
    </div>
  );
}
