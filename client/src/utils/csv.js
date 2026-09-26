const COLUMNS = [
  'company', 'role', 'date', 'round', 'result', 'rating',
  'wentWell', 'wentWrong', 'questionsICouldntAnswer', 'keyLearning',
  'whatToImprove', 'topicsToPrepare', 'additionalNotes',
];

function escapeCsvValue(value) {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function interviewsToCsv(interviews) {
  const header = COLUMNS.join(',');
  const rows = interviews.map((interview) =>
    COLUMNS.map((col) => escapeCsvValue(col === 'date' ? new Date(interview.date).toISOString().slice(0, 10) : interview[col])).join(',')
  );
  return [header, ...rows].join('\n');
}

export function downloadCsv(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
