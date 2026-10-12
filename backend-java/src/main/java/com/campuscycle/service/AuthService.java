package com.campuscycle.service;

import com.campuscycle.dto.AuthDtos.AuthUserResponse;
import com.campuscycle.dto.AuthDtos.LoginRequest;
import com.campuscycle.dto.AuthDtos.MeUserResponse;
import com.campuscycle.dto.AuthDtos.RegisterRequest;
import com.campuscycle.entity.User;
import com.campuscycle.exception.BadRequestException;
import com.campuscycle.exception.ForbiddenException;
import com.campuscycle.exception.NotFoundException;
import com.campuscycle.exception.UnauthorizedException;
import com.campuscycle.repository.UserRepository;
import com.campuscycle.security.CurrentUserService;
import com.campuscycle.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CurrentUserService currentUserService;
    private final MappingHelper mapper;
    private final String universityEmailDomain;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
                       CurrentUserService currentUserService, MappingHelper mapper,
                       @Value("${app.university.email-domain}") String universityEmailDomain) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.currentUserService = currentUserService;
        this.mapper = mapper;
        this.universityEmailDomain = universityEmailDomain;
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        String domain = email.substring(email.lastIndexOf('@'));
        if (!domain.equals(universityEmailDomain)) {
            throw new BadRequestException("Please use your university email address");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("User already exists");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", jwtService.generateToken(user));
        response.put("user", mapper.toAuthUserResponse(user));
        return response;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        if (!user.isActive()) {
            throw new ForbiddenException("Account has been suspended");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", jwtService.generateToken(user));
        response.put("user", mapper.toAuthUserResponse(user));
        return response;
    }

    @Transactional(readOnly = true)
    public MeUserResponse me() {
        User user = userRepository.findById(currentUserService.currentUserId())
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mapper.toMeUserResponse(user);
    }
}
