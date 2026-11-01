package fu.se.lab07.service;

import fu.se.lab07.entity.Student;
import fu.se.lab07.repository.IStudentRepository;

import java.util.List;
import java.util.Optional;

public class StudentService implements IStudentService {

    private final IStudentRepository repository;

    public StudentService(IStudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Student create(Student student) {
        validate(student);
        // Kiểm tra trùng email khi tạo mới
        Optional<Student> existing = repository.findByEmail(student.getEmail().trim());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + student.getEmail());
        }
        return repository.save(student);
    }

    @Override
    public List<Student> getAll() {
        return repository.findAll();
    }

    @Override
    public Student getById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
    }

    @Override
    public Student getByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        return repository.findByEmail(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with email: " + email));
    }

    @Override
    public Student update(Student student) {
        validate(student);
        if (student.getId() == null) {
            throw new IllegalArgumentException("Student ID is required for update");
        }
        // Kiểm tra tồn tại
        getById(student.getId());

        // Kiểm tra trùng email với student khác
        Optional<Student> existingWithEmail = repository.findByEmail(student.getEmail().trim());
        if (existingWithEmail.isPresent() && !existingWithEmail.get().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Email already in use by another student: " + student.getEmail());
        }

        return repository.update(student);
    }

    @Override
    public void delete(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        boolean deleted = repository.delete(id);
        if (!deleted) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
    }

    @Override
    public Student login(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        Student student = repository.findByEmail(email.trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!student.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return student;
    }

    private void validate(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student data is required");
        }
        if (student.getEmail() == null || student.getEmail().trim().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (student.getPassword() == null || student.getPassword().trim().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (student.getFirstName() == null || student.getFirstName().trim().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (student.getLastName() == null || student.getLastName().trim().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (student.getMarks() < 0.0 || student.getMarks() > 10.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 10.0");
        }
    }
}
