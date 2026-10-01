package com.fpt.sba301.slot14.exception;

public class NewsNotFoundException extends RuntimeException {
    public NewsNotFoundException(Long id) {
        super("News not found with id = " + id);
    }
}
