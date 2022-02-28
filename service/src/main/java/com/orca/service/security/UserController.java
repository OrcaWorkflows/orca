package com.orca.service.security;

import com.orca.service.security.dto.*;
import com.orca.service.security.services.UserService;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/users")
@Api(tags = "users")
@Validated
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signin")
    @ApiOperation(value = "${UserController.signin}")
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 422, message = "Invalid username/password supplied")})
    public LoginSuccessfulDTO login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            String key = userService.signIn(loginRequest.getUsername(), loginRequest.getPassword());
            return new LoginSuccessfulDTO().setKey(key);
        } catch (AccessDeniedException ade) {
            throw new RuntimeException(ade);
        }
    }

    @PostMapping("/signup")
    @ApiOperation(value = "${UserController.signup}")
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 422, message = "Username is already in use"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public String signup(@ApiParam("Signup User") @RequestBody UserDataDTO user) {

        if (!UserDataDTO.verifyPassword(user.getPassword()))
            throw new RuntimeException();

        return userService.signUp(
                user.getUsername(),
                user.getPassword(),
                user.getEmail(),
                user.getOrganizationName());
    }


    @DeleteMapping(value = "/user/{username}")
    // @PreAuthorize("hasAuthority('WRITE_USER_PERMISSION')")
    @ApiOperation(value = "${UserController.delete}")
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 404, message = "The user doesn't exist"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public List<UserResponseDTO> deleteUser(@ApiParam("Username") @PathVariable String username) {
        userService.delete(username);
        return listAll();
    }

    @PostMapping(value = "/user/{username}")
    // @PreAuthorize("hasAuthority('WRITE_USER_PERMISSION')")
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 404, message = "The user doesn't exist"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public UserResponseDTO updateUser(@PathVariable String username, @RequestBody UserDataDTO userDataDTO) {
        if (userDataDTO.getPassword() != null && !UserDataDTO.verifyPassword(userDataDTO.getPassword()))
            throw new RuntimeException("Invalid password.");
        return userService.updateUser(username, userDataDTO);
    }

    @GetMapping(value = "/me")
    // @PreAuthorize("hasAuthority('READ_SELF_PERMISSION')")
    @ApiOperation(value = "${UserController.me}", response = UserResponseDTO.class)
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public UserResponseDTO whoami(HttpServletRequest req) {
        return userService.whoami(req).toDTO();
    }

    @GetMapping(value = "/search/{username}")
    // @PreAuthorize("hasAuthority('READ_USER_PERMISSION')")
    @ApiOperation(value = "${UserController.search}", response = UserResponseDTO.class)
    @ApiResponses(value = {//
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 404, message = "The user doesn't exist"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public UserResponseDTO search(@ApiParam("Username") @PathVariable String username) {
        return userService.search(username).toDTO();
    }

    @GetMapping(value = "/user/list")
    // @PreAuthorize("hasAuthority('READ_USER_PERMISSION')")
    @ApiResponses(value = {
            @ApiResponse(code = 400, message = "Something went wrong"), //
            @ApiResponse(code = 403, message = "Access denied"), //
            @ApiResponse(code = 500, message = "Expired or invalid JWT token")})
    public List<UserResponseDTO> listAll() {
        return userService.getAllUsers();
    }

}