import jsPDF from 'jspdf';

export const generateDailyPDF = (expenses, dailyTotal) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();
  let y = 20; // Starting Y position

  // Set document title
  doc.setFontSize(18);
  doc.text(`Daily Expense Report - ${today}`, 14, y);
  y += 10;

  // Total for the day
  doc.setFontSize(12);
  doc.text(`Total for the Day: $${dailyTotal.toFixed(2)}`, 14, y);
  y += 10;

  // Header for expense details
  doc.setFontSize(10);
  doc.text('Date', 14, y);
  doc.text('Description', 40, y);
  doc.text('Category', 80, y);
  doc.text('Amount', 110, y, { align: 'right' });
  doc.text('Payment Method', 140, y);
  doc.text('Received By', 170, y);
  y += 5;
  doc.line(14, y, 196, y); // Horizontal line under headers
  y += 5;

  // Expense rows
  expenses.forEach((expense) => {
    if (y > 270) {
      // Add new page if near bottom
      doc.addPage();
      y = 20;
    }
    doc.text(new Date(expense.date).toLocaleDateString(), 14, y);
    doc.text(expense.description.substring(0, 20), 40, y); // Truncate for brevity
    doc.text(expense.category, 80, y);
    doc.text(`$${expense.amount.toFixed(2)}`, 110, y, { align: 'right' });
    doc.text(expense.payment_method, 140, y);
    doc.text(expense.received_by.substring(0, 20), 170, y); // Truncate for brevity
    y += 10;
  });

  doc.save(`daily_expense_report_${today.replace(/\//g, '-')}.pdf`);
};

export const generateDateRangePDF = (
  expenses,
  startDate,
  endDate,
  totalExpenses
) => {
  const doc = new jsPDF();
  const title =
    startDate && endDate
      ? `Expense Report from ${startDate} to ${endDate}`
      : 'Expense Report';
  let y = 20; // Starting Y position

  // Set document title
  doc.setFontSize(18);
  doc.text(title, 14, y);
  y += 10;

  // Total expenses
  doc.setFontSize(12);
  doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`, 14, y);
  y += 10;

  // Header for expense details
  doc.setFontSize(10);
  doc.text('Date', 14, y);
  doc.text('Description', 40, y);
  doc.text('Category', 80, y);
  doc.text('Amount', 110, y, { align: 'right' });
  doc.text('Payment Method', 140, y);
  doc.text('Received By', 170, y);
  y += 5;
  doc.line(14, y, 196, y); // Horizontal line under headers
  y += 5;

  // Expense rows
  expenses.forEach((expense) => {
    if (y > 270) {
      // Add new page if near bottom
      doc.addPage();
      y = 20;
    }
    doc.text(new Date(expense.date).toLocaleDateString(), 14, y);
    doc.text(expense.description.substring(0, 20), 40, y); // Truncate for brevity
    doc.text(expense.category, 80, y);
    doc.text(`$${expense.amount.toFixed(2)}`, 110, y, { align: 'right' });
    doc.text(expense.payment_method, 140, y);
    doc.text(expense.received_by.substring(0, 20), 170, y); // Truncate for brevity
    y += 10;
  });

  const filename =
    startDate && endDate
      ? `expense_report_${startDate}_to_${endDate}.pdf`
      : `expense_report_${new Date()
          .toLocaleDateString()
          .replace(/\//g, '-')}.pdf`;

  doc.save(filename);
};
