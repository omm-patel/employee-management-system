"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AddEmployee() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        salary: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                "http://localhost:5000/employees",
                formData
            );

            toast.success("Employee Added Successfully");

            setFormData({
                name: "",
                email: "",
                phone: "",
                department: "",
                salary: "",
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to Add Employee");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Add Employee
            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border p-3 rounded bg-black"
                >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Development">Development</option>
                </select>

                <input
                    type="number"
                    name="salary"
                    placeholder="Salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full border p-3 rounded"
                />

                <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded"
                >
                    Add Employee
                </button>
            </form>
        </div>
    );
}