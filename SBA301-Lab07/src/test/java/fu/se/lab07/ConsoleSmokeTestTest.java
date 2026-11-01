package fu.se.lab07;

import fu.se.lab07.app.ConsoleSmokeTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

public class ConsoleSmokeTestTest {

    @Test
    @DisplayName("Run ConsoleSmokeTest suite via JUnit")
    void runSmokeTest() {
        assertDoesNotThrow(() -> ConsoleSmokeTest.main(new String[0]));
    }
}
