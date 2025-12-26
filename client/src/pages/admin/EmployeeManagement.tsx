import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { User } from "../../data/types";
import {
  Loader2,
  Search,
  Mail,
  ToggleLeft,
  ToggleRight,
  UserPlus,
} from "lucide-react";

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees();
        setEmployees(data);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const updated = await apiService.toggleEmployeeStatus(id);
      setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
    } catch {
      alert("Update failed");
    }
  };

  const filtered = employees.filter(
    (e) =>
      (e.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-600 font-bold">Accessing Directory...</p>
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-slate-600 font-medium">
            Manage user access and platform permissions.
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-600 transition-all flex items-center active:scale-95">
          <UserPlus className="w-5 h-5 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="glass rounded-3xl p-6 border border-slate-100 bg-white shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="glass rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all relative flex flex-col bg-white"
          >
            <div
              className={`absolute top-0 right-0 h-1 w-24 rounded-bl-lg ${
                emp.isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl font-black text-indigo-600 shadow-sm">
                {emp.fullName?.charAt(0) ?? ""}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-black text-slate-900 text-lg truncate">
                  {emp.fullName ?? ""}
                </h4>
                <div className="text-xs text-slate-500 flex items-center font-bold">
                  <Mail className="w-3 h-3 mr-1 text-slate-400" />
                  <span className="truncate">{emp.email ?? ""}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                  Account Status
                </p>
                <span
                  className={`text-xs font-black ${
                    emp.isActive ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {emp.isActive ? "Access Active" : "Access Restricted"}
                </span>
              </div>
              <button
                onClick={() => toggleStatus(emp.id)}
                className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center transition-all ${
                  emp.isActive
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                }`}
              >
                {emp.isActive ? (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2" />
                    Activate
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-3xl border border-dashed border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-bold text-lg">
              No members found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
