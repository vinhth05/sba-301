package fu.se.lab07;

import fu.se.lab07.ui.StudentApplication;

/**
 * Entry point launcher for JavaFX application.
 * Bypasses JavaFX runtime component checks when launching from IDE or non-modular setups.
 */
public class Launcher {
    public static void main(String[] args) {
        StudentApplication.main(args);
    }
}
