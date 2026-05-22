import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (tasks) => {
  const headers = ['Title', 'Description', 'Priority', 'Category', 'Due Date', 'Completed'];
  const rows = tasks.map((t) => [
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.priority,
    t.category,
    t.dueDate ? new Date(t.dueDate).toISOString().slice(0, 10) : '',
    t.completed ? 'Yes' : 'No',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = (tasks) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('My Tasks', 14, 18);
  autoTable(doc, {
    startY: 25,
    head: [['Title', 'Priority', 'Category', 'Due Date', 'Status']],
    body: tasks.map((t) => [
      t.title,
      t.priority,
      t.category,
      t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-',
      t.completed ? 'Done' : 'Pending',
    ]),
    headStyles: { fillColor: [99, 102, 241] },
  });
  doc.save(`tasks-${Date.now()}.pdf`);
};
