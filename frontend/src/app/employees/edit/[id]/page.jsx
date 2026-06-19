"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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
      }
    };

    fetchEmployee();
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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Edit Employee
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

              <select
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
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
          value={formData.salary || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
}