package fu.se.lab07.repository;

import fu.se.lab07.entity.Student;

import java.util.List;
import java.util.Optional;

public interface IStudentRepository {
    Student save(Student student);
    List<Student> findAll();
    Optional<Student> findById(Integer id);
    Optional<Student> findByEmail(String email);
    Student update(Student student);
    boolean delete(Integer id);
}
