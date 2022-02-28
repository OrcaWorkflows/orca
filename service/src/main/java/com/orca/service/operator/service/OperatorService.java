package com.orca.service.operator.service;

import com.orca.service.operator.dto.OperatorDTO;
import com.orca.service.operator.model.Operator;
import com.orca.service.operator.model.OperatorCategory;
import com.orca.service.operator.model.RequiredOperatorVariable;
import com.orca.service.operator.repository.OperatorCategoryRepository;
import com.orca.service.operator.repository.OperatorRepository;
import com.orca.service.operator.repository.RequiredVariableRepository;
import com.orca.service.security.exception.OrcaServiceRuntimeException;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
public class OperatorService {
    @Autowired
    OperatorRepository operatorRepository;

    @Autowired
    OperatorCategoryRepository operatorCategoryRepository;

    @Autowired
    RequiredVariableRepository requiredVariableRepository;

    public List<Operator> getAllOperators() {
        return operatorRepository.findAll();
    }
    public List<OperatorDTO> getAllOperatorDTOs() {
        return operatorRepository.findAll().stream().map(Operator::toDTO).collect(Collectors.toList());
    }

    public Operator getOperatorByName(String name) {
        return operatorRepository.findByName(name);
    }

    public List<OperatorDTO> getAllOperatorDTOsByCategory(String category) {
        Optional<OperatorCategory> operatorCategory = operatorCategoryRepository.findByCategory(category);
        if (operatorCategory.isPresent()) {
            return operatorRepository.findAllByCategory(operatorCategory.get()).stream().map(Operator::toDTO).collect(Collectors.toList());
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("There is no category with name " + category)
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public List<RequiredOperatorVariable> getAllRequiredVariables() {
        return requiredVariableRepository.findAll();
    }

    public List<RequiredOperatorVariable> getAllRequiredVariablesByOperator(Operator operator) {
        return requiredVariableRepository.findAllByOperator(operator);
    }

    public List<String> getAllOperatorCategories() {
        return operatorCategoryRepository.findAll().stream().map(OperatorCategory::getCategory).collect(Collectors.toList());
    }

}
