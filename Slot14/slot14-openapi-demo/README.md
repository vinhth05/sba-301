# Documenting REST Services with OpenAPI & Swagger - SBA301 Slot 14

## Overview
This project demonstrates OpenAPI 3 specification integration using `springdoc-openapi-starter-webmvc-ui` in Spring Boot 3.

## Endpoints Documented
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec**: `http://localhost:8080/v3/api-docs`

## Documented Resources
1. **Employees (`/api/employees`)**:
   - `GET /api/employees` - List all employees
   - `GET /api/employees/{id}` - Lookup employee by ID (with 200/404 documented)
2. **News (`/api/news`)**:
   - `GET /api/news` - Get all news
   - `GET /api/news/{id}` - Get news by ID
   - `POST /api/news` - Create news (returns 201 Created with Location header)
   - `PUT /api/news/{id}` - Update news (200 OK)
   - `DELETE /api/news/{id}` - Delete news (204 No Content)

## Key Annotations Used
- `@Tag`: Groups API operations by domain resource.
- `@Operation`: Adds concise summary and description to endpoints.
- `@ApiResponse` / `@ApiResponses`: Specifies possible HTTP status codes and schemas.
- `@Parameter`: Adds documentation and examples for route/query parameters.
- `@Schema`: Documents model attributes and validation requirements on DTOs and models.
- `@OpenAPIDefinition` / `OpenAPI` Bean: Configures overall API title, contact, version, and server details.
