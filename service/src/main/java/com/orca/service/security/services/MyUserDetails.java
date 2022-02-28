package com.orca.service.security.services;

import com.orca.service.security.model.User;
import com.orca.service.security.repository.SecurityUserRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@Log4j2
public class MyUserDetails implements UserDetailsService {

    @Autowired
    private
    SecurityUserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User '" + username + "' not found");
        }

        return org.springframework.security.core.userdetails.User//
                .withUsername(username)//
                .password(user.getPassword())//
                .roles("USER")//
                .accountExpired(false)//
                .accountLocked(false)//
                .credentialsExpired(false)//
                .disabled(false)//
                .build();
    }

    @Transactional
    public User getCurrentUser()
    {
        log.debug("Get current user initiated.");
        try {
            UserDetails currentUserDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUserName = currentUserDetails.getUsername();
            log.debug("Current user name: " + currentUserName);

            return userRepository.findByUsername(currentUserName);
        } catch (NullPointerException e) {
            log.error("User not authenticated. Error: " + e.getMessage());
            throw new RuntimeException("User not authenticated");
        } catch (ClassCastException exception) {
            log.error("User anonymous. Error: " + exception.getMessage());
            throw new RuntimeException("User anonymous!");
        } catch (Exception ex) {
            log.error("Current user can not be obtained. Exception: " + ex.toString());
            throw new RuntimeException(ex);
        }
    }

    public void setCurrentUser(String username){
        UserDetails currentUser = loadUserByUsername(username);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(currentUser, "", currentUser.getAuthorities())
        );
    }
}