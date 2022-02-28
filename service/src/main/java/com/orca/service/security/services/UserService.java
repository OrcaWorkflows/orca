package com.orca.service.security.services;

import com.orca.service.security.JwtTokenProvider;
import com.orca.service.security.dto.UserDataDTO;
import com.orca.service.security.dto.UserResponseDTO;
import com.orca.service.security.exception.OrcaServiceRuntimeException;
import com.orca.service.security.model.User;
import com.orca.service.security.repository.UserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
public class UserService {

    @Autowired
    private final MyUserDetails myUserDetails;

    private @Qualifier("appUserRepository")
    final
    UserRepository userRepository;

    @Qualifier("encoder")
    private final PasswordEncoder passwordEncoder;

    private final JwtTokenProvider jwtTokenProvider;


    @Autowired
    public UserService(@Qualifier("appUserRepository") UserRepository userRepository,
                       @Qualifier("encoder") PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       MyUserDetails myUserDetails) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.myUserDetails = myUserDetails;
    }

    public String signIn(String username, String password) throws AccessDeniedException {
        User user;
        try {
            user = userRepository.findUserByUsername(username);
        } catch (DataAccessException dae) {
            throw OrcaServiceRuntimeException.builder()
                    .message("Access Exception. " + dae.getMessage())
                    .httpStatus(HttpStatus.FORBIDDEN)
                    .build();
        }
        if (user == null) {
            throw OrcaServiceRuntimeException.builder()
                    .message("Username could not be found.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
        if (passwordEncoder.matches(password, user.getPassword())) {
            return jwtTokenProvider.createToken(username);
        } else {
            throw OrcaServiceRuntimeException.builder()
                    .message("Password is incorrect.")
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }

    @Transactional
    @Modifying
    /**
     * The user signUp method
     *  Creates a new user and saves to the database using UserRepository
     * @param username username of the user
     * @param password password of the user (will be hashed before save)
     * @param email email of the user
     *
     * @return String token
     */
    public String signUp(String username, String password, String email, String organizationName) {
        if (userRepository.existsByUsername(username)) {
            throw OrcaServiceRuntimeException.builder()
                    .message("Username Already Exists.")
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .build();
        }
        else if (userRepository.existsByEmail(email)) {
            throw OrcaServiceRuntimeException.builder()
                    .message("User Already Exists.")
                    .httpStatus(HttpStatus.BAD_REQUEST)
                    .build();
        }
        else {
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setEmail(email);
            user.setOrganizationName(organizationName);
            user.setCreatedAt(new Date());
            user.setUpdatedAt(new Date());

            saveUser(user);

            return jwtTokenProvider.createToken(user.getUsername());
        }
    }

    public boolean delete(String username) {
        User userToBeDeleted = userRepository.findUserByUsername(username);
        if (userToBeDeleted == null)
            throw new RuntimeException();

        userRepository.deleteUserByUsername(username);
        userRepository.flush();


        if (userRepository.existsByUsername(username)) {
            throw OrcaServiceRuntimeException.builder()
                    .message("User could not be deleted.")
                    .httpStatus(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }

        return true;
    }


    public User search(String username) {
        User user = userRepository.findUserByUsername(username);
        if (user == null) {
            throw OrcaServiceRuntimeException.builder()
                    .message("User could not be found.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
        }
        return user;
    }

    public User whoami(HttpServletRequest req) {
        return userRepository.findUserByUsername(jwtTokenProvider.getUsername(jwtTokenProvider.resolveToken(req)));
    }

    public UserResponseDTO updateUser(String username, UserDataDTO userDataDTO) {
        User oldUser = userRepository.findUserByUsername(username);
        if (oldUser != null) {
            try {
                User newUser = new User();
                newUser.setUsername(userDataDTO.getUsername() == null ?
                        oldUser.getUsername() :
                        userDataDTO.getUsername());
                newUser.setEmail(userDataDTO.getEmail() == null ?
                        oldUser.getEmail() :
                        userDataDTO.getEmail());
                newUser.setPassword(
                        userDataDTO.getPassword() == null ?
                                oldUser.getPassword() :
                                passwordEncoder.encode(userDataDTO.getPassword())
                );
                newUser.setOrganizationName(
                        userDataDTO.getOrganizationName() == null ?
                                oldUser.getOrganizationName() :
                                userDataDTO.getOrganizationName()
                );
                newUser.setId(oldUser.getId());
                newUser.setCreatedAt(oldUser.getCreatedAt());
                newUser.setUpdatedAt(new Date());
                return userRepository.saveAndFlush(newUser).toDTO();
            } catch (DataAccessException dae) {
                throw OrcaServiceRuntimeException.builder()
                        .message("Access Exception. " + dae.getMessage())
                        .httpStatus(HttpStatus.FORBIDDEN)
                        .build();
            }
        } else
            throw OrcaServiceRuntimeException.builder()
                    .message("User could not be found.")
                    .httpStatus(HttpStatus.NOT_FOUND)
                    .build();
    }


    @Transactional
    public User saveUser(User user) {

        if (!userRepository.existsByUsername(user.getUsername()))
            user.setPassword(passwordEncoder.encode(user.getPassword()));

        try {
            return userRepository.saveAndFlush(user);
        } catch (DataAccessException dae) {
            throw OrcaServiceRuntimeException.builder()
                    .message("Access Exception. " + dae.getMessage())
                    .httpStatus(HttpStatus.FORBIDDEN)
                    .build();
        }
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(User::toDTO).collect(Collectors.toList());
    }
}