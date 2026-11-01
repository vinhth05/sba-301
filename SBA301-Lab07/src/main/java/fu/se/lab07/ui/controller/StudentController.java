package fu.se.lab07.ui.controller;

import fu.se.lab07.entity.Student;
import fu.se.lab07.service.IStudentService;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;

public class StudentController {

    @FXML private TextField txtEmail;
    @FXML private PasswordField txtPassword;
    @FXML private TextField txtFirstName;
    @FXML private TextField txtLastName;
    @FXML private TextField txtMarks;

    @FXML private TableView<Student> tblStudents;
    @FXML private TableColumn<Student, Integer> colId;
    @FXML private TableColumn<Student, String> colEmail;
    @FXML private TableColumn<Student, String> colFirstName;
    @FXML private TableColumn<Student, String> colLastName;
    @FXML private TableColumn<Student, Double> colMarks;
    @FXML private Label lblRecordCount;

    private final ObservableList<Student> data = FXCollections.observableArrayList();
    private IStudentService studentService;
    private Integer selectedStudentId;

    @FXML
    private void initialize() {
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colEmail.setCellValueFactory(new PropertyValueFactory<>("email"));
        colFirstName.setCellValueFactory(new PropertyValueFactory<>("firstName"));
        colLastName.setCellValueFactory(new PropertyValueFactory<>("lastName"));
        colMarks.setCellValueFactory(new PropertyValueFactory<>("marks"));

        tblStudents.setItems(data);

        // Lấy StudentID và điền form khi click chọn dòng trên TableView
        tblStudents.getSelectionModel().selectedItemProperty()
                .addListener((obs, oldV, selected) -> populateForm(selected));
    }

    public void setStudentService(IStudentService service) {
        this.studentService = service;
        refreshTable();
    }

    private void refreshTable() {
        if (studentService != null) {
            data.setAll(studentService.getAll());
            if (lblRecordCount != null) {
                lblRecordCount.setText("Total: " + data.size() + " student(s)");
            }
        }
    }

    private void populateForm(Student s) {
        if (s == null) return;
        selectedStudentId = s.getId();
        txtEmail.setText(s.getEmail());
        txtPassword.setText(s.getPassword());
        txtFirstName.setText(s.getFirstName());
        txtLastName.setText(s.getLastName());
        txtMarks.setText(Double.toString(s.getMarks()));
    }

    private Student readForm() {
        String email = txtEmail.getText() != null ? txtEmail.getText().trim() : "";
        String password = txtPassword.getText() != null ? txtPassword.getText() : "";
        String first = txtFirstName.getText() != null ? txtFirstName.getText().trim() : "";
        String last = txtLastName.getText() != null ? txtLastName.getText().trim() : "";
        String marksStr = txtMarks.getText() != null ? txtMarks.getText().trim() : "";

        if (email.isBlank() || password.isBlank() || first.isBlank() || last.isBlank()) {
            throw new IllegalArgumentException("All text fields are required.");
        }

        double marks;
        try {
            marks = Double.parseDouble(marksStr);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Marks must be a valid numeric value.");
        }

        if (marks < 0.0 || marks > 10.0) {
            throw new IllegalArgumentException("Marks must be between 0.0 and 10.0.");
        }

        Student s = new Student();
        s.setEmail(email);
        s.setPassword(password);
        s.setFirstName(first);
        s.setLastName(last);
        s.setMarks(marks);
        return s;
    }

    @FXML
    private void handleCreate() {
        if (studentService == null) {
            showError("StudentService is not configured.");
            return;
        }
        try {
            Student student = readForm();
            studentService.create(student);
            refreshTable();
            clearForm();
            showInfo("Student created successfully!");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleUpdate() {
        if (studentService == null) {
            showError("StudentService is not configured.");
            return;
        }
        if (selectedStudentId == null) {
            showError("Please select a student from the table first.");
            return;
        }
        try {
            Student s = readForm();
            s.setId(selectedStudentId);
            studentService.update(s);
            refreshTable();
            clearForm();
            showInfo("Student updated successfully!");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleDelete() {
        if (studentService == null) {
            showError("StudentService is not configured.");
            return;
        }
        if (selectedStudentId == null) {
            showError("Please select a student from the table first.");
            return;
        }
        if (!confirm("Are you sure you want to delete student ID " + selectedStudentId + "?")) {
            return;
        }
        try {
            studentService.delete(selectedStudentId);
            refreshTable();
            clearForm();
            showInfo("Student deleted successfully!");
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleClear() {
        clearForm();
    }

    private void clearForm() {
        selectedStudentId = null;
        txtEmail.clear();
        txtPassword.clear();
        txtFirstName.clear();
        txtLastName.clear();
        txtMarks.clear();
        tblStudents.getSelectionModel().clearSelection();
        txtEmail.requestFocus();
    }

    private void showInfo(String message) {
        Alert alert = new Alert(Alert.AlertType.INFORMATION, message, ButtonType.OK);
        alert.setTitle("Information");
        alert.setHeaderText(null);
        alert.showAndWait();
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR, message, ButtonType.OK);
        alert.setTitle("Error");
        alert.setHeaderText(null);
        alert.showAndWait();
    }

    private boolean confirm(String message) {
        Alert alert = new Alert(Alert.AlertType.CONFIRMATION, message, ButtonType.YES, ButtonType.NO);
        alert.setTitle("Confirmation");
        alert.setHeaderText(null);
        return alert.showAndWait().orElse(ButtonType.NO) == ButtonType.YES;
    }
}
