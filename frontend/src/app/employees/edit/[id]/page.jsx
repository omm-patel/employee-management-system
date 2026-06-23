"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Save } from "lucide-react";

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

export default function EditEmployee() {
  const params = useParams();
  const router = useRouter();

  const { id } = params;

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://192.168.1.70:5000/employees/${id}`
        );

        setFormData(res.data.data[0]);
      } catch (error) {
        console.log(error);
        toast.error("Failed to Load Employee");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://192.168.1.70:5000/employees/${id}`,
        formData
      );

      toast.success("Employee Updated Successfully");

      router.push("/employees");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Update Employee");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <CardContent className="p-8">
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-56 bg-slate-200 rounded" />
                <div className="h-11 bg-slate-200 rounded" />
                <div className="h-11 bg-slate-200 rounded" />
                <div className="h-11 bg-slate-200 rounded" />
                <div className="h-11 bg-slate-200 rounded" />
                <div className="h-11 bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-sm font-medium mb-4">
            <Pencil size={14} />
            Employee Management
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Employee
          </h1>

          <p className="text-slate-500 mt-2">
            Update employee information and keep records accurate.
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
                  Modify employee details and save your changes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Full Name
                  </Label>

                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter employee name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Email Address
                  </Label>

                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter employee email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Phone Number
                  </Label>

                  <Input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label className="text-slate-700">
                    Department
                  </Label>

                  <Select
                    value={formData.department || ""}
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
                      <SelectItem value="Finance">
                        Finance
                      </SelectItem>
                      <SelectItem value="Marketing">
                        Marketing
                      </SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Development">
                        Development
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Salary */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-slate-700">
                    Salary
                  </Label>

                  <Input
                    type="number"
                    name="salary"
                    placeholder="Enter salary amount"
                    value={formData.salary || ""}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Buttons */}
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
                  <Save size={16} />
                  Update Employee
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}