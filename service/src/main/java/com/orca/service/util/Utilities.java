package com.orca.service.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orca.service.workflow.dto.WorkflowTaskDTO;
import com.orca.service.workflow.model.Schedule;
import net.minidev.json.parser.JSONParser;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utilities {
    public static Map<String, Object> map(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static JSONObject strToJSON(String str) {
        try {
            return new JSONObject(str);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public static JSONObject jsonify(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(jsonString, JSONObject.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static Map<String, Object> generateWorkflowConfig(Map<String, Object> workflow, String name, List<WorkflowTaskDTO> tasks) {
        Map<String, Object> mainTemplate = new HashMap<>();
        Map<String, Object> tasksMap = new HashMap<>();

        Map<String, Object> metadata = (Map<String, Object>)((Map<String, Object>) workflow.get("workflow")).get("metadata");
        metadata.put("generateName", name.toLowerCase() + "-");

        tasksMap.put("tasks", tasks);

        mainTemplate.put("name", "main-template");
        mainTemplate.put("dag", tasksMap);

        List<Map<String, Object>> templateList = new ArrayList<>();
        templateList.add(mainTemplate);
        Map<String, Object> spec = (Map<String, Object>)((Map<String, Object>) workflow.get("workflow")).get("spec");
        spec.put("templates", templateList);

        return workflow;
    }

    public static Map<String, Object> generateScheduledWorkflowConfig(
            Map<String, Object> workflow,
            String name,
            List<WorkflowTaskDTO> tasks,
            Schedule schedule) {
        Map<String, Object> mainTemplate = new HashMap<>();
        Map<String, Object> tasksMap = new HashMap<>();

        Map<String, Object> metadata = (Map<String, Object>)((Map<String, Object>) workflow.get("cronWorkflow")).get("metadata");
        metadata.put("generateName", name.toLowerCase() + "-");

        tasksMap.put("tasks", tasks);

        mainTemplate.put("name", "main-template");
        mainTemplate.put("dag", tasksMap);

        List<Map<String, Object>> templateList = new ArrayList<>();
        templateList.add(mainTemplate);
        Map<String, Object> workflowMap = (Map<String, Object>) workflow.get("cronWorkflow");
        Map<String, Object> spec = (Map<String, Object>) workflowMap.get("spec");
        Map<String, Object> workflowSpec = (Map<String, Object>) spec.get("workflowSpec");

        spec.put("schedule", schedule.getCronExpression());
        spec.put("timezone", schedule.getTimezone());
        spec.put("suspend", schedule.getSuspended());
        spec.put("concurrencyPolicy", "Replace");
        spec.put("startingDeadlineSeconds", schedule.getStartingDeadlineSeconds());
        spec.put("successfulHistoryLimit", schedule.getSuccessfulHistoryLimit());
        workflowSpec.put("templates", templateList);

        return workflow;
    }

}
