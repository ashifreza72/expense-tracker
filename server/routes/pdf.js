const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const db = require('../db');
const router = express.Router();

router.get('/export/:user_id', (req, res) => {
  db.query(
    'SELECT * FROM expenses WHERE user_id = ?',
    [req.params.user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=expense_report.pdf'
      );

      doc.pipe(res);
      doc.text('Expense Report', { align: 'center' });

      results.forEach((exp) => {
        doc.text(`${exp.category}: ₹${exp.amount} - ${exp.description}`);
      });

      doc.end();
    }
  );
});

module.exports = router;
