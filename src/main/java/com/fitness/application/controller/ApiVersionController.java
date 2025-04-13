
package com.fitness.application.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiVersionController {

    @Value("${app.api.current-version}")
    private String currentVersion;

    @Value("${app.api.supported-versions}")
    private String[] supportedVersions;

    @GetMapping("/version")
    public ResponseEntity<Map<String, Object>> getApiInfo() {
        Map<String, Object> versionInfo = new HashMap<>();
        versionInfo.put("currentVersion", currentVersion);
        versionInfo.put("supportedVersions", supportedVersions);
        
        return ResponseEntity.ok(versionInfo);
    }
}
