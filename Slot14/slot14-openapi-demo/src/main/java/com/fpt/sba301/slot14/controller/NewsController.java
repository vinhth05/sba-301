package com.fpt.sba301.slot14.controller;

import com.fpt.sba301.slot14.model.News;
import com.fpt.sba301.slot14.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@Tag(name = "News", description = "CRUD operations for news articles in FUNewsManagementSystem")
@RestController
@RequestMapping("/api/news")
public class NewsController {

    private final NewsService service;

    public NewsController(NewsService service) {
        this.service = service;
    }

    @Operation(summary = "Get all news", description = "Returns all news articles in the system")
    @ApiResponse(responseCode = "200", description = "News list returned")
    @GetMapping
    public List<News> getAll() {
        return service.findAll();
    }

    @Operation(summary = "Get news by id", description = "Finds a specific news article by unique ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "News article found"),
            @ApiResponse(responseCode = "404", description = "News article not found")
    })
    @GetMapping("/{id}")
    public News getById(
            @Parameter(description = "News article id", example = "1", required = true)
            @PathVariable Long id
    ) {
        return service.findById(id);
    }

    @Operation(summary = "Create news article", description = "Creates a new publication article and returns location URI")
    @ApiResponse(responseCode = "201", description = "News article successfully created")
    @PostMapping
    public ResponseEntity<News> create(
            @RequestBody News input
    ) {
        News created = service.create(input);
        URI location = URI.create("/api/news/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Update news article", description = "Replaces the content of an existing news article")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "News article updated"),
            @ApiResponse(responseCode = "404", description = "News article not found")
    })
    @PutMapping("/{id}")
    public News update(
            @PathVariable Long id,
            @RequestBody News input
    ) {
        return service.update(id, input);
    }

    @Operation(summary = "Delete news article", description = "Deletes a news article by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "News deleted successfully"),
            @ApiResponse(responseCode = "404", description = "News article not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
