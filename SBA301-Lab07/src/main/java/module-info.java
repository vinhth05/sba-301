module fu.se.lab07 {
    requires javafx.controls;
    requires javafx.fxml;
    requires jakarta.persistence;
    requires org.hibernate.orm.core;
    requires java.naming;
    requires java.sql;

    exports fu.se.lab07;
    exports fu.se.lab07.ui;
    exports fu.se.lab07.entity;
    exports fu.se.lab07.service;
    exports fu.se.lab07.repository;
    exports fu.se.lab07.dao;

    opens fu.se.lab07.ui to javafx.fxml;
    opens fu.se.lab07.ui.controller to javafx.fxml;
    opens fu.se.lab07.entity to org.hibernate.orm.core, javafx.base;
}
