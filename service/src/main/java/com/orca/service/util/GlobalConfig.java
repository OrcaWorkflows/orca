package com.orca.service.util;

public class GlobalConfig {
    public static String baseConfig = "{\n" +
            "    \"workflow\": {\n" +
            "        \"metadata\": {},\n" +
            "        \"spec\": {\n" +
            "            \"serviceAccountName\": \"argo\",\n" +
            "            \"entrypoint\": \"main-template\",\n" +
            "            \"volumes\": [\n" +
            "                {\n" +
            "                    \"name\": \"gcp-volume\",\n" +
            "                    \"secret\": {\n" +
            "                        \"secretName\": \"gcp\"\n" +
            "                    }\n" +
            "                }\n" +
            "            ]\n" +
            "        }\n" +
            "    }\n" +
            "}";

    public static String cronBaseConfig = "{\n" +
            "    \"cronWorkflow\": {\n" +
            "        \"metadata\": {},\n" +
            "        \"spec\": {\n" +
            "            \"workflowSpec\": {\n" +
            "               \"serviceAccountName\": \"argo\",\n" +
            "               \"entrypoint\": \"main-template\",\n" +
            "                \"volumes\": [\n" +
            "                 {\n" +
            "                     \"name\": \"gcp-volume\",\n" +
            "                     \"secret\": {\n" +
            "                           \"secretName\": \"gcp\"\n" +
            "                     }\n" +
            "                    }\n" +
            "              ]\n" +
            "           }\n" +
            "        }\n" +
            "    }\n" +
            "}";


}
