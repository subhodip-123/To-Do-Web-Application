export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const prev = () => onChange(Math.max(1, page - 1));
  const next = () => onChange(Math.min(pages, page + 1));
  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={prev} disabled={page === 1} className="btn-secondary">
        Previous
      </button>
      <span className="text-sm text-slate-500">
        Page {page} of {pages}
      </span>
      <button onClick={next} disabled={page === pages} className="btn-secondary">
        Next
      </button>
    </div>
  );
}
