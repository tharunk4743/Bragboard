import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { Shoutout, User } from "../../data/types";
import { Loader2 } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();

  const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ---------- LOAD DATA ----------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sData, eData] = await Promise.all([
          apiService.getShoutouts(),
          apiService.getEmployees(),
        ]);

        setShoutouts(sData);

        const mappedEmployees = (eData || []).map((e: any) => ({
          id: e.id,
          fullName: e.name,
          email: e.email,
          isActive: e.active,
          role: e.role,
        })) as User[];

        setEmployees(mappedEmployees);
      } catch (err) {
        console.error("Admin dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ---------- DERIVED STATS ----------
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.isActive).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  // ---------- FORM HELPERS ----------
  const openCreate = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setSelectedRecipients([]);
    setShowForm(true);
  };

  const openEdit = (s: Shoutout) => {
    setEditingId(s.id);
    setFormTitle(s.title);
    setFormDesc(s.description);
    setSelectedRecipients(s.recipientIds || []);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setSelectedRecipients([]);
  };

  // no backend AI yet – avoid TS error
  const handleGenerateAI = async () => {
    if (!formTitle) {
      alert("Enter a title or context first!");
      return;
    }
    setIsGenerating(true);
    try {
      alert("AI assist is not connected to backend yet.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ---------- SUBMIT SHOUTOUT ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRecipients.length) {
      alert("Select at least one recipient!");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await apiService.updateShoutout(editingId, {
          title: formTitle,
          content: formDesc,
          recipient_ids: selectedRecipients,
        });
      } else {
        await apiService.createShoutout({
          title: formTitle,
          content: formDesc,
          author_id: authState.user!.id,
          recipient_ids: selectedRecipients,
        });
      }

      const updated = await apiService.getShoutouts();
      setShoutouts(updated);
      closeForm();
    } catch (err) {
      console.error("Submit shoutout error", err);
      alert("Failed to save shoutout. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this shoutout? This cannot be undone.")) return;
    try {
      await apiService.deleteShoutout(id);
      setShoutouts((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete shoutout error", err);
      alert("Failed to delete.");
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={openCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
        >
          + New Shoutout
        </button>
      </div>

      {/* EMPLOYEE STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-500 uppercase font-semibold">
            Total employees
          </p>
          <p className="mt-1 text-2xl font-bold">{totalEmployees}</p>
        </div>
        <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-emerald-500 uppercase font-semibold">
            Active employees
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {activeEmployees}
          </p>
        </div>
        <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
          <p className="text-xs text-amber-500 uppercase font-semibold">
            Inactive employees
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {inactiveEmployees}
          </p>
        </div>
      </div>

      {/* SHOUTOUTS TABLE */}
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Recipients</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shoutouts.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{s.title}</td>
                <td className="px-4 py-3 max-w-xs truncate">
                  {s.description}
                </td>
                <td className="px-4 py-3">
                  {(s.recipients || []).map((r) => r.fullName).join(", ")}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="px-3 py-1 text-xs rounded border border-slate-300 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 text-xs rounded border border-red-400 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {shoutouts.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No shoutouts yet. Create the first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Shoutout" : "Create Shoutout"}
              </h2>
              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. Great teamwork on Q4 release"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGenerating}
                    className="text-xs text-indigo-600 hover:underline disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "AI Assist"}
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Describe the shoutout details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Recipients ({selectedRecipients.length})
                </label>
                <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
                  {employees.map((emp) => (
                    <label
                      key={emp.id}
                      className="flex items-center space-x-2 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(emp.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients((prev) => [...prev, emp.id]);
                          } else {
                            setSelectedRecipients((prev) =>
                              prev.filter((id) => id !== emp.id)
                            );
                          }
                        }}
                      />
                      <span>
                        {emp.fullName}{" "}
                        {emp.isActive ? (
                          <span className="text-xs text-emerald-500">
                            (active)
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            (inactive)
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                  {employees.length === 0 && (
                    <p className="text-xs text-slate-400">
                      No employees found.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Update Shoutout"
                    : "Create Shoutout"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
