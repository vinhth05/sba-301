package fu.edu.sba301.slot29;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.service.LibraryService;
import fu.edu.sba301.slot29.util.HibernateUtil;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.*;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ManyToManyLayeringTest {

    private static SessionFactory testSessionFactory;
    private static LibraryService libraryService;

    @BeforeAll
    static void setUpAll() {
        testSessionFactory = HibernateUtil.buildSessionFactory("hibernate-test.cfg.xml");
        HibernateUtil.setSessionFactory(testSessionFactory);
        libraryService = new LibraryService();
    }

    @AfterAll
    static void tearDownAll() {
        if (testSessionFactory != null && !testSessionFactory.isClosed()) {
            testSessionFactory.close();
        }
    }

    @Test
    @Order(1)
    @DisplayName("Test 1: Register Student and Book entities")
    void testRegisterEntities() {
        Student s = libraryService.registerStudent("alice@fpt.edu.vn", "Alice", "Wonder", 8.0);
        Book b = libraryService.registerBook("ISBN-001", "Spring Boot in Action", "Craig Walls");

        assertNotNull(s.getId());
        assertNotNull(b.getId());
        assertEquals("alice@fpt.edu.vn", s.getEmail());
        assertEquals("ISBN-001", b.getIsbn());
    }

    @Test
    @Order(2)
    @DisplayName("Test 2: Borrow book establishes Many-to-Many join association")
    void testBorrowBook() {
        Student s = libraryService.registerStudent("bob@fpt.edu.vn", "Bob", "Builder", 7.5);
        Book b1 = libraryService.registerBook("ISBN-002", "Design Patterns", "GoF");
        Book b2 = libraryService.registerBook("ISBN-003", "Refactoring", "Martin Fowler");

        libraryService.borrowBook(s.getId(), b1.getId());
        libraryService.borrowBook(s.getId(), b2.getId());

        Optional<Student> reloaded = libraryService.getStudentDetails(s.getId());
        assertTrue(reloaded.isPresent());
        assertEquals(2, reloaded.get().getBooks().size());
        assertTrue(reloaded.get().getBooks().stream().anyMatch(b -> b.getIsbn().equals("ISBN-002")));
        assertTrue(reloaded.get().getBooks().stream().anyMatch(b -> b.getIsbn().equals("ISBN-003")));
    }

    @Test
    @Order(3)
    @DisplayName("Test 3: Return book removes association from join table")
    void testReturnBook() {
        Student s = libraryService.registerStudent("charlie@fpt.edu.vn", "Charlie", "Chaplin", 9.0);
        Book b = libraryService.registerBook("ISBN-004", "Domain-Driven Design", "Eric Evans");

        libraryService.borrowBook(s.getId(), b.getId());
        Student withBook = libraryService.getStudentDetails(s.getId()).orElseThrow();
        assertEquals(1, withBook.getBooks().size());

        // Return book
        libraryService.returnBook(s.getId(), b.getId());
        Student afterReturn = libraryService.getStudentDetails(s.getId()).orElseThrow();
        assertEquals(0, afterReturn.getBooks().size());
    }

    @Test
    @Order(4)
    @DisplayName("Test 4: Deleting Student preserves shared Book entities")
    void testDeleteStudentDoesNotDeleteBooks() {
        Student s = libraryService.registerStudent("david@fpt.edu.vn", "David", "Beckham", 8.5);
        Book b = libraryService.registerBook("ISBN-005", "Microservices Patterns", "Chris Richardson");

        libraryService.borrowBook(s.getId(), b.getId());

        // Unregister student
        libraryService.unregisterStudent(s.getId());

        // Verify student is gone
        assertFalse(libraryService.getStudentDetails(s.getId()).isPresent());

        // Verify shared book remains intact in the catalog
        Optional<Book> bookStillExists = libraryService.getAllBooks().stream()
                .filter(x -> x.getIsbn().equals("ISBN-005"))
                .findFirst();
        assertTrue(bookStillExists.isPresent(), "Book must NOT be deleted when borrowing student is removed");
    }
}
