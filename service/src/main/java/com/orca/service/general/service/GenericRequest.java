package com.orca.service.general.service;

import com.orca.service.general.config.ConstantsConfig;
import com.orca.service.general.config.EnvironmentConfig;
import okhttp3.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Objects;

@Service
public class GenericRequest {
    @Autowired
    EnvironmentConfig environmentConfig;

    private String domain;

    @PostConstruct
    void init() {
        domain = environmentConfig.argoUrl + ConstantsConfig.pathSeparator + ConstantsConfig.baseUrl;
    }

    public final MediaType JSON
            = MediaType.get("application/json; charset=utf-8");

    public JSONObject executePostRequest(String subPath, String requestBody) {

        OkHttpClient client = new OkHttpClient();

        RequestBody body = RequestBody.create(requestBody, JSON);
        Request request = new Request.Builder()
                .url(domain + subPath)
                .post(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            return new JSONObject(Objects.requireNonNull(response.body()).string());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public JSONObject executePutRequest(String subPath, String requestBody) {

        OkHttpClient client = new OkHttpClient();

        RequestBody body = RequestBody.create(requestBody, JSON);
        Request request = new Request.Builder()
                .url(domain + subPath)
                .put(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            return new JSONObject(Objects.requireNonNull(response.body()).string());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public String executeGetRequest(String subPath) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(domain + subPath)
                .get()
                .build();
        try (Response response = client.newCall(request).execute()) {
            return Objects.requireNonNull(response.body()).string();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public Integer executeDeleteRequest(String subPath) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url(domain + subPath)
                .delete()
                .build();
        try (Response response = client.newCall(request).execute()) {
            return response.code();
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }
}
