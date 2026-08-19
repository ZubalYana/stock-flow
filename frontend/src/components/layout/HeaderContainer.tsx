import Logo from "./Logo";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { useState } from "react";
import { useWebSocketStore } from "../../store/websocketStore";


const TABS = [
  { key: "goods", label: "Goods", path: "/goods" },
  { key: "warehouses", label: "Warehouses", path: "/warehouses" },
] as const;

export default function HeaderContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showList, setShowList] = useState(false);

  const activeIndex = TABS.findIndex((tab) => location.pathname.startsWith(tab.path));
  const operators = useWebSocketStore((s) => s.operators);

  return (
    <div className="w-full mb-4">
      <div className="h-15 w-full flex items-center justify-between">
        <Logo />

        <div className="relative w-75 h-11 flex items-center bg-white rounded-xl shadow-sm p-1">
          <div
            className="absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-8px)] rounded-lg bg-slate-900 transition-transform duration-300 ease-out"
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

        <div className="relative">
          <div
            className="w-50 h-10 px-3 flex items-center gap-2 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={() => setShowList((prev) => !prev)}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-sm text-slate-600">
              {operators.length} operator{operators.length !== 1 ? "s" : ""} online
            </span>
            <UserCircle2 className="ml-auto text-slate-400" size={20} />
          </div>

          {showList && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-md p-2 z-20">
              {operators.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-1">No operators connected.</p>
              ) : (
                operators.map((op) => (
                  <div key={op.id} className="flex items-center gap-2 px-2 py-1.5 text-sm text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {op.email}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}