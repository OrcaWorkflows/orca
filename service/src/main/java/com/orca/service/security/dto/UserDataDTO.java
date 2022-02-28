package com.orca.service.security.dto;

import com.orca.service.security.model.User;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
public class UserDataDTO {

    @ApiModelProperty
    private String username;
    @ApiModelProperty
    private String email;
    @ApiModelProperty
    private String password;
    @ApiModelProperty
    private String organizationName;


    public static UserDataDTO fromUserToUserDataDTO(User user) {
        UserDataDTO userDataDTO = new UserDataDTO();
        userDataDTO.setPassword(user.getPassword());
        userDataDTO.setUsername(user.getUsername());
        userDataDTO.setEmail(user.getEmail());
        userDataDTO.setPassword(user.getPassword());
        return userDataDTO;

    }

    /**
     * Helper method that checks if the password strong enough
     * @param password
     * @return true if the password meets criteria
     */
    public static boolean verifyPassword(String password) {

        // Check for null, or NullPointerException would throw on length check
        if(password == null) return false;

        //Check for length
        boolean sufficientLength = password.length() >= 8;

        // Check for at least one uppercase letter
        boolean hasUppercase = !password.equals(password.toLowerCase());

        // Check for at least one lowercase letter
        boolean hasLowercase = !password.equals(password.toUpperCase());

        //Check for at least one character
        boolean isAlphaNum = !password.matches("[A-Za-z0-9 ]*");

        //Check for special characters
        boolean hasSpecial = password.matches(".*[!@#$%^&*].*");

        //Check for number
        boolean hasNumber = password.matches(".*\\d.*");

        return sufficientLength && hasUppercase && hasLowercase
                && isAlphaNum && (hasNumber || hasSpecial);
    }


    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null) return false;
        if (!(obj instanceof UserDataDTO)) return false;
        UserDataDTO other = (UserDataDTO) obj;
        return Objects.equals(this.username, other.getUsername()) && Objects.equals(this.email, other.getEmail());
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }

}