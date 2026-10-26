package fu.edu.sba301.slot28.app;

import fu.edu.sba301.slot28.entity.Book;
import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        System.out.println("=================================================================");
        System.out.println("   SBA301 - SLOT 28: HIBERNATE ARCHITECTURE & HQL EXPERIMENTS   ");
        System.out.println("=================================================================\n");

        try {
            // STEP 8: PERSIST EXPERIMENT
            System.out.println(">>> STEP 8: Persist Experiment (Transient -> Persistent/Managed)");
            Long studentId;
            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                Transaction tx = session.beginTransaction();

                Student s1 = new Student("vinhth@fpt.edu.vn", "Hien Vinh", "Tran", 8.5);
                session.persist(s1);

                Book b1 = new Book("978-0134685991", "Effective Java", "Joshua Bloch");
                session.persist(b1);

                tx.commit();
                studentId = s1.getId();
                System.out.println("Saved Student with ID: " + studentId);
                System.out.println("Saved Book with ID: " + b1.getId());
            }

            // STEP 9: DIRTY CHECKING EXPERIMENT
            System.out.println("\n>>> STEP 9: Dirty Checking Experiment");
            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                Transaction tx = session.beginTransaction();

                Student managedStudent = session.get(Student.class, studentId);
                System.out.println("Before update, marks: " + managedStudent.getMarks());

                // Modify property in managed state without explicit session.update()
                managedStudent.setMarks(9.8);
                System.out.println("Modified marks to 9.8 in memory. Committing transaction...");

                tx.commit(); // Dirty checking triggers automatic SQL UPDATE
                System.out.println("Transaction committed. Dirty checking verified!");
            }

            // STEP 10: FIRST-LEVEL CACHE EXPERIMENT
            System.out.println("\n>>> STEP 10: First-Level Cache Experiment");
            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                System.out.println("Executing first session.get()...");
                Student a = session.get(Student.class, studentId);

                System.out.println("Executing second session.get() for same ID...");
                Student b = session.get(Student.class, studentId);

                System.out.println("Is instance identical (a == b)? " + (a == b));
                System.out.println("Note: Only 1 SQL SELECT was generated because of 1st-level cache!");
            }

            // STEP 11: DETACHED EXPERIMENT
            System.out.println("\n>>> STEP 11: Detached Experiment");
            Student detachedStudent;
            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                detachedStudent = session.get(Student.class, studentId);
            } // Session is now closed -> detachedStudent is in Detached state

            detachedStudent.setMarks(10.0);
            System.out.println("Modified detached object to marks 10.0 outside session.");
            System.out.println("Re-attaching via session.merge()...");

            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                Transaction tx = session.beginTransaction();
                Student reManaged = session.merge(detachedStudent);
                tx.commit();
                System.out.println("Re-attached and updated marks: " + reManaged.getMarks());
            }

            // STEP 12: HQL PARAMETERIZED QUERY
            System.out.println("\n>>> STEP 12: HQL Parameterized Query Experiment");
            try (Session session = HibernateUtil.getSessionFactory().openSession()) {
                Query<Student> query = session.createQuery(
                        "FROM Student s WHERE s.marks >= :minMarks ORDER BY s.marks DESC", Student.class);
                query.setParameter("minMarks", 8.0);

                List<Student> highAchievers = query.list();
                System.out.println("Found " + highAchievers.size() + " students with marks >= 8.0:");
                highAchievers.forEach(s -> System.out.println(" - " + s));
            }

            System.out.println("\n=================================================================");
            System.out.println("   ALL SLOT 28 EXPERIMENTS COMPLETED SUCCESSFULLY!             ");
            System.out.println("=================================================================");

        } catch (Exception e) {
            System.err.println("Experiment failed: " + e.getMessage());
            e.printStackTrace();
        } finally {
            HibernateUtil.shutdown();
        }
    }
}
