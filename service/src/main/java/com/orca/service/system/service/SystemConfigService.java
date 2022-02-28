package com.orca.service.system.service;

import com.orca.service.general.config.ConstantsConfig;
import com.orca.service.operator.service.OperatorService;
import com.orca.service.security.exception.OrcaServiceRuntimeException;
import com.orca.service.security.services.MyUserDetails;
import com.orca.service.system.dto.SystemConfigDTO;
import com.orca.service.system.model.Host;
import com.orca.service.system.model.SystemConfig;
import com.orca.service.system.repository.HostRepository;
import com.orca.service.system.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SystemConfigService {
    @Autowired
    SystemConfigRepository systemConfigRepository;

    @Autowired
    HostRepository hostRepository;

    @Autowired
    OperatorService operatorService;

    @Autowired
    MyUserDetails myUserDetails;

    private boolean checkAuthorization(Integer systemConfigID) {
        String username = myUserDetails.getCurrentUser().getUsername();
        if (username.equals(ConstantsConfig.adminUsername)) {
            return true;
        }
        Integer currentUserId = myUserDetails.getCurrentUser().getId();
        Optional<SystemConfig> workflow = systemConfigRepository.findById(systemConfigID);
        if (workflow.isPresent()) {
            return workflow.get().getUserId().equals(currentUserId);
        }
        else {
            throw new ResourceAccessException("Requested workflow id does not exist.");
        }
    }

    public List<SystemConfigDTO> getAll() {
        Integer currentUserId = myUserDetails.getCurrentUser().getId();
        List<SystemConfig> systemConfigs = systemConfigRepository.findAllByUserId(currentUserId);
        return systemConfigs.stream().map(SystemConfig::toDTO).collect(Collectors.toList());
    }

    public SystemConfigDTO getById(Integer id) {
        if (checkAuthorization(id)) {
            Optional<SystemConfig> systemConfigOptional = systemConfigRepository.findById(id);
            if (systemConfigOptional.isPresent()) {
                SystemConfig systemConfig = systemConfigOptional.get();
                return systemConfig.toDTO();
            }
            else {
                throw OrcaServiceRuntimeException.builder()
                        .message("No system config with the requested id.")
                        .httpStatus(HttpStatus.FORBIDDEN)
                        .build();
            }
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Access denied.")
                    .httpStatus(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }

    public SystemConfigDTO createOrUpdateSystemConfig(SystemConfigDTO systemConfigDTO) {
        SystemConfig newSystemConfig;
        if (systemConfigDTO.getId() != null && systemConfigRepository.existsById(systemConfigDTO.getId())) { // Update
            SystemConfig existingSystemConfig = systemConfigRepository.findById(systemConfigDTO.getId()).get();
            existingSystemConfig.setName(systemConfigDTO.getName());
            existingSystemConfig.setUsername(systemConfigDTO.getUsername());
            existingSystemConfig.setPassword(systemConfigDTO.getPassword());
            existingSystemConfig.setProperty(systemConfigDTO.getProperty());
            existingSystemConfig.setUpdatedAt(new Date());
            newSystemConfig = systemConfigRepository.saveAndFlush(existingSystemConfig);

            List<Host> existingHosts = existingSystemConfig.getHostList();
            hostRepository.deleteInBatch(existingHosts);
            hostRepository.flush();
            hostRepository.saveAll(
                    systemConfigDTO.getHostList()
                            .stream()
                            .map(hostDTO -> new Host(hostDTO.getHost(), newSystemConfig))
                            .collect(Collectors.toList())
            );
        }
        else { // Create
            Integer currentUserId = myUserDetails.getCurrentUser().getId();
            SystemConfig systemConfig = new SystemConfig();
            systemConfig.setName(systemConfigDTO.getName());
            systemConfig.setUsername(systemConfigDTO.getUsername());
            systemConfig.setPassword(systemConfigDTO.getPassword());
            systemConfig.setProperty(systemConfigDTO.getProperty());
            systemConfig.setOperator(operatorService.getOperatorByName(systemConfigDTO.getOperatorName()));
            systemConfig.setUpdatedAt(new Date());
            systemConfig.setCreatedAt(new Date());
            systemConfig.setUserId(currentUserId);
            newSystemConfig = systemConfigRepository.saveAndFlush(systemConfig);
            hostRepository.saveAll(
                    systemConfigDTO.getHostList()
                            .stream()
                            .map(hostDTO -> new Host(hostDTO.getHost(), newSystemConfig))
                            .collect(Collectors.toList())
            );
        }
        Integer newSystemConfigId = newSystemConfig.getId();
        return systemConfigRepository.findById(newSystemConfigId).get().toDTO();
    }

    public void deleteSystemConfig(Integer systemConfigId) {
        if (checkAuthorization(systemConfigId)) {
            systemConfigRepository.deleteById(systemConfigId);
        }
        else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Access denied.")
                    .httpStatus(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }
}
