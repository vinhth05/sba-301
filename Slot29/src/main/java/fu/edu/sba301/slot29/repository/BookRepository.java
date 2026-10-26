package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.dao.BookDAO;
import fu.edu.sba301.slot29.entity.Book;

import java.util.List;
import java.util.Optional;

public class BookRepository {

    private final BookDAO bookDAO;

    public BookRepository() {
        this.bookDAO = new BookDAO();
    }

    public BookRepository(BookDAO bookDAO) {
        this.bookDAO = bookDAO;
    }

    public void create(Book book) {
        bookDAO.save(book);
    }

    public Optional<Book> getById(Long id) {
        return bookDAO.findById(id);
    }

    public Optional<Book> getByIsbn(String isbn) {
        return bookDAO.findByIsbn(isbn);
    }

    public List<Book> getAll() {
        return bookDAO.findAll();
    }
}
