package fu.edu.sba301.slot29.app;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.service.LibraryService;
import fu.edu.sba301.slot29.util.HibernateUtil;

public class Main {

    public static void main(String[] args) {
        System.out.println("============================================================================");
        System.out.println("   SBA301 - SLOT 29: MANY-TO-MANY DEMO, DAO, REPOSITORY & SERVICE LAYERING ");
        System.out.println("============================================================================\n");

        LibraryService libraryService = new LibraryService();

        try {
            // 1. Register Books
            System.out.println(">>> 1. Registering Books into Library Catalog...");
            Book b1 = libraryService.registerBook("978-0134685991", "Effective Java (3rd Edition)", "Joshua Bloch");
            Book b2 = libraryService.registerBook("978-0132350884", "Clean Code", "Robert C. Martin");
            Book b3 = libraryService.registerBook("978-0321356680", "Effective Java: Programming Language Guide", "Joshua Bloch");
            System.out.println("Books registered successfully.");

            // 2. Register Students
            System.out.println("\n>>> 2. Registering Students...");
            Student s1 = libraryService.registerStudent("vinh.tranhien@fpt.edu.vn", "Hien Vinh", "Tran", 9.0);
            Student s2 = libraryService.registerStudent("dat.tranvan@fpt.edu.vn", "Van Dat", "Tran", 8.8);
            System.out.println("Registered Student 1 ID: " + s1.getId());
            System.out.println("Registered Student 2 ID: " + s2.getId());

            // 3. Borrow Books (Many-to-Many Association)
            System.out.println("\n>>> 3. Executing Borrow Operations (Many-to-Many Association)...");
            System.out.println("Student 1 borrows Book 1 and Book 2...");
            libraryService.borrowBook(s1.getId(), b1.getId());
            libraryService.borrowBook(s1.getId(), b2.getId());

            System.out.println("Student 2 also borrows Book 1 (shared book resource)...");
            libraryService.borrowBook(s2.getId(), b1.getId());

            // 4. Verification Report
            System.out.println("\n>>> 4. Verifying Borrow Status from Database...");
            Student s1Details = libraryService.getStudentDetails(s1.getId()).orElseThrow();
            System.out.println("Student: " + s1Details.getFirstName() + " " + s1Details.getLastName());
            System.out.println("Borrowed Books (" + s1Details.getBooks().size() + "):");
            for (Book b : s1Details.getBooks()) {
                System.out.println("   * [ISBN: " + b.getIsbn() + "] " + b.getTitle() + " - " + b.getAuthor());
            }

            // 5. Return Book
            System.out.println("\n>>> 5. Returning Book 2 for Student 1...");
            libraryService.returnBook(s1.getId(), b2.getId());

            Student s1AfterReturn = libraryService.getStudentDetails(s1.getId()).orElseThrow();
            System.out.println("Student 1 remaining borrowed books count: " + s1AfterReturn.getBooks().size());

            System.out.println("\n============================================================================");
            System.out.println("   SLOT 29 ARCHITECTURE CALL CHAIN DEMONSTRATION SUCCEEDED!                 ");
            System.out.println("============================================================================");

        } catch (Exception e) {
            System.err.println("Execution failed: " + e.getMessage());
            e.printStackTrace();
        } finally {
            HibernateUtil.shutdown();
        }
    }
}
