import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import Avatar from "../../components/Avatar";
import { User } from "../../data/types";
import {
  Loader2,
  Search,
  Filter,
  Mail,
  ToggleLeft,
  ToggleRight,
  UserPlus,
} from "lucide-react";

const AdminEmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees(); // backend Employee[]
        const mapped = data.map((e: any) => ({
          id: e.id,
          fullName: e.name,        // map name -> fullName
          email: e.email,
          isActive: e.active,      // map active -> isActive
          role: e.role,
        })) as User[];
        setEmployees(mapped);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const updated = await apiService.toggleEmployeeStatus(id); // Employee
      const mapped = {
        id: updated.id,
        fullName: updated.name,
        email: updated.email,
        isActive: updated.active,
        role: updated.role,
      } as User;

      setEmployees((employees) =>
        employees.map((e) => (e.id === id ? mapped : e))
      );
    } catch (e) {
      alert("Status update failed");
    }
  };

  const filtered = employees.filter(
    (e) =>
      (e.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Employee Directory
          </h2>
          <p className="text-slate-500 mt-1">
            Manage user access and platform permissions.
          </p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center">
          <UserPlus className="w-5 h-5 mr-2" />
          Invite Member
        </button>
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-6 border flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 border-slate-200 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Active Only
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="glass rounded-3xl p-8 border hover:shadow-lg transition-all relative overflow-hidden group"
          >
            {/* Status Indicator */}
            <div
              className={`absolute top-0 right-0 h-1 w-24 ${
                emp.isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            />

            <div className="flex items-center space-x-4 mb-6">
              <Avatar
                name={emp.fullName ?? (emp as any).full_name}
                src={
                  (emp as any).avatar_url ??
                  (emp as any).avatarUrl ??
                  null
                }
                size="lg"
                className="rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600"
              />
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {emp.fullName ?? ""}
                </h4>
                <div className="flex items-center text-xs text-slate-400 mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {emp.email ?? ""}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Status
                </p>
                <span
                  className={`text-xs font-bold ${
                    emp.isActive ? "text-emerald-600" : "text-slate-500"
                  }`}
                >
                  {emp.isActive ? "Access Granted" : "Deactivated"}
                </span>
              </div>
              <button
                onClick={() => toggleStatus(emp.id)}
                className={`flex items-center px-4 py-2 rounded-xl transition-all font-bold text-xs ${
                  emp.isActive
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
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
      </div>
    </div>
  );
};

export default AdminEmployeeManagement;
