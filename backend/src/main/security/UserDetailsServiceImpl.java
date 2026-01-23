package com.hrm.HRM.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.hrm.HRM.entity.User;
import com.hrm.HRM.repository.UserRepository;
import com.hrm.HRM.repository.UserRoleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public UserDetailsServiceImpl(UserRepository userRepository, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<GrantedAuthority> authorities = userRoleRepository.findByIdUserId(user.getId())
                .stream()
                .map(ur -> ur.getRole() != null ? ur.getRole().getName() : null)
                .filter(name -> name != null && !name.isBlank())
                .map(name -> name.startsWith("ROLE_") ? name : "ROLE_" + name)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                authorities
        );
    }
}
