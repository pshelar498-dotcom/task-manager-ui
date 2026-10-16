import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, LayoutDashboard, ListTodo, LogOut, ShieldCheck, UserRound, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";

const navLinkClass = ({ isActive }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition
   ${isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`;

function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu when clicking outside it
  useEffect(() => {
    if (!open) return;
    const onClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar name={user.name} size="sm" />
        <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">
          {user.name}
        </span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-slate-200"
        >
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
            {isAdmin && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
                <ShieldCheck className="h-3 w-3" /> Admin
              </span>
            )}
          </div>
          <div className="p-1.5">
            <Link
              to="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <UserRound className="h-4 w-4" /> Profile
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ListTodo className="h-5 w-5" />
            </span>
            <span className="hidden text-lg font-bold text-slate-900 sm:block">TaskFlow</span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </NavLink>
            )}
          </nav>
        </div>

        <UserMenu />
      </div>
    </header>
  );
}
