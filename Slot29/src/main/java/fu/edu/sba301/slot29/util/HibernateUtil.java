package fu.edu.sba301.slot29.util;

import fu.edu.sba301.slot29.entity.Book;
import fu.edu.sba301.slot29.entity.Student;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.io.InputStream;
import java.util.Properties;

public final class HibernateUtil {

    private static SessionFactory sessionFactory;

    /**
     * Build SessionFactory from either application.properties or XML configuration file.
     *
     * @param configResource resource file name (e.g. "application.properties" or "hibernate.cfg.xml")
     * @return configured SessionFactory
     */
    public static SessionFactory buildSessionFactory(String configResource) {
        try {
            Configuration configuration = new Configuration();

            if (configResource.endsWith(".properties")) {
                Properties properties = new Properties();
                try (InputStream input = HibernateUtil.class.getClassLoader().getResourceAsStream(configResource)) {
                    if (input == null) {
                        throw new IllegalArgumentException("Resource not found: " + configResource);
                    }
                    properties.load(input);
                }
                configuration.setProperties(properties);

                // Register Annotated Entity Classes
                configuration.addAnnotatedClass(Student.class);
                configuration.addAnnotatedClass(Book.class);
            } else {
                configuration.configure(configResource);
            }

            return configuration.buildSessionFactory();
        } catch (Exception ex) {
            System.err.println("Failed to build SessionFactory with " + configResource + ": " + ex.getMessage());
            throw new RuntimeException(ex);
        }
    }

    public static synchronized SessionFactory getSessionFactory() {
        if (sessionFactory == null || sessionFactory.isClosed()) {
            try {
                // Default: Load database configuration from application.properties
                sessionFactory = buildSessionFactory("application.properties");
            } catch (Exception e) {
                System.out.println("SQL Server not reachable from application.properties, falling back to application-test.properties (H2)...");
                sessionFactory = buildSessionFactory("application-test.properties");
            }
        }
        return sessionFactory;
    }

    public static synchronized void setSessionFactory(SessionFactory customFactory) {
        sessionFactory = customFactory;
    }

    public static synchronized void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
        }
    }

    private HibernateUtil() {}
}
