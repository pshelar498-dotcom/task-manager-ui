import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError, FieldLabel, fieldClass } from "./Input";

export default function PasswordInput({ label, error, id, className = "", ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} {...props} className={`${fieldClass(error)} pr-10`} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:text-slate-600"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}
