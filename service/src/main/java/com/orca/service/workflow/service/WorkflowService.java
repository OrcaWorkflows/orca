package com.orca.service.workflow.service;

import com.orca.service.general.config.ConstantsConfig;
import com.orca.service.general.service.GenericRequest;
import com.orca.service.operator.model.Operator;
import com.orca.service.operator.model.RequiredOperatorVariable;
import com.orca.service.operator.service.OperatorService;
import com.orca.service.security.exception.OrcaServiceRuntimeException;
import com.orca.service.security.services.MyUserDetails;
import com.orca.service.util.GlobalConfig;
import com.orca.service.util.Utilities;
import com.orca.service.workflow.dto.*;
import com.orca.service.workflow.model.ArgoWorkflow;
import com.orca.service.workflow.model.Schedule;
import com.orca.service.workflow.model.Workflow;
import com.orca.service.workflow.repository.ArgoWorkflowRepository;
import com.orca.service.workflow.repository.ScheduleRepository;
import com.orca.service.workflow.repository.WorkflowRepository;
import lombok.extern.log4j.Log4j2;
import org.apache.tomcat.util.bcel.Const;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Log4j2
public class WorkflowService {
    @Autowired
    GenericRequest genericRequest;

    @Autowired
    OperatorService operatorService;

    @Autowired
    WorkflowRepository workflowRepository;

    @Autowired
    ArgoWorkflowRepository argoWorkflowRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    MyUserDetails myUserDetails;

    private boolean checkAuthorization(Integer workflowID) {
        Integer currentUserId = myUserDetails.getCurrentUser().getId();
        Optional<Workflow> workflow = workflowRepository.findById(workflowID);
        if (workflow.isPresent()) {
            return workflow.get().getUserId().equals(currentUserId);
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Requested workflow id does not exist.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public WorkflowPageDTO getWorkflow(Integer page, Integer pageSize, String sortBy) {
        Integer currentUsedID = myUserDetails.getCurrentUser().getId();
        Pageable firstPageWithTwoElements;
        if (sortBy != null) {
            firstPageWithTwoElements = PageRequest.of(page, pageSize, Sort.by(sortBy));
        }
        else {
            firstPageWithTwoElements = PageRequest.of(page, pageSize);
        }
        Page<Workflow> workflowsPage = workflowRepository.findAllByUserId(currentUsedID, firstPageWithTwoElements);
        List<WorkflowDTO> workflows = workflowsPage.stream().map(doc -> Workflow.toDTO(doc, getLatestArgoWorkflowName(doc))).collect(Collectors.toList());
        return new WorkflowPageDTO(workflows, workflowsPage.getTotalElements());
    }

    public WorkflowDTO getWorkflowByID(Integer id) {
        if (checkAuthorization(id)) {
            Optional<Workflow> workflow = workflowRepository.findById(id);
            if (workflow.isPresent()) {
                return Workflow.toDTO(workflow.get(), getLatestArgoWorkflowName(workflow.get()));
            }
            else {
                throw OrcaServiceRuntimeException.builder()
                        .message("Requested workflow id does not exist.")
                        .httpStatus(HttpStatus.NOT_FOUND)
                        .build();
            }
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Do not have the authorization.")
                    .httpStatus(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }

    public WorkflowDTO createOrUpdateWorkflow(WorkflowDTO workflowDTO) {
        Workflow workflow = WorkflowDTO.toModel(workflowDTO);
        Workflow newWorkflow;

        if (workflowDTO.getId() != null && workflowRepository.existsById(workflow.getId())) { // Update
            Workflow existingWorkflow = workflowRepository.findById(workflowDTO.getId()).get();
            existingWorkflow.setProperty(workflowDTO.getProperty());
            existingWorkflow.setUpdatedAt(new Date());
            existingWorkflow.setName(workflowDTO.getName());
            if (workflowDTO.getSubmitted() == null) {
                existingWorkflow.setSubmitted(false);
            }
            else {
                existingWorkflow.setSubmitted(workflowDTO.getSubmitted());
            }
            newWorkflow = workflowRepository.saveAndFlush(existingWorkflow);
        }
        else { // Create
            Integer currentUserId = myUserDetails.getCurrentUser().getId();
            workflow.setUserId(currentUserId);
            workflow.setUpdatedAt(new Date());
            workflow.setCreatedAt(new Date());
            workflow.setName((workflowDTO.getName()));
            newWorkflow = workflowRepository.saveAndFlush(workflow);
        }
        return Workflow.toDTO(newWorkflow, getLatestArgoWorkflowName(newWorkflow));
    }

    public void createOrUpdateWorkflow(Workflow workflow) {
         if (workflow.getId() != null && workflowRepository.existsById(workflow.getId())) { // Update
            Workflow existingWorkflow = workflowRepository.findById(workflow.getId()).get();
            existingWorkflow.setProperty(workflow.getProperty());
            existingWorkflow.setUpdatedAt(new Date());
            existingWorkflow.setName(workflow.getName());
            existingWorkflow.setSubmitted(workflow.getSubmitted());
            workflowRepository.saveAndFlush(existingWorkflow);
        }
        else { // Create
            Integer currentUserId = myUserDetails.getCurrentUser().getId();
            workflow.setUserId(currentUserId);
            workflow.setUpdatedAt(new Date());
            workflow.setCreatedAt(new Date());
            workflow.setName((workflow.getName()));
            workflowRepository.saveAndFlush(workflow);
        }
    }

    public void deleteWorkflow(Integer id) {
        if (checkAuthorization(id)) {
            List<String> argoWorkflowNames = getArgoWorkflowNames(id);
            for (String argoWorkflowName: argoWorkflowNames) {
                Integer resCode = deleteArgoWorkflow(argoWorkflowName);
                if (resCode != 200) {
                    log.warn(argoWorkflowName + " could not be deleted.");
                }
            }
            workflowRepository.deleteById(id);
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Do not have the authorization.")
                    .httpStatus(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }

    public void scheduleWorkflow(ScheduleDTO scheduleDTO) {
        if (scheduleDTO.getId() != null && scheduleRepository.existsById(scheduleDTO.getId())) {
            throw OrcaServiceRuntimeException.builder()
                    .message("Schedule already exists.")
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .build();
        }
        if (! checkAuthorization(scheduleDTO.getWorkflow().getWorkflowID())) {
            throw OrcaServiceRuntimeException.builder()
                    .message("You do not have permission to schedule this workflow.")
                    .httpStatus(HttpStatus.UNAUTHORIZED)
                    .build();
        }
        Optional<Workflow> workflow = workflowRepository.findById(scheduleDTO.getWorkflow().getWorkflowID());
        if (workflow.isPresent()) {
            Schedule schedule = new Schedule();
            schedule.setWorkflow(workflow.get());
            schedule.setCronExpression(scheduleDTO.getCronExpression());
            schedule.setTimezone(scheduleDTO.getTimezone());
            schedule.setSuspended(scheduleDTO.getSuspend());
            if (scheduleDTO.getStartingDeadlineSeconds() != null)
                schedule.setStartingDeadlineSeconds(scheduleDTO.getStartingDeadlineSeconds());
            if (scheduleDTO.getSuccessfulHistoryLimit() != null)
                schedule.setSuccessfulHistoryLimit(scheduleDTO.getSuccessfulHistoryLimit());
            schedule.setCreatedAt(new Date());
            scheduleRepository.saveAndFlush(schedule);

            submitCronWorkflow(scheduleDTO, schedule, workflow.get());
        }
        else {
            throw  OrcaServiceRuntimeException.builder()
                    .message("Requested workflow not exists.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }

    }

    private void submitCronWorkflow(ScheduleDTO scheduleDTO, Schedule schedule, Workflow workflow) {
        WorkflowRequestDTO workflowRequestDTO = scheduleDTO.getWorkflow();
        List<WorkflowTaskDTO> tasks = arrangeWorkflowTasks(workflowRequestDTO);
        Map<String, Object> baseConfig = Utilities.map(GlobalConfig.cronBaseConfig);
        Map<String, Object> scheduledWorkflow = Utilities.generateScheduledWorkflowConfig(
                baseConfig, workflowRequestDTO.getName(), tasks, scheduleDTO.toModel(workflow)
        );

        JSONObject argoResponse;

        argoResponse = genericRequest.executePostRequest(ConstantsConfig.cronWorkflowSubPath +
                        ConstantsConfig.pathSeparator +
                        ConstantsConfig.serviceAccountName,
                new JSONObject(scheduledWorkflow).toString());

        log.info("Argo Response: ");
        log.info(argoResponse.toString());

        String argoCronWorkflowName = (String) ((JSONObject) argoResponse.get("metadata")).get("name");
        schedule.setArgoCronWorkflowName(argoCronWorkflowName);
        scheduleRepository.saveAndFlush(schedule);
    }

    public ScheduleDTO getSchedule(Integer scheduleID) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(scheduleID);
        if (optionalSchedule.isPresent()) {
            Schedule schedule = optionalSchedule.get();
            Integer workflowID = schedule.getWorkflow().getId();
            if (checkAuthorization(workflowID)) {
                return schedule.toDTO();
            }
            else {
                throw OrcaServiceRuntimeException.builder()
                        .message("You do not have permission to get this schedule.")
                        .httpStatus(HttpStatus.UNAUTHORIZED)
                        .build();
            }
        }
        else {
            throw  OrcaServiceRuntimeException.builder()
                    .message("Schedule not exists.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public void deleteSchedule(Integer scheduleID) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(scheduleID);
        if (optionalSchedule.isPresent()) {
            Schedule schedule = optionalSchedule.get();
            Integer resCode = genericRequest.executeDeleteRequest(ConstantsConfig.cronWorkflowSubPath +
                    ConstantsConfig.pathSeparator +
                    ConstantsConfig.serviceAccountName +
                    ConstantsConfig.pathSeparator +
                    schedule.getArgoCronWorkflowName());
            if (resCode != 200) {
                log.warn(schedule.getArgoCronWorkflowName() + " could not be deleted.");
            }
            scheduleRepository.deleteById(scheduleID);

        }
        else {
            throw  OrcaServiceRuntimeException.builder()
                    .message("Schedule not exists.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public String scheduleSuspend(Integer scheduleID) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(scheduleID);
        if (optionalSchedule.isPresent()) {
            Schedule schedule = optionalSchedule.get();
            JSONObject res = genericRequest.executePutRequest(ConstantsConfig.cronWorkflowSubPath +
                    ConstantsConfig.pathSeparator +
                    ConstantsConfig.serviceAccountName +
                    ConstantsConfig.pathSeparator +
                    schedule.getArgoCronWorkflowName() +
                    ConstantsConfig.pathSeparator +
                    ConstantsConfig.suspend,
                    ""
            );
            log.info("Argo response on suspend operation: " + res.toString());
            schedule.setSuspended(true);
            scheduleRepository.saveAndFlush(schedule);
            return res.toString();
        }
        else {
            throw  OrcaServiceRuntimeException.builder()
                    .message("Schedule not exists.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public String scheduleResume(Integer scheduleID) {
        Optional<Schedule> optionalSchedule = scheduleRepository.findById(scheduleID);
        if (optionalSchedule.isPresent()) {
            Schedule schedule = optionalSchedule.get();
            JSONObject res = genericRequest.executePutRequest(ConstantsConfig.cronWorkflowSubPath +
                            ConstantsConfig.pathSeparator +
                            ConstantsConfig.serviceAccountName +
                            ConstantsConfig.pathSeparator +
                            schedule.getArgoCronWorkflowName() +
                            ConstantsConfig.pathSeparator +
                            ConstantsConfig.resume,
                    ""
            );
            log.info("Argo response on resume operation: " + res.toString());
            schedule.setSuspended(false);
            scheduleRepository.saveAndFlush(schedule);
            return res.toString();
        }
        else {
            throw  OrcaServiceRuntimeException.builder()
                    .message("Schedule not exists.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    public Map<String, Object> getAllArgoWorkflows() {
        return Utilities.map(genericRequest.executeGetRequest(ConstantsConfig.workflowSubPath +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.serviceAccountName));
    }

    private List<WorkflowTaskDTO> arrangeWorkflowTasks(WorkflowRequestDTO workflowRequestDTO) {

        List<WorkflowTaskDTO> workflowTaskDTOS = new ArrayList<>();
        for (WorkflowTaskDTO workflowTaskDTO : workflowRequestDTO.getTasks()) {
            String sourceOperator = null;
            String targetOperator = null;
            for (Map<String, String> parameter : workflowTaskDTO.getArguments().get("parameters")) {
                if (parameter.get("name").equalsIgnoreCase("OPERATOR_SOURCE")) {
                    sourceOperator = parameter.get("value");
                } else if (parameter.get("name").equalsIgnoreCase("OPERATOR_TARGET")) {
                    targetOperator = parameter.get("value");
                }
            }
            if (sourceOperator == null || targetOperator == null) {
                throw OrcaServiceRuntimeException.builder()
                        .message("Invalid workflow request.")
                        .httpStatus(HttpStatus.BAD_REQUEST)
                        .build();
            }
            Operator sourceOp = operatorService.getOperatorByName(sourceOperator);
            Operator targetOp = operatorService.getOperatorByName(targetOperator);
            List<RequiredOperatorVariable> requiredSourceOperatorVariables = operatorService.getAllRequiredVariablesByOperator(sourceOp);
            List<RequiredOperatorVariable> requiredTargetOperatorVariables = operatorService.getAllRequiredVariablesByOperator(targetOp);
            List<RequiredOperatorVariable> requiredOperatorVariables = Stream.concat(requiredSourceOperatorVariables.stream(),
                    requiredTargetOperatorVariables.stream()).collect(Collectors.toList());
            List<String> passedVariables = new ArrayList<>();
            for (Map<String, String> parameter : workflowTaskDTO.getArguments().get("parameters")) {
                passedVariables.add(parameter.get("name"));
            }

            List<String> variablesNotPassed = new ArrayList<>();

            for (RequiredOperatorVariable var : requiredOperatorVariables) {
                if (! passedVariables.contains(var.getName())) {
                    variablesNotPassed.add(var.getName());
                }
            }

            if (! variablesNotPassed.isEmpty()) {
                throw OrcaServiceRuntimeException.builder()
                        .message("Following required variables for task " +
                                workflowTaskDTO.getName() +
                                " not passed : " +
                                variablesNotPassed.toString())
                        .httpStatus(HttpStatus.BAD_REQUEST)
                        .build();
            }

            List<RequiredOperatorVariable> operatorVariables = operatorService.getAllRequiredVariables();

            for (RequiredOperatorVariable var : operatorVariables) {
                if (! passedVariables.contains(var.getName())) {
                    Map<String, String> argument = new HashMap<>();
                    argument.put("name", var.getName());
                    argument.put("value", var.getDefaultValue());
                    workflowTaskDTO.getArguments().get("parameters").add(argument);
                }
            }

            workflowTaskDTOS.add(workflowTaskDTO);
        }

        return workflowTaskDTOS;
    }

    public JSONObject submitArgoWorkflow(WorkflowRequestDTO workflowRequestDTO) {
        List<WorkflowTaskDTO> tasks = arrangeWorkflowTasks(workflowRequestDTO);
        Map<String, Object> baseConfig = Utilities.map(GlobalConfig.baseConfig);
        Map<String, Object> workflow = Utilities.generateWorkflowConfig(baseConfig, workflowRequestDTO.getName(), tasks);
        JSONObject argoResponse = genericRequest.executePostRequest(ConstantsConfig.workflowSubPath +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.serviceAccountName,
                new JSONObject(workflow).toString());
        log.info("Argo Response: ");
        log.info(argoResponse.toString());
        String argoWorkflowName = (String) ((JSONObject) argoResponse.get("metadata")).get("name");

        ArgoWorkflow argoWorkflow = new ArgoWorkflow(gcp
                WorkflowDTO.toModel(getWorkflowByID(workflowRequestDTO.getWorkflowID())),
                argoWorkflowName,
                new Date()
        );

        createOrUpdateArgoWorkflow(argoWorkflow);

        setSubmittedByWorkflowId(workflowRequestDTO.getWorkflowID(), true);

        return argoResponse;
    }

    public JSONObject getArgoWorkflow(String workflowName) {
        return Utilities.strToJSON(genericRequest.executeGetRequest(ConstantsConfig.workflowSubPath +
                        ConstantsConfig.pathSeparator +
                        ConstantsConfig.serviceAccountName +
                        ConstantsConfig.pathSeparator +
                        workflowName
        ));
    }

    public String getArgoWorkflowPodLogs(String workflowName, String podName) {
        return genericRequest.executeGetRequest(ConstantsConfig.workflowSubPath +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.serviceAccountName +
                ConstantsConfig.pathSeparator +
                workflowName +
                ConstantsConfig.pathSeparator +
                podName +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.log +
                ConstantsConfig.questionMark +
                ConstantsConfig.logArgs
        );
    }

    public JSONObject putArgoWorkflow(String workflowName, String action) {
        return genericRequest.executePutRequest(ConstantsConfig.workflowSubPath +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.serviceAccountName +
                ConstantsConfig.pathSeparator +
                workflowName +
                ConstantsConfig.pathSeparator + action,
                new JSONObject().toString()
        );
    }

    public Integer deleteArgoWorkflow(String workflowName) {
        return genericRequest.executeDeleteRequest(ConstantsConfig.workflowSubPath +
                ConstantsConfig.pathSeparator +
                ConstantsConfig.serviceAccountName +
                ConstantsConfig.pathSeparator +
                workflowName);
    }

    private String getLatestArgoWorkflowName(Workflow workflow) {
        List<ArgoWorkflow> argoWorkflows = argoWorkflowRepository.findByWorkflowOrderByDateDesc(workflow);
        if (argoWorkflows.size() == 0){
            return null;
        }
        return argoWorkflows.get(0).getArgoName();
    }

    public List<String> getArgoWorkflowNames(Integer workflowId) {
        Workflow workflow;
        Optional<Workflow> workflowOptional = workflowRepository.findById(workflowId);
        if (workflowOptional.isPresent()) {
            workflow = workflowOptional.get();
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Requested workflow not found.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
        List<ArgoWorkflow> argoWorkflows = argoWorkflowRepository.findByWorkflowOrderByDateDesc(workflow);
        return argoWorkflows.stream().map(ArgoWorkflow::getArgoName).collect(Collectors.toList());
    }

    public void createOrUpdateArgoWorkflow(ArgoWorkflow argoWorkflow) {
        if (argoWorkflow.getId() != null && argoWorkflowRepository.existsById(argoWorkflow.getId())) { // Update
            ArgoWorkflow existingArgoWorkflow = argoWorkflowRepository.findById(argoWorkflow.getId()).get();
            existingArgoWorkflow.setWorkflow(argoWorkflow.getWorkflow());
            existingArgoWorkflow.setDate(new Date());
            existingArgoWorkflow.setArgoName(argoWorkflow.getArgoName());
            argoWorkflowRepository.saveAndFlush(existingArgoWorkflow);
        }
        else { // Create
            argoWorkflowRepository.saveAndFlush(argoWorkflow);
        }
    }

    private void setSubmittedByWorkflowId(Integer workflowId, Boolean submitted) {
        Optional<Workflow> workflowOptional = workflowRepository.findById(workflowId);
        if (workflowOptional.isPresent()) {
            Workflow workflow = workflowOptional.get();
            workflow.setSubmitted(submitted);
            createOrUpdateWorkflow(workflow);
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Requested workflow not found.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
    }
}
