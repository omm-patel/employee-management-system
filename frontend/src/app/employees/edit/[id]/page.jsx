"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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
          `http://localhost:5000/employees/${id}`
        );

        setFormData(res.data.data[0]);
      } catch (error) {
        console.log(error);
        toast.error("Failed to Load Employee");
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
        `http://localhost:5000/employees/${id}`,
        formData
      );

      toast.success("Employee Updated Successfully");

      router.push("/employees");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Update Employee");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Edit Employee
        </h1>

        <p className="text-muted-foreground mt-2">
          Update employee information.
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
                  value={formData.name || ""}
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
                  value={formData.email || ""}
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
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Department</Label>

                <Select
                  value={formData.department || ""}
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
                  value={formData.salary || ""}
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
                  Update Employee
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}