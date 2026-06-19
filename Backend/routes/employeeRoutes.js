const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get All Employees
router.get("/", (req, res) => {
  const sql = "SELECT * FROM employees";

  db.query(sql, (err, result) => {
      if (err) {
          console.log("SQL Error:", err);
          return res.status(500).json({
              success: false,
              error: err.message,
          });
      }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
});

// Add Employee
router.post("/", (req, res) => {
  const { name, email, phone, department, salary } = req.body;

  const sql = `
    INSERT INTO employees
    (name, email, phone, department, salary)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, phone, department, salary],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          success: false,
          message: "Failed to add employee",
        });
      }

      res.status(201).json({
        success: true,
        message: "Employee added successfully",
        employeeId: result.insertId,
      });
    }
  );
});

// Get Single Employee
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM employees WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch employee",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
});

// Update Employee
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { name, email, phone, department, salary } = req.body;

  const sql = `
    UPDATE employees
    SET name=?, email=?, phone=?, department=?, salary=?
    WHERE id=?
  `;

  db.query(
    sql,
    [name, email, phone, department, salary, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to update employee",
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee updated successfully",
      });
    }
  );
});

// Delete Employee
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM employees WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete employee",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  });
});

module.exports = router;