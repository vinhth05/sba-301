package fu.edu.sba301.slot29.service;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.repository.BookRepository;
import fu.edu.sba301.slot29.repository.StudentRepository;

import java.util.List;
import java.util.Optional;

public class LibraryService {

    private final StudentRepository studentRepository;
    private final BookRepository bookRepository;

    public LibraryService() {
        this.studentRepository = new StudentRepository();
        this.bookRepository = new BookRepository();
    }

    public LibraryService(StudentRepository studentRepository, BookRepository bookRepository) {
        this.studentRepository = studentRepository;
        this.bookRepository = bookRepository;
    }

    public Student registerStudent(String email, String firstName, String lastName, Double marks) {
        if (studentRepository.getByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Student with email '" + email + "' already exists.");
        }
        Student s = new Student(email, firstName, lastName, marks);
        studentRepository.create(s);
        return s;
    }

    public Book registerBook(String isbn, String title, String author) {
        if (bookRepository.getByIsbn(isbn).isPresent()) {
            throw new IllegalArgumentException("Book with ISBN '" + isbn + "' already exists.");
        }
        Book b = new Book(isbn, title, author);
        bookRepository.create(b);
        return b;
    }

    /**
     * Borrow a book for a student. Handles the Many-to-Many association update on the owning side.
     */
    public void borrowBook(Long studentId, Long bookId) {
        if (studentRepository.getById(studentId).isEmpty()) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        if (bookRepository.getById(bookId).isEmpty()) {
            throw new IllegalArgumentException("Book not found with ID: " + bookId);
        }

        studentRepository.associateBook(studentId, bookId);
    }

    /**
     * Return a borrowed book.
     */
    public void returnBook(Long studentId, Long bookId) {
        if (studentRepository.getById(studentId).isEmpty()) {
            throw new IllegalArgumentException("Student not found with ID: " + studentId);
        }
        if (bookRepository.getById(bookId).isEmpty()) {
            throw new IllegalArgumentException("Book not found with ID: " + bookId);
        }

        studentRepository.disassociateBook(studentId, bookId);
    }

    public Optional<Student> getStudentDetails(Long studentId) {
        return studentRepository.getByIdWithBooks(studentId);
    }

    public List<Student> getAllStudents() {
        return studentRepository.getAll();
    }

    public List<Book> getAllBooks() {
        return bookRepository.getAll();
    }

    /**
     * Delete student cleanly without removing shared books.
     */
    public void unregisterStudent(Long studentId) {
        studentRepository.remove(studentId);
    }
}
