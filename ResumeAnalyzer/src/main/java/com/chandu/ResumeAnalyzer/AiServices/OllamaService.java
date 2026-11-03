
package com.chandu.ResumeAnalyzer.AiServices;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OllamaService {

    private final RestClient restClient;

    @Value("${ollama.model:qwen2.5:3b}")
    private String model;

    public OllamaService(
            @Value("${ollama.api.url:http://localhost:11434}")
            String baseUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String generateResponse(String prompt) {

        Map<String, Object> options = Map.of(
                "temperature", 0.1,
                "num_predict", 1200
        );

        Map<String, Object> request = Map.of(
                "model", model,
                "prompt", prompt,
                "format", "json",
                "stream", false,
                "options", options
        );

        Map<?, ?> response = restClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(Map.class);

        if (response == null || response.get("response") == null) {
            throw new IllegalStateException(
                    "Ollama returned an empty response.");
        }

        String result = response.get("response").toString();

        System.out.println("Ollama response:");
        System.out.println(result);

        return result;
    }
}
