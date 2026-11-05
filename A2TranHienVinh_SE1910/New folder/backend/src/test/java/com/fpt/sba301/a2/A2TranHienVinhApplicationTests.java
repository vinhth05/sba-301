/**
 * Student Name: Trần Hiển Vinh
 * Student ID: CE190881
 * Class: SE1910
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 */
package com.fpt.sba301.a2;

import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.service.AuthService;
import com.fpt.sba301.a2.service.CategoryService;
import com.fpt.sba301.a2.service.SystemAccountService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class A2TranHienVinhApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private SystemAccountService accountService;

    @Autowired
    private CategoryService categoryService;

    @Test
    @DisplayName("Admin Login successfully with Steve Paris credentials")
    void testAdminLogin() {
        LoginRequest req = new LoginRequest("SteveParis@FUNewsManagement.org", "@1");
        LoginResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals(1, res.getAccountRole());
        assertEquals("Steve Paris", res.getAccountName());
    }

    @Test
    @DisplayName("Staff Login successfully with Emma William credentials")
    void testStaffLogin() {
        LoginRequest req = new LoginRequest("EmmaWilliam@FUNewsManagement.org", "@1");
        LoginResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals(2, res.getAccountRole());
        assertEquals("Emma William", res.getAccountName());
    }

    @Test
    @DisplayName("Business Rule: Cannot delete account that has created news articles")
    void testCannotDeleteAccountWithArticles() {
        // Steve Paris (ID 1) created news articles in seed data
        assertThrows(BusinessConflictException.class, () -> {
            accountService.deleteAccount((short) 1);
        });
    }

    @Test
    @DisplayName("Business Rule: Cannot delete category that contains news articles")
    void testCannotDeleteCategoryWithArticles() {
        // Category 1 is associated with news articles in seed data
        assertThrows(BusinessConflictException.class, () -> {
            categoryService.deleteCategory((short) 1);
        });
    }
}
