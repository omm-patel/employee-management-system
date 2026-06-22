const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");

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

// Download Employee Template
const path = require("path");

router.get("/download-template", (req, res) => {
  const filePath = path.join(
    __dirname,
    "../templates/employee-template.xlsx"
  );

  res.download(filePath);
});

// Export Employee Data
router.get("/export", async (req, res) => {
  
  
  try {
    const sql = "SELECT * FROM employees";

    db.query(sql, async (err, employees) => {
      
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch employees",
        });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet =
        workbook.addWorksheet("Employees");

      worksheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Department", key: "department", width: 20 },
        { header: "Salary", key: "salary", width: 15 },
      ];

      employees.forEach((employee) => {
        worksheet.addRow(employee);
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=employees.xlsx"
      );

      await workbook.xlsx.write(res);

      res.end();
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to export employees",
    });
  }
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

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({
  storage,
});

// Import Excel File Route
const fs = require("fs");
router.post(
  "/import",
  upload.single("file"),
  async (req, res) => {
    try {
      const workbook = XLSX.readFile(
        req.file.path
      );

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const data =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      const requiredColumns = [
        "Name",
        "Email",
        "Phone",
        "Department",
        "Salary",
      ];

      const excelColumns = Object.keys(data[0] || {});

      const isValid = requiredColumns.every((col) =>
        excelColumns.includes(col)
      );

      if (!isValid) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid Excel format. Required columns: Name, Email, Phone, Department, Salary",
        });
      }

      console.log(data);

      let inserted = 0;
      let skipped = 0;

      const promises = data.map((employee) => {
        return new Promise((resolve) => {
          const sql = `
      INSERT INTO employees
      (name, email, phone, department, salary)
      VALUES (?, ?, ?, ?, ?)
    `;

          db.query(
            sql,
            [
              employee.Name,
              employee.Email,
              employee.Phone,
              employee.Department,
              employee.Salary,
            ],
            (err) => {
              if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                  skipped++;
                } else {
                  console.log(err);
                }

                return resolve();
              }

              inserted++;
              resolve();
            }
          );
        });
      });

      await Promise.all(promises);

      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        inserted,
        skipped,
        totalRecords: data.length,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to read Excel file",
      });
    }
  }
);



module.exports = router;