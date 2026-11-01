package fu.se.lab07.ui;

import fu.se.lab07.dao.StudentDAO;
import fu.se.lab07.repository.IStudentRepository;
import fu.se.lab07.repository.StudentRepository;
import fu.se.lab07.service.IStudentService;
import fu.se.lab07.service.StudentService;
import fu.se.lab07.ui.controller.LoginController;
import fu.se.lab07.util.HibernateUtil;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.hibernate.SessionFactory;

public class StudentApplication extends Application {

    private IStudentService studentService;

    @Override
    public void init() throws Exception {
        super.init();
        // Composition Root: Khởi tạo Hibernate SessionFactory và chuỗi dependency
        SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
        StudentDAO studentDAO = new StudentDAO(sessionFactory);
        IStudentRepository studentRepository = new StudentRepository(studentDAO);
        this.studentService = new StudentService(studentRepository);
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/fu/se/lab07/ui/LoginGUI.fxml")
        );
        Parent root = loader.load();

        LoginController loginController = loader.getController();
        loginController.setStudentService(studentService);

        Scene scene = new Scene(root, 440, 440);
        primaryStage.setTitle("Library Department - Login");
        primaryStage.setScene(scene);
        primaryStage.setResizable(false);
        primaryStage.show();
    }

    @Override
    public void stop() throws Exception {
        super.stop();
        // Giải phóng SessionFactory khi ứng dụng JavaFX đóng
        HibernateUtil.shutdown();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
