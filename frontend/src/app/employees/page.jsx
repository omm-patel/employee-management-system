"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { Upload, Download } from "lucide-react";

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

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Users,
    IndianRupee,
    Building2,
    Search,
    Plus,
    ArrowUpDown,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";




export default function EmployeesPage() {

    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 5;
    const [sortBy, setSortBy] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    // Fetch employees data from API
    const fetchEmployees = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/employees"
            );

            setEmployees(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Upload Excel File
    const handleExcelUpload = async () => {
        if (!excelFile) {
            toast.error("Please select an Excel file");
            return;
        }

        try {

            setIsUploading(true);

            const formData = new FormData();

            formData.append("file", excelFile);

            const res = await axios.post(
                "http://localhost:5000/employees/import",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(
                `${res.data.inserted} employees imported, ${res.data.skipped} skipped`
            );

            fetchEmployees();

            setExcelFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to import employees"
            );
        } finally {
            setIsUploading(false);
        }
    };

    // Export Excel File
    const handleExport = () => {
    setIsExporting(true);

    window.location.href =
        "http://localhost:5000/employees/export";

    setTimeout(() => {
        setIsExporting(false);
    }, 2000);
};

    // Fetch data on component mount
    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/employees"
                );

                setEmployees(res.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    // Delete employee
    const deleteEmployee = async () => {
        if (employeeToDelete === null) return;

        try {
            await axios.delete(
                `http://localhost:5000/employees/${employeeToDelete}`
            );

            toast.success("Employee Deleted Successfully");

            fetchEmployees();

            setIsDeleteOpen(false);
            setEmployeeToDelete(null);
        } catch (error) {
            console.log(error);

            toast.error("Failed to Delete Employee");
        }
    };

    // Search employee
    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate statistics (Dashboard)
    const totalEmployees = employees.length;

    const totalSalary = employees.reduce(
        (sum, employee) => sum + Number(employee.salary),
        0
    );

    const totalDepartments = new Set(
        employees.map((employee) => employee.department)
    ).size;



    // Loading State
    if (loading) {
        return (
            <div className="p-6">
                Loading employees...
            </div>
        );
    }

    // sort by name or salary
    const sortedEmployees = [...filteredEmployees];

    if (sortBy === "name") {
        sortedEmployees.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    if (sortBy === "salary") {
        sortedEmployees.sort(
            (a, b) => Number(b.salary) - Number(a.salary)
        );
    }

    // Pagination
    const lastIndex = currentPage * employeesPerPage;
    const firstIndex = lastIndex - employeesPerPage;

    const currentEmployees =
        sortedEmployees.slice(
            firstIndex,
            lastIndex
        );


    // Total pages
    const totalPages = Math.ceil(
        filteredEmployees.length /
        employeesPerPage
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight">
                    Employee Management System
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage employee records, departments and salaries.
                </p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-gray-500">
                            Total Employees
                        </CardTitle>

                        <Users className="h-5 w-5 text-blue-500" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-4xl font-bold">
                            {totalEmployees}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-gray-500">
                            Total Salary
                        </CardTitle>

                        <IndianRupee className="h-5 w-5 text-green-500" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-4xl font-bold">
                            ₹{totalSalary.toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-sm text-gray-500">
                            Departments
                        </CardTitle>

                        <Building2 className="h-5 w-5 text-orange-500" />
                    </CardHeader>

                    <CardContent>
                        <p className="text-4xl font-bold">
                            {totalDepartments}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border rounded-lg pl-10 pr-4 py-2"
                            />
                        </div>

                        <a
                            href="http://localhost:5000/employees/download-template"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap"
                        >
                            <Download size={18} />
                            Template
                        </a>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.csv"
                            className="hidden"
                            id="excelFile"
                            onChange={(e) =>
                                setExcelFile(e.target.files[0])
                            }
                        />

                        <label
                            htmlFor="excelFile"
                            className="cursor-pointer border px-4 py-2 rounded-lg"
                        >
                            Select Excel
                        </label>

                        <button
                            onClick={handleExcelUpload}
                            disabled={isUploading}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            <Upload size={18} />
                            {isUploading ? "Uploading..." : "Upload Excel"}
                        </button>

                        {excelFile && (
                            <p className="text-sm text-green-600 mt-2">
                                Selected: {excelFile.name}
                            </p>
                        )}

                        <Link
                            href="/employees/add"
                            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg whitespace-nowrap hover:opacity-90"
                        >
                            <Plus size={18} />
                            Add Employee
                        </Link>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            <Download size={18} />
                            {isExporting
                                ? "Exporting..."
                                : "Export Employees"}
                        </button>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setSortBy("name")}
                            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowUpDown size={16} />
                            Sort Name
                        </button>

                        <button
                            onClick={() => setSortBy("salary")}
                            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
                        >
                            <ArrowUpDown size={16} />
                            Sort Salary
                        </button>
                    </div>

                    {/* If No Employees Found then show this */}
                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-10">
                            No employees found
                        </div>
                    )}
                    <table className="w-full border">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="border p-3">#</th>
                                <th className="border p-3">ID</th>
                                <th className="border p-3">Name</th>
                                <th className="border p-3">Email</th>
                                <th className="border p-3">Phone</th>
                                <th className="border p-3">Department</th>
                                <th className="border p-3">Salary</th>
                                <th className="border p-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentEmployees.map((employee, index) => (
                                <tr
                                    key={employee.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    <td className="border p-3">
                                        {index + 1}
                                    </td>

                                    <td className="border p-3">
                                        {employee.id}
                                    </td>

                                    <td className="border p-3">
                                        {employee.name}
                                    </td>

                                    <td className="border p-3">
                                        {employee.email}
                                    </td>

                                    <td className="border p-3">
                                        {employee.phone}
                                    </td>

                                    <td className="border p-3">
                                        {employee.department}
                                    </td>

                                    <td className="border p-3">
                                        ₹{employee.salary}
                                    </td>
                                    {/* Add Edit button */}
                                    <td className="border p-3">
                                        <Link
                                            href={`/employees/edit/${employee.id}`}
                                            className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100 mr-2"
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </Link>
                                        {/* Add Delete button */}
                                        <button
                                            onClick={() => {
                                                setEmployeeToDelete(employee.id);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="inline-flex items-center gap-2 border border-red-200 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center gap-2 mt-4">
                        {Array.from(
                            { length: totalPages },
                            (_, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        setCurrentPage(index + 1)
                                    }
                                    className={`px-3 py-2 border rounded ${currentPage === index + 1
                                        ? "bg-blue-500 text-white"
                                        : ""
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            )
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Employee
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to delete this employee?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={deleteEmployee}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}