package com.orca.service.security.exception;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;

@Builder
@Getter
@Setter
@Log4j2
public class OrcaServiceRuntimeException extends RuntimeException {
    private final String message;
    private final HttpStatus httpStatus;
    private final String[] optionalObjects;
    private final Exception rootException;
}
