package fu.edu.sba301.slot28.repository;

import fu.edu.sba301.slot28.entity.Student;
import fu.edu.sba301.slot28.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.List;
import java.util.Optional;

public class StudentRepository {

    public Student save(Student student) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            if (student.getId() == null) {
                session.persist(student);
            } else {
                student = session.merge(student);
            }
            tx.commit();
            return student;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException("Error saving student: " + e.getMessage(), e);
        }
    }

    public Optional<Student> findById(Long id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Student student = session.get(Student.class, id);
            return Optional.ofNullable(student);
        }
    }

    public Optional<Student> findByEmail(String email) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Student> query = session.createQuery(
                    "FROM Student s WHERE s.email = :email", Student.class);
            query.setParameter("email", email);
            return query.uniqueResultOptional();
        }
    }

    public List<Student> findAll() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("FROM Student s ORDER BY s.id ASC", Student.class).list();
        }
    }

    public List<Student> findByMinMarks(Double minMarks) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Query<Student> query = session.createQuery(
                    "FROM Student s WHERE s.marks >= :minMarks ORDER BY s.marks DESC", Student.class);
            query.setParameter("minMarks", minMarks);
            return query.list();
        }
    }

    public void delete(Student student) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Student managed = session.get(Student.class, student.getId());
            if (managed != null) {
                session.remove(managed);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx != null && tx.isActive()) {
                tx.rollback();
            }
            throw new RuntimeException("Error deleting student: " + e.getMessage(), e);
        }
    }
}
