package fu.se.lab07;

import fu.se.lab07.dao.StudentDAO;
import fu.se.lab07.entity.Student;
import fu.se.lab07.repository.IStudentRepository;
import fu.se.lab07.repository.StudentRepository;
import fu.se.lab07.service.IStudentService;
import fu.se.lab07.service.StudentService;
import fu.se.lab07.util.HibernateUtil;
import org.hibernate.SessionFactory;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class StudentServiceTest {

    private static SessionFactory sessionFactory;
    private static IStudentService studentService;
    private static Integer createdStudentId;
    private static final String UNIQUE_EMAIL = "junittest_" + System.currentTimeMillis() + "@fpt.edu.vn";

    @BeforeAll
    static void setUpAll() {
        sessionFactory = HibernateUtil.getSessionFactory();
        StudentDAO dao = new StudentDAO(sessionFactory);
        IStudentRepository repository = new StudentRepository(dao);
        studentService = new StudentService(repository);
    }

    @AfterAll
    static void tearDownAll() {
        HibernateUtil.shutdown();
    }

    @Test
    @Order(1)
    @DisplayName("T01: Hibernate SessionFactory bootstrap check")
    void testSessionFactoryBootstrap() {
        assertNotNull(sessionFactory, "SessionFactory should not be null");
        assertFalse(sessionFactory.isClosed(), "SessionFactory should be open");
    }

    @Test
    @Order(2)
    @DisplayName("T02: Create student with valid data")
    void testCreateStudentSuccess() {
        Student student = new Student(UNIQUE_EMAIL, "pass123", "JUnit", "Test", 8.5);
        Student created = studentService.create(student);

        assertNotNull(created.getId(), "Generated ID should not be null");
        assertEquals(UNIQUE_EMAIL, created.getEmail());
        createdStudentId = created.getId();
    }

    @Test
    @Order(3)
    @DisplayName("T03: Find all students")
    void testFindAll() {
        List<Student> list = studentService.getAll();
        assertNotNull(list);
        assertFalse(list.isEmpty(), "Student list should not be empty");
    }

    @Test
    @Order(4)
    @DisplayName("T04: Find by ID")
    void testFindById() {
        assertNotNull(createdStudentId, "Student ID should be available");
        Student student = studentService.getById(createdStudentId);
        assertNotNull(student);
        assertEquals("JUnit", student.getFirstName());
    }

    @Test
    @Order(5)
    @DisplayName("T05: Find missing ID throws exception")
    void testFindMissingId() {
        assertThrows(IllegalArgumentException.class, () -> studentService.getById(999999));
    }

    @Test
    @Order(6)
    @DisplayName("T06: Validation blocks invalid marks (< 0 or > 10)")
    void testInvalidMarksValidation() {
        Student invalidLow = new Student("low@fpt.edu.vn", "123", "Low", "Marks", -1.0);
        assertThrows(IllegalArgumentException.class, () -> studentService.create(invalidLow));

        Student invalidHigh = new Student("high@fpt.edu.vn", "123", "High", "Marks", 10.5);
        assertThrows(IllegalArgumentException.class, () -> studentService.create(invalidHigh));
    }

    @Test
    @Order(7)
    @DisplayName("T07: Validation blocks duplicate email")
    void testDuplicateEmail() {
        Student duplicate = new Student(UNIQUE_EMAIL, "pass456", "Dup", "Email", 7.0);
        assertThrows(IllegalArgumentException.class, () -> studentService.create(duplicate));
    }

    @Test
    @Order(8)
    @DisplayName("T08: Update student details")
    void testUpdateStudent() {
        Student toUpdate = studentService.getById(createdStudentId);
        toUpdate.setFirstName("JUnitUpdated");
        toUpdate.setMarks(9.8);

        Student updated = studentService.update(toUpdate);
        assertEquals("JUnitUpdated", updated.getFirstName());
        assertEquals(9.8, updated.getMarks());
    }

    @Test
    @Order(9)
    @DisplayName("T09: Login successful with correct credentials")
    void testLoginSuccess() {
        Student loggedIn = studentService.login(UNIQUE_EMAIL, "pass123");
        assertNotNull(loggedIn);
        assertEquals(UNIQUE_EMAIL, loggedIn.getEmail());
    }

    @Test
    @Order(10)
    @DisplayName("T10: Login fails with incorrect password or email")
    void testLoginFailure() {
        assertThrows(IllegalArgumentException.class, () -> studentService.login(UNIQUE_EMAIL, "wrongpass"));
        assertThrows(IllegalArgumentException.class, () -> studentService.login("nonexistent@fpt.edu.vn", "pass123"));
    }

    @Test
    @Order(11)
    @DisplayName("T11: Delete student and verify removal")
    void testDeleteStudent() {
        assertNotNull(createdStudentId);
        studentService.delete(createdStudentId);

        assertThrows(IllegalArgumentException.class, () -> studentService.getById(createdStudentId));
    }
}
