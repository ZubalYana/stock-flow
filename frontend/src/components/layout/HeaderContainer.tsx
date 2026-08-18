import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle2 } from "lucide-react";

const TABS = [
  { key: "goods", label: "Goods", path: "/goods" },
  { key: "warehouses", label: "Warehouses", path: "/warehouses" },
] as const;

export default function HeaderContainer() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));

  return (
    <div className="w-full mb-4">
      <div className="h-15 w-full flex items-center justify-between">
        <Logo />

        <div className="relative w-75 h-11 flex items-center bg-white rounded-xl shadow-sm p-1">
          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg bg-slate-900 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${activeIndex === 1 ? "calc(100% + 8px)" : "0px"})`,
            }}
          />
          {TABS.map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => navigate(tab.path)}
              className={`relative cursor-pointer z-10 flex-1 h-full text-sm font-medium rounded-lg transition-colors duration-300 ${
                activeIndex === i ? "text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-50 h-10 px-3 flex items-center gap-2 bg-white rounded-lg shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-sm text-slate-600">X operators online</span>
          <UserCircle2 className="ml-auto text-slate-400" size={20} />
        </div>
      </div>
    </div>
  );
}