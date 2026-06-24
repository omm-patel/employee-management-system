"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import {
  Upload,
  Download,
  Users,
  IndianRupee,
  Building2,
  Search,
  Plus,
  ArrowUpDown,
  Pencil,
  Trash2,
  FileSpreadsheet,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// ─── Department badge colors ────────────────────────────────────────────────
const DEPT_COLORS = {
  IT: "bg-violet-50 text-violet-700 ring-violet-200",
  HR: "bg-pink-50  text-pink-700  ring-pink-200",
  Finance: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Marketing: "bg-orange-50 text-orange-700 ring-orange-200",
  Sales: "bg-blue-50  text-blue-700  ring-blue-200",
  Development: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

function DeptBadge({ dept }) {
  const cls = DEPT_COLORS[dept] ?? "bg-slate-50 text-slate-600 ring-slate-200";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${cls}`}>
      {dept}
    </span>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
      <div className={`${iconBg} p-3 rounded-xl`}>
        <Icon className={`h-6 w-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Pagination Button ───────────────────────────────────────────────────────
function PageBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${active
          ? "bg-indigo-600 text-white"
          : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {children}
    </button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);
  const EMPLOYEES_PER_PAGE = 8;

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {

      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employees`);

      setEmployees(res.data.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employees`);
        setEmployees(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Import ─────────────────────────────────────────────────────────────────
  const handleExcelUpload = async () => {
    if (!excelFile) {
      toast.error("Please select an Excel file first");
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", excelFile);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/employees`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success(`${res.data.inserted} imported, ${res.data.skipped} skipped`);
      fetchEmployees();
      setExcelFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message ?? "Failed to import employees");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Export ─────────────────────────────────────────────────────────────────
  const handleExport = () => {
    setIsExporting(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/employees`;
    setTimeout(() => setIsExporting(false), 2000);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const deleteEmployee = async () => {
    if (employeeToDelete === null) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeToDelete}`);
      toast.success("Employee deleted");
      fetchEmployees();
      setIsDeleteOpen(false);
      setEmployeeToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete employee");
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered];
  if (sortBy === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "salary") sorted.sort((a, b) => Number(b.salary) - Number(a.salary));

  const totalPages = Math.ceil(sorted.length / EMPLOYEES_PER_PAGE);
  const lastIndex = currentPage * EMPLOYEES_PER_PAGE;
  const firstIndex = lastIndex - EMPLOYEES_PER_PAGE;
  const currentEmployees = sorted.slice(firstIndex, lastIndex);

  const totalSalary = employees.reduce((s, e) => s + Number(e.salary), 0);
  const totalDepts = new Set(employees.map((e) => e.department)).size;

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-500">Loading employees…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employees
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {employees.length} total records
            </p>
          </div>
          <Link
            href="/employees/add"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} />
            Add employee
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Total employees"
            value={employees.length}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <StatCard
            icon={IndianRupee}
            label="Total monthly salary"
            value={`₹${totalSalary.toLocaleString("en-IN")}`}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            icon={Building2}
            label="Departments"
            value={totalDepts}
            iconBg="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* ── Main Table Card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* ── Toolbar Row 1: search + sort ──────────────────────────────── */}
          <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
              />
            </div>
            {/* Sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortBy(sortBy === "name" ? "" : "name")}
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition ${sortBy === "name"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <ArrowUpDown size={14} />
                Name
              </button>
              <button
                onClick={() => setSortBy(sortBy === "salary" ? "" : "salary")}
                className={`inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border transition ${sortBy === "salary"
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                <ArrowUpDown size={14} />
                Salary
              </button>
            </div>
          </div>

          {/* ── Toolbar Row 2: import / export ────────────────────────────── */}
          <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-2 items-center">
            {/* Template download */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/employees/download-template`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition"
            >
              <Download size={13} />
              Download template
            </a>

            {/* File picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.csv"
              id="excelFile"
              className="hidden"
              onChange={(e) => setExcelFile(e.target.files[0])}
            />
            <label
              htmlFor="excelFile"
              className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition"
            >
              <FileSpreadsheet size={13} />
              {excelFile ? "Change file" : "Select file"}
            </label>

            {/* Chosen file chip */}
            {excelFile && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                {excelFile.name}
                <button
                  onClick={() => { setExcelFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="hover:opacity-70 transition"
                  aria-label="Remove file"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {/* Upload button */}
            <button
              onClick={handleExcelUpload}
              disabled={isUploading || !excelFile}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Upload size={13} />
              {isUploading ? "Uploading…" : "Upload"}
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Export */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50 transition"
            >
              <Download size={13} />
              {isExporting ? "Exporting…" : "Export all"}
            </button>
          </div>

          {/* ── Table ──────────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No employees found</p>
              <p className="text-sm text-slate-400 mt-1">
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different name.`
                  : "Add your first employee to get started."}
              </p>
              {!searchTerm && (
                <Link
                  href="/employees/add"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <Plus size={14} /> Add employee
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3 text-left">ID</th>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Email</th>
                    <th className="px-5 py-3 text-left">Phone</th>
                    <th className="px-5 py-3 text-left">Department</th>
                    <th className="px-5 py-3 text-right">Salary</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">
                        #{employee.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {employee.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {employee.email}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {employee.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <DeptBadge dept={employee.department} />
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-800">
                        ₹{Number(employee.salary).toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            href={`/employees/edit/${employee.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition"
                          >
                            <Pencil size={12} />
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              setEmployeeToDelete(employee.id);
                              setIsDeleteOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-100 text-red-600 hover:bg-red-50 text-xs font-medium transition"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
              <span>
                Showing {firstIndex + 1}–{Math.min(lastIndex, sorted.length)} of {sorted.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PageBtn
                    key={i}
                    active={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PageBtn>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Dialog ────────────────────────────────────────────────── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the employee record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteEmployee}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}