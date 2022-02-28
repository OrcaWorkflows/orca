package com.orca.service.workflow.controller;

import com.orca.service.workflow.dto.ScheduleDTO;
import com.orca.service.workflow.dto.WorkflowDTO;
import com.orca.service.workflow.dto.WorkflowPageDTO;
import com.orca.service.workflow.dto.WorkflowRequestDTO;
import com.orca.service.workflow.model.Schedule;
import com.orca.service.workflow.service.WorkflowService;
import io.swagger.annotations.Api;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = "api")
@Validated
@Log4j2
public class WorkflowController {
    @Autowired
    WorkflowService workflowService;

    @GetMapping("/workflow")
    public WorkflowPageDTO getWorkflow(@RequestParam Integer pageNumber,
                                       @RequestParam Integer pageSize,
                                       @RequestParam(required = false) String sortBy) {
        return workflowService.getWorkflow(pageNumber, pageSize, sortBy);
    }

    @GetMapping("/workflow/{id}")
    public WorkflowDTO getWorkflow(@PathVariable Integer id) {
        return workflowService.getWorkflowByID(id);
    }

    @PostMapping("/workflow")
    public WorkflowDTO createOrUpdateWorkflow(@RequestBody WorkflowDTO workflowDTO) {
        return workflowService.createOrUpdateWorkflow(workflowDTO);
    }

    @PostMapping("/workflow/schedule")
    public void scheduleWorkflow(@RequestBody ScheduleDTO scheduleDTO) {
        workflowService.scheduleWorkflow(scheduleDTO);
    }

    @GetMapping("/workflow/schedule/{id}")
    public ScheduleDTO getSchedule(@PathVariable Integer id) {
        return workflowService.getSchedule(id);
    }

    @DeleteMapping("/workflow/schedule/{id}")
    public HttpStatus deleteSchedule(@PathVariable Integer id) {
        workflowService.deleteSchedule(id);
        return HttpStatus.OK;
    }

    @PutMapping("/workflow/schedule/suspend/{id}")
    public String suspendSchedule(@PathVariable Integer id) {
        return workflowService.scheduleSuspend(id);
    }

    @PutMapping("/workflow/schedule/resume/{id}")
    public String resumeSchedule(@PathVariable Integer id) {
        return workflowService.scheduleResume(id);
    }

    @DeleteMapping("/workflow/{id}")
    public HttpStatus deleteWorkflow(@PathVariable Integer id) {
        workflowService.deleteWorkflow(id);
        return HttpStatus.OK;
    }

    @PostMapping("/workflow/submit")
    public String submitWorkflow(@RequestBody WorkflowRequestDTO workflowRequestDTO) {
        return workflowService.submitArgoWorkflow(workflowRequestDTO).toString();
    }

    @PutMapping(value ="/workflow/{workflowName}/suspend")
    public String suspendWorkflow(@PathVariable String workflowName){
        return workflowService.putArgoWorkflow(workflowName, "suspend").toString();
    }

    @PutMapping(value ="/workflow/{workflowName}/resume")
    public String resumeWorkflow(@PathVariable String workflowName){
        return workflowService.putArgoWorkflow(workflowName, "resume").toString();
    }

    @PutMapping(value ="/workflow/{workflowName}/stop")
    public String stopWorkflow(@PathVariable String workflowName){
        return workflowService.putArgoWorkflow(workflowName, "stop").toString();
    }

    @PutMapping(value ="/workflow/{workflowName}/terminate")
    public String terminateWorkflow(@PathVariable String workflowName){
        return workflowService.putArgoWorkflow(workflowName, "terminate").toString();
    }

    @GetMapping(value = "/workflow/{workflowName}/{info}")
    public ResponseEntity<String> getStatus(@PathVariable String workflowName, @PathVariable String info){
        JSONObject response = workflowService.getArgoWorkflow(workflowName);
        JSONObject infoJson = (JSONObject) response.get(info);
        return new ResponseEntity<>(infoJson.toString(), HttpStatus.OK);
    }

    @GetMapping(value = "/workflow/{workflowName}/{podName}/log")
    public ResponseEntity<String> getLog(@PathVariable String workflowName, @PathVariable String podName) {
        String response = workflowService.getArgoWorkflowPodLogs(workflowName, podName);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
