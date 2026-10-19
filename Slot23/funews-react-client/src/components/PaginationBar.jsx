import { Button, ButtonGroup } from "react-bootstrap";

export default function PaginationBar({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  // Generate page numbers to display
  const pageNumbers = [];
  const maxButtons = 5;
  let startPage = Math.max(0, page - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(0, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-2 border-top">
      <div className="text-muted small">
        Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
      </div>

      <ButtonGroup size="sm">
        <Button
          variant="outline-primary"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          &laquo; Previous
        </Button>

        {startPage > 0 && (
          <>
            <Button
              variant={page === 0 ? "primary" : "outline-primary"}
              onClick={() => onPageChange(0)}
            >
              1
            </Button>
            {startPage > 1 && <Button variant="outline-secondary" disabled>...</Button>}
          </>
        )}

        {pageNumbers.map((num) => (
          <Button
            key={num}
            variant={page === num ? "primary" : "outline-primary"}
            onClick={() => onPageChange(num)}
          >
            {num + 1}
          </Button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <Button variant="outline-secondary" disabled>...</Button>}
            <Button
              variant={page === totalPages - 1 ? "primary" : "outline-primary"}
              onClick={() => onPageChange(totalPages - 1)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline-primary"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next &raquo;
        </Button>
      </ButtonGroup>
    </div>
  );
}
