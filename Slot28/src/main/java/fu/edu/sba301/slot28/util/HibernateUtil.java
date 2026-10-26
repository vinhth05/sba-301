package fu.edu.sba301.slot28.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public final class HibernateUtil {

    private static SessionFactory sessionFactory;

    public static SessionFactory buildSessionFactory(String configResource) {
        try {
            Configuration configuration = new Configuration();
            configuration.configure(configResource);
            return configuration.buildSessionFactory();
        } catch (Exception ex) {
            System.err.println("Could not build SessionFactory with " + configResource + ": " + ex.getMessage());
            throw new RuntimeException(ex);
        }
    }

    public static synchronized SessionFactory getSessionFactory() {
        if (sessionFactory == null || sessionFactory.isClosed()) {
            try {
                sessionFactory = buildSessionFactory("hibernate.cfg.xml");
            } catch (Exception e) {
                System.out.println("Falling back to hibernate-test.cfg.xml (H2 in-memory)...");
                sessionFactory = buildSessionFactory("hibernate-test.cfg.xml");
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
