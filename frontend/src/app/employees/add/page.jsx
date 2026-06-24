"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { Plus, UserPlus } from "lucide-react";

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
        `${process.env.NEXT_PUBLIC_API_URL}/employees`,
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium mb-4">
            <UserPlus size={14} />
            Employee Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Add Employee
          </h1>

          <p className="text-slate-500 mt-2">
            Create a new employee record and add them to your organization.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <CardContent className="p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Employee Information
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Fill in the employee details below.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Full Name
                  </Label>

                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter employee name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Email Address
                  </Label>

                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter employee email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Phone Number
                  </Label>

                  <Input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Department
                  </Label>

                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        department: value,
                      })
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Development">
                        Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700">
                    Salary
                  </Label>

                  <Input
                    type="number"
                    name="salary"
                    placeholder="Enter salary amount"
                    value={formData.salary}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-end gap-3">
                <Link
                  href="/employees"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-sm font-medium text-white transition"
                >
                  <Plus size={16} />
                  Add Employee
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}