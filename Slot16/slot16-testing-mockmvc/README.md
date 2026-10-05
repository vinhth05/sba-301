# REST API Testing with MockMvc & Unit Tests - SBA301 Slot 16

## Environment
- Java 21 / 25 LTS
- Spring Boot 3.3.4
- JUnit 5, Mockito, AssertJ, MockMvc
- Maven

## Testing Taxonomy & Boundaries Covered
1. **Web Slice Test (`@WebMvcTest`)**:
   - `EmployeeControllerTest.java`: Uses `MockMvc` to test controller routing, status codes (`200 OK`, `201 Created`, `404 Not Found`), Location headers, and jsonPath evaluation without booting a live HTTP server.
2. **Service Unit Test (JUnit 5 + Mockito)**:
   - `EmployeeServiceUnitTest.java`: Uses `@Mock` and `@InjectMocks` with `when(...).thenReturn(...)` and `verify(...)` to isolate business and delegation logic.
3. **Core In-memory Repository Test (Plain JUnit 5)**:
   - `EmployeeRepositoryTest.java`: Direct unit tests validating create, findById, and pagination logic against in-memory storage.
4. **JPA Slice Test (`@DataJpaTest`)**:
   - `JpaEmployeeRepositoryTest.java`: Tests database round-trips and custom derived queries against embedded H2.
5. **Context Integration Smoke Test (`@SpringBootTest`)**:
   - `EmployeeServiceIntegrationTest.java`: Verifies full application context bootstrap and dependency injection.

## Running Tests
```bash
# Run all tests
./mvnw test
# or on Windows:
mvnw.cmd test

# Run a single test class
./mvnw -Dtest=EmployeeControllerTest test
```
