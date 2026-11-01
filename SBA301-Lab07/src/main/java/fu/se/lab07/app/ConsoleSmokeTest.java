package fu.se.lab07.app;

import fu.se.lab07.dao.StudentDAO;
import fu.se.lab07.entity.Student;
import fu.se.lab07.repository.IStudentRepository;
import fu.se.lab07.repository.StudentRepository;
import fu.se.lab07.service.IStudentService;
import fu.se.lab07.service.StudentService;
import fu.se.lab07.util.HibernateUtil;
import org.hibernate.SessionFactory;

import java.util.List;

public class ConsoleSmokeTest {

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("SBA301 - Lab 07: Console Smoke Test (Hibernate Core)");
        System.out.println("==================================================");

        SessionFactory sf = null;
        try {
            System.out.println("[Step 1] Bootstrapping Hibernate SessionFactory...");
            sf = HibernateUtil.getSessionFactory();
            System.out.println(" -> SessionFactory built successfully!");

            System.out.println("[Step 2] Initializing DAO, Repository and Service...");
            StudentDAO dao = new StudentDAO(sf);
            IStudentRepository repository = new StudentRepository(dao);
            IStudentService service = new StudentService(repository);
            System.out.println(" -> Service layer initialized successfully!");

            System.out.println("[Step 3] Fetching all current students...");
            List<Student> students = service.getAll();
            System.out.println(" -> Found " + students.size() + " student(s):");
            students.forEach(s -> System.out.println("    " + s));

            System.out.println("[Step 4] Testing CREATE student...");
            String testEmail = "smoketest_" + System.currentTimeMillis() + "@fpt.edu.vn";
            Student newStudent = new Student(testEmail, "pass123", "Smoke", "Test", 8.5);
            Student created = service.create(newStudent);
            System.out.println(" -> Created student with generated ID: " + created.getId());

            System.out.println("[Step 5] Testing FIND BY ID...");
            Student found = service.getById(created.getId());
            System.out.println(" -> Retrieved: " + found);

            System.out.println("[Step 6] Testing UPDATE student...");
            found.setFirstName("SmokeUpdated");
            found.setMarks(9.5);
            Student updated = service.update(found);
            System.out.println(" -> Updated: " + updated);

            System.out.println("[Step 7] Testing LOGIN...");
            Student loggedIn = service.login(testEmail, "pass123");
            System.out.println(" -> Login successful for: " + loggedIn.getEmail());

            System.out.println("[Step 8] Testing DELETE student...");
            service.delete(updated.getId());
            System.out.println(" -> Deleted student ID: " + updated.getId());

            boolean notFound = false;
            try {
                service.getById(updated.getId());
            } catch (IllegalArgumentException ex) {
                notFound = true;
            }
            if (notFound) {
                System.out.println(" -> Verified student no longer exists in database.");
            } else {
                throw new IllegalStateException("Student still exists after delete!");
            }

            System.out.println("==================================================");
            System.out.println(">>> ALL CORE TESTS PASSED SUCCESSFULLY! (G1 - G8 PASS) <<<");
            System.out.println("==================================================");
        } catch (Exception ex) {
            System.err.println("!!! SMOKE TEST FAILED: " + ex.getMessage());
            ex.printStackTrace();
        } finally {
            HibernateUtil.shutdown();
            System.out.println("SessionFactory closed successfully.");
        }
    }
}
