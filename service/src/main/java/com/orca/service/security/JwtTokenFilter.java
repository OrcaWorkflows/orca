package com.orca.service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtTokenFilter extends OncePerRequestFilter {

    private JwtTokenProvider jwtTokenProvider;

    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws IOException, ServletException {

        String token = jwtTokenProvider.resolveToken(req);
        try {
            if (token != null) {
                jwtTokenProvider.validateToken(token);
                Authentication auth = jwtTokenProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
                //Refresh token and attach it to the header if needed
                if (jwtTokenProvider.isInRefreshInterval(token)) {
                    String newToken = jwtTokenProvider.createToken(jwtTokenProvider.getUsername(token));
                    res.setHeader("Access-Control-Expose-Headers",  "Authorization");
                    res.setHeader("Authorization", newToken);
                }
            }
            filterChain.doFilter(req, res);
        } catch (RuntimeException ex) {
            throw new RuntimeException(ex);
        }


    }


}