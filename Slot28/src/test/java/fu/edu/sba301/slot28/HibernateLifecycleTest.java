package fu.edu.sba301.slot28;

import fu.edu.sba301.slot28.entity.Book;
import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.junit.jupiter.api.*;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class HibernateLifecycleTest {

    private static SessionFactory testSessionFactory;

    @BeforeAll
    static void setUpAll() {
        testSessionFactory = HibernateUtil.buildSessionFactory("hibernate-test.cfg.xml");
        HibernateUtil.setSessionFactory(testSessionFactory);
    }

    @AfterAll
    static void tearDownAll() {
        if (testSessionFactory != null && !testSessionFactory.isClosed()) {
            testSessionFactory.close();
        }
    }

    @Test
    @Order(1)
    @DisplayName("Test 1: Persist entity and verify database insertion")
    void testPersistEntity() {
        Long id;
        try (Session session = testSessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Student s = new Student("test.student@fpt.edu.vn", "Vinh", "Tran", 8.5);
            session.persist(s);
            tx.commit();
            id = s.getId();
            assertNotNull(id);
        }

        try (Session session = testSessionFactory.openSession()) {
            Student reloaded = session.get(Student.class, id);
            assertNotNull(reloaded);
            assertEquals("test.student@fpt.edu.vn", reloaded.getEmail());
            assertEquals(8.5, reloaded.getMarks());
        }
    }

    @Test
    @Order(2)
    @DisplayName("Test 2: Dirty checking automatically triggers UPDATE on commit")
    void testDirtyChecking() {
        Long id;
        try (Session session = testSessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Student s = new Student("dirty.check@fpt.edu.vn", "Alice", "Smith", 7.0);
            session.persist(s);
            tx.commit();
            id = s.getId();
        }

        // Update via dirty checking
        try (Session session = testSessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Student managed = session.get(Student.class, id);
            managed.setMarks(9.5); // modify without calling session.update()
            tx.commit();
        }

        // Verify update persisted
        try (Session session = testSessionFactory.openSession()) {
            Student reloaded = session.get(Student.class, id);
            assertEquals(9.5, reloaded.getMarks());
        }
    }

    @Test
    @Order(3)
    @DisplayName("Test 3: First-level cache resolves identical object instance (a == b)")
    void testFirstLevelCache() {
        Long id;
        try (Session session = testSessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Student s = new Student("cache.test@fpt.edu.vn", "Bob", "Brown", 6.5);
            session.persist(s);
            tx.commit();
            id = s.getId();
        }

        try (Session session = testSessionFactory.openSession()) {
            Student a = session.get(Student.class, id);
            Student b = session.get(Student.class, id);
            assertSame(a, b, "Entities retrieved within same session must refer to the exact same Java instance");
        }
    }

    @Test
    @Order(4)
    @DisplayName("Test 4: Parameterized HQL query execution")
    void testHqlParameterizedQuery() {
        try (Session session = testSessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            session.persist(new Student("hql1@fpt.edu.vn", "David", "Lee", 8.8));
            session.persist(new Student("hql2@fpt.edu.vn", "Eva", "Miller", 9.2));
            session.persist(new Book("978-0132350884", "Clean Code", "Robert C. Martin"));
            tx.commit();
        }

        try (Session session = testSessionFactory.openSession()) {
            List<Student> list = session.createQuery(
                    "FROM Student s WHERE s.marks >= :minMarks ORDER BY s.marks DESC", Student.class)
                    .setParameter("minMarks", 8.5)
                    .list();

            assertFalse(list.isEmpty());
            assertTrue(list.stream().allMatch(s -> s.getMarks() >= 8.5));
        }
    }
}
