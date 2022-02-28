package com.orca.service.system.controller;

import com.orca.service.system.dto.SystemConfigDTO;
import com.orca.service.system.service.SystemConfigService;
import io.swagger.annotations.Api;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpResponse;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
@Api(tags = "api")
@Validated
@Log4j2
public class SystemConfigController {
    @Autowired
    SystemConfigService systemConfigService;

    @GetMapping("/system-config")
    public List<SystemConfigDTO> getAllSystemConfigs() {
        return systemConfigService.getAll();
    }

    @GetMapping("/system-config/{id}")
    public SystemConfigDTO getSystemConfig(@PathVariable Integer id) {
        return systemConfigService.getById(id);
    }

    @PostMapping("/system-config")
    public SystemConfigDTO createOrUpdateSystemConfig(@RequestBody SystemConfigDTO systemConfigDTO) {
        return systemConfigService.createOrUpdateSystemConfig(systemConfigDTO);
    }

    @DeleteMapping("/system-config/{id}")
    public HttpStatus deleteSystemConfig(@PathVariable Integer id) {
        systemConfigService.deleteSystemConfig(id);
        return HttpStatus.OK;
    }
}
