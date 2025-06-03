import jsPDF from 'jspdf';

const formatAmount = (amount) => {
  return `RWF ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const generateDailyPDF = (expenses, dailyTotal) => {
  const doc = new jsPDF();
  const today = new Date().toLocaleDateString();
  let y = 20;

  // Set font and colors
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(20);
  doc.setTextColor(33, 41, 66); // Dark blue-gray
  doc.text(`Daily Expense Report - ${today}`, 14, y);
  y += 12;

  // Total for the day
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total for the Day: ${formatAmount(dailyTotal)}`, 14, y);
  y += 12;

  // Header for expense details
  doc.setFontSize(11);
  doc.setFillColor(37, 99, 235); // Blue header
  doc.rect(14, y - 4, 186, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Date', 16, y);
  doc.text('Description', 42, y);
  doc.text('Category', 75, y);
  doc.text('Amount', 120, y, { align: 'right' });
  doc.text('Payment Method', 145, y);
  doc.text('Received By', 170, y);
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 200, y); // Line under headers
  y += 6;

  // Expense rows with striped theme
  expenses.forEach((expense, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    // Striped background
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245); // Light gray
      doc.rect(14, y - 5, 186, 8, 'F');
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(new Date(expense.date).toLocaleDateString(), 16, y);
    doc.text(expense.description.substring(0, 20), 42, y);
    doc.text(expense.category, 75, y);
    doc.text(formatAmount(expense.amount), 120, y, { align: 'right' });
    doc.text(expense.payment_method, 145, y);
    doc.text(expense.received_by.substring(0, 20), 170, y);
    y += 8;
  });

  // Add Prepared by at the bottom
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Prepared by Kwizera Olivier', 14, y);

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
  let y = 20;

  // Set font and colors
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(20);
  doc.setTextColor(33, 41, 66); // Dark blue-gray
  doc.text(title, 14, y);
  y += 12;

  // Total expenses
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Expenses: ${formatAmount(totalExpenses)}`, 14, y);
  y += 12;

  // Header for expense details
  doc.setFontSize(11);
  doc.setFillColor(37, 99, 235); // Blue header
  doc.rect(14, y - 4, 186, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('Date', 16, y);
  doc.text('Description', 42, y);
  doc.text('Category', 75, y);
  doc.text('Amount', 120, y, { align: 'right' });
  doc.text('Payment Method', 145, y);
  doc.text('Received By', 170, y);
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 200, y); // Line under headers
  y += 6;

  // Expense rows with striped theme
  expenses.forEach((expense, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    // Striped background
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245); // Light gray
      doc.rect(14, y - 5, 186, 8, 'F');
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(new Date(expense.date).toLocaleDateString(), 16, y);
    doc.text(expense.description.substring(0, 20), 42, y);
    doc.text(expense.category, 75, y);
    doc.text(formatAmount(expense.amount), 120, y, { align: 'right' });
    doc.text(expense.payment_method, 145, y);
    doc.text(expense.received_by.substring(0, 20), 170, y);
    y += 8;
  });

  // Add Prepared by at the bottom
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  y += 10;
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Prepared by Kwizera Olivier', 14, y);

  const filename =
    startDate && endDate
      ? `expense_report_${startDate}_to_${endDate}.pdf`
      : `expense_report_${new Date()
          .toLocaleDateString()
          .replace(/\//g, '-')}.pdf`;

  doc.save(filename);
};
