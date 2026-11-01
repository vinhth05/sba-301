package fu.se.lab07.ui.controller;

import fu.se.lab07.entity.Student;
import fu.se.lab07.service.IStudentService;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.ButtonType;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;

public class LoginController {

    @FXML private TextField txtEmail;
    @FXML private PasswordField txtPassword;

    private IStudentService studentService;

    public void setStudentService(IStudentService service) {
        this.studentService = service;
    }

    @FXML
    private void handleLogin() {
        if (studentService == null) {
            showError("StudentService is not configured.");
            return;
        }

        String email = txtEmail.getText() != null ? txtEmail.getText().trim() : "";
        String password = txtPassword.getText() != null ? txtPassword.getText() : "";

        try {
            Student loggedInUser = studentService.login(email, password);
            openStudentManagement(loggedInUser);
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleCancel() {
        if (txtEmail != null && txtEmail.getScene() != null) {
            Stage stage = (Stage) txtEmail.getScene().getWindow();
            stage.close();
        }
    }

    private void openStudentManagement(Student loggedIn) throws IOException {
        FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/fu/se/lab07/ui/student-view.fxml")
        );
        Parent root = loader.load();

        StudentController controller = loader.getController();
        controller.setStudentService(studentService);

        Stage stage = (Stage) txtEmail.getScene().getWindow();
        Scene scene = new Scene(root, 900, 700);
        stage.setScene(scene);
        stage.setTitle("Library Department - Student Management (Logged in as: " + loggedIn.getEmail() + ")");
        stage.centerOnScreen();
        stage.show();
    }

    private void showError(String message) {
        Alert alert = new Alert(Alert.AlertType.ERROR, message, ButtonType.OK);
        alert.setTitle("Login Failed");
        alert.setHeaderText(null);
        alert.showAndWait();
    }
}
