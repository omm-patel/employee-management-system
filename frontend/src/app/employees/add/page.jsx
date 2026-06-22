"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    Add Employee
                </h1>

                <p className="text-muted-foreground mt-2">
                    Create a new employee record.
                </p>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Name</Label>

                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Enter employee name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>

                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Enter employee email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Phone</Label>

                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Department</Label>

                                <Select
                                    value={formData.department}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            department: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="IT">
                                            IT
                                        </SelectItem>

                                        <SelectItem value="HR">
                                            HR
                                        </SelectItem>

                                        <SelectItem value="Finance">
                                            Finance
                                        </SelectItem>

                                        <SelectItem value="Marketing">
                                            Marketing
                                        </SelectItem>

                                        <SelectItem value="Sales">
                                            Sales
                                        </SelectItem>

                                        <SelectItem value="Development">
                                            Development
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Salary</Label>

                                <Input
                                    type="number"
                                    name="salary"
                                    placeholder="Enter salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Link
                                    href="/employees"
                                    className="border px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    className="bg-black text-white px-5 py-2 rounded-lg"
                                >
                                    Add Employee
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}