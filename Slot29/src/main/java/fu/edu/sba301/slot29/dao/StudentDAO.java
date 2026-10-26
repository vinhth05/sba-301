package fu.edu.sba301.slot29.dao;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import fu.edu.sba301.slot29.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;
import java.util.Optional;

public class StudentDAO {

    public void save(Student student) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            session.persist(student);
            tx.commit();
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("StudentDAO: Error persisting student", e);
        }
    }

    public Student update(Student student) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Student merged = session.merge(student);
            tx.commit();
            return merged;
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("StudentDAO: Error updating student", e);
        }
    }

    public void addAssociation(Long studentId, Long bookId) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Student s = session.get(Student.class, studentId);
            Book b = session.get(Book.class, bookId);
            if (s != null && b != null) {
                s.getBooks().add(b);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("StudentDAO: Error adding book association", e);
        }
    }

    public void removeAssociation(Long studentId, Long bookId) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Student s = session.get(Student.class, studentId);
            Book b = session.get(Book.class, bookId);
            if (s != null && b != null) {
                s.getBooks().remove(b);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("StudentDAO: Error removing book association", e);
        }
    }

    public Optional<Student> findById(Long id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            Student s = session.get(Student.class, id);
            return Optional.ofNullable(s);
        }
    }

    public Optional<Student> findByIdWithBooks(Long id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery(
                    "SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.books WHERE s.id = :id", Student.class)
                    .setParameter("id", id)
                    .uniqueResultOptional();
        }
    }

    public Optional<Student> findByEmail(String email) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("FROM Student s WHERE s.email = :email", Student.class)
                    .setParameter("email", email)
                    .uniqueResultOptional();
        }
    }

    public List<Student> findAll() {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.createQuery("FROM Student s ORDER BY s.id ASC", Student.class).list();
        }
    }

    public void delete(Long id) {
        Transaction tx = null;
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            tx = session.beginTransaction();
            Student s = session.get(Student.class, id);
            if (s != null) {
                s.getBooks().clear();
                session.remove(s);
            }
            tx.commit();
        } catch (Exception e) {
            if (tx != null && tx.isActive()) tx.rollback();
            throw new RuntimeException("StudentDAO: Error deleting student", e);
        }
    }
}
