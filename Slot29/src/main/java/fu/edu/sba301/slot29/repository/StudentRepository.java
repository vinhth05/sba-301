package fu.edu.sba301.slot29.repository;

import fu.edu.sba301.slot29.dao.StudentDAO;
import fu.edu.sba301.slot29.entity.Student;

import java.util.List;
import java.util.Optional;

public class StudentRepository {

    private final StudentDAO studentDAO;

    public StudentRepository() {
        this.studentDAO = new StudentDAO();
    }

    public StudentRepository(StudentDAO studentDAO) {
        this.studentDAO = studentDAO;
    }

    public void create(Student student) {
        studentDAO.save(student);
    }

    public Student update(Student student) {
        return studentDAO.update(student);
    }

    public void associateBook(Long studentId, Long bookId) {
        studentDAO.addAssociation(studentId, bookId);
    }

    public void disassociateBook(Long studentId, Long bookId) {
        studentDAO.removeAssociation(studentId, bookId);
    }

    public Optional<Student> getById(Long id) {
        return studentDAO.findById(id);
    }

    public Optional<Student> getByIdWithBooks(Long id) {
        return studentDAO.findByIdWithBooks(id);
    }

    public Optional<Student> getByEmail(String email) {
        return studentDAO.findByEmail(email);
    }

    public List<Student> getAll() {
        return studentDAO.findAll();
    }

    public void remove(Long id) {
        studentDAO.delete(id);
    }
}
