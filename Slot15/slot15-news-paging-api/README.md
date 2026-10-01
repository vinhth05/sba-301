# News API with Versioning, Paging & Sorting - SBA301 Slot 15

## Environment
- Java 21 / 25 LTS
- Spring Boot 3.3.4
- Spring Data JPA + H2 in-memory Database
- Maven

## Features
- **4 API Versioning Strategies**:
  - Path / URI: `GET /api/v1/news`, `GET /api/v2/news`
  - Query parameter: `GET /api/news/version?version=1`
  - Custom header: `GET /api/news/version` with header `X-API-Version: 1`
  - Media type / Accept: `GET /api/news/version` with `Accept: application/vnd.funews.v1+json`
- **Paging & Sorting**:
  - `GET /api/news?page=0&size=10&sort=publishDate,desc` (returns `Page<News>` with full totalElements/totalPages)
  - `GET /api/news/slice?page=0&size=10` (returns `Slice<News>` for mobile/infinite scroll without costly count query)
  - `GET /api/news/safe` (with guardrails protecting max page size and whitelisting sort fields: `id`, `title`, `publishDate`, `active`)
- **Automated In-Memory Database**:
  - Embedded H2 database (`jdbc:h2:mem:slot15db`)
  - `CommandLineRunner` populating 35 mock news records on startup

## Running the Application
```bash
./mvnw spring-boot:run
# on Windows:
mvnw.cmd spring-boot:run
```
