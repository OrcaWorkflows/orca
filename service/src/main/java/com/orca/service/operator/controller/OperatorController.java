package com.orca.service.operator.controller;

import com.orca.service.operator.dto.OperatorDTO;
import com.orca.service.operator.model.OperatorCategory;
import com.orca.service.operator.service.OperatorService;
import io.swagger.annotations.Api;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = "api")
@Validated
@Log4j2
public class OperatorController {
    @Autowired
    private OperatorService operatorService;

    @GetMapping("/operator")
    public List<OperatorDTO> getAllOperators() {
        return operatorService.getAllOperatorDTOs();
    }

    @GetMapping("/operator/{categoryName}")
    public List<OperatorDTO> getAllOperatorsByCategory(@PathVariable String categoryName) {
        return operatorService.getAllOperatorDTOsByCategory(categoryName);
    }

    @GetMapping("/operator/category")
    public List<String> getAllCategories() {
        return operatorService.getAllOperatorCategories();
    }

}
