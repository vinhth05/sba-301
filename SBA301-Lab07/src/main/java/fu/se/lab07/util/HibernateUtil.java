package fu.se.lab07.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public final class HibernateUtil {

    private static SessionFactory sessionFactory = build();

    private static SessionFactory build() {
        try {
            return new Configuration()
                    .configure("hibernate.cfg.xml")
                    .buildSessionFactory();
        } catch (Throwable ex) {
            System.err.println("Initial SessionFactory creation failed: " + ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static synchronized SessionFactory getSessionFactory() {
        if (sessionFactory == null || sessionFactory.isClosed()) {
            sessionFactory = build();
        }
        return sessionFactory;
    }

    public static synchronized void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
        }
    }

    private HibernateUtil() {
    }
}
