package com.orca.service.security.exception;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletResponse;
import javax.validation.UnexpectedTypeException;
import javax.validation.ValidationException;
import java.io.IOException;
import java.util.Map;


@ControllerAdvice(basePackageClasses = {})
@Log4j2
public class GlobalExceptionHandlerController {


    public static final String ACCESS_DENIED = "Access denied";
    public static final String WENT_WRONG = "Something went wrong";
    public static final String RESOURCE_NOT_FOUND = "Resource not found.";
    public static final String UNEXPECTED_TYPE_REQUEST = "Unexpected type on Bad Request.";
    public static final String VALIDATION_EXCEPTION_ON_REQUEST = "Validation exception on Bad Request.";
    public static final String TRANSACTION_SYSTEM_EXCEPTION = "Runtime exception. Maybe a Bad Request ? ";

    @Bean
    public ErrorAttributes errorAttributes() {
        // Hide exception field in the return object
        return new DefaultErrorAttributes() {
            @Override
            public Map<String, Object> getErrorAttributes(WebRequest requestAttributes, boolean includeStackTrace) {
                Map<String, Object> errorAttributes = super.getErrorAttributes(requestAttributes, includeStackTrace);
                errorAttributes.remove("exception");
                return errorAttributes;
            }
        };
    }

    private OrcaServiceRuntimeException getRootException(OrcaServiceRuntimeException exception) {
        if (exception.getRootException() != null) {
            if (exception.getRootException() instanceof OrcaServiceRuntimeException)
                return getRootException((OrcaServiceRuntimeException) exception.getRootException());
            else return exception;
        } else
            return exception;
    }

    @ExceptionHandler(OrcaServiceRuntimeException.class)
    public void handleAccessRuntimeException(HttpServletResponse res, OrcaServiceRuntimeException ex) throws IOException {
        res.sendError(getRootException(ex).getHttpStatus().value(), getRootException(ex).getMessage());
    }

    @ExceptionHandler(ResourceAccessException.class)
    public void handleResourceNotFoundException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.NOT_FOUND.value(), RESOURCE_NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public void handleAccessDeniedException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.FORBIDDEN.value(), ACCESS_DENIED);
    }

    @ExceptionHandler(UnexpectedTypeException.class)
    public void handleUnexpectedTypeException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.BAD_REQUEST.value(), UNEXPECTED_TYPE_REQUEST);
    }

    @ExceptionHandler(ValidationException.class)
    public void handleValidationException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.BAD_REQUEST.value(), VALIDATION_EXCEPTION_ON_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public void handleTransactionSystemException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.BAD_REQUEST.value(), TRANSACTION_SYSTEM_EXCEPTION);
    }

    @ExceptionHandler(Exception.class)
    public void handleException(HttpServletResponse res) throws IOException {
        res.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), WENT_WRONG);
    }

}