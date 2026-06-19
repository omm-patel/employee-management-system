"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
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


export default function EmployeesPage() {

    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 5;
    const [sortBy, setSortBy] = useState("");
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Employee Management System
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-lg p-4 shadow">
                    <h3 className="text-gray-500">Total Employees</h3>
                    <p className="text-3xl font-bold">
                        {totalEmployees}
                    </p>
                </div>

                <div className="border rounded-lg p-4 shadow">
                    <h3 className="text-gray-500">Total Salary</h3>
                    <p className="text-3xl font-bold">
                        ₹{totalSalary.toLocaleString()}
                    </p>
                </div>

                <div className="border rounded-lg p-4 shadow">
                    <h3 className="text-gray-500">Departments</h3>
                    <p className="text-3xl font-bold">
                        {totalDepartments}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded w-full"
                />

                <Link
                    href="/employees/add"
                    className="bg-black text-white px-4 py-2 rounded-md  whitespace-nowrap"
                >
                    Add Employee
                </Link>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setSortBy("name")}
                    className="border px-3 py-2 rounded"
                >
                    Sort Name
                </button>

                <button
                    onClick={() => setSortBy("salary")}
                    className="border px-3 py-2 rounded"
                >
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
                <thead>
                    <tr>
                        <th className="border p-3">#</th>
                        <th className="border p-3">ID</th>
                        <th className="border p-3">Name</th>
                        <th className="border p-3">Email</th>
                        <th className="border p-3">Department</th>
                        <th className="border p-3">Salary</th>
                        <th className="border p-3">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {currentEmployees.map((employee, index) => (
                        <tr key={employee.id}>
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
                                {employee.department}
                            </td>

                            <td className="border p-3">
                                ₹{employee.salary}
                            </td>
                            {/* Add Edit button */}
                            <td className="border p-3">
                                <Link
                                    href={`/employees/edit/${employee.id}`}
                                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </Link>
                                {/* Add Delete button */}
                                <button
                                    onClick={() => {
                                        setEmployeeToDelete(employee.id);
                                        setIsDeleteOpen(true);
                                    }}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
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