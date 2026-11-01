package fu.se.lab07.service;

import fu.se.lab07.entity.Student;

import java.util.List;

public interface IStudentService {
    Student create(Student student);
    List<Student> getAll();
    Student getById(Integer id);
    Student getByEmail(String email);
    Student update(Student student);
    void delete(Integer id);
    Student login(String email, String password);
}
