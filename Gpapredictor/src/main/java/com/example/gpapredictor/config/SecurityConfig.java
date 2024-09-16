package com.example.gpapredictor.config;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // 禁用CSRF保护
                .authorizeHttpRequests(auth -> auth
                        // 允许所有用户访问登录和注册相关页面
                        .requestMatchers("/login.html", "/register.html", "/css/**", "/js/**","/api/users/register", "/api/users/login","/**").permitAll()

                        // 确保 /home.html 受保护，只有经过认证的用户才能访问
                        .requestMatchers("/home.html").authenticated()

                        // 其他任何请求都需要认证
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())
                .logout(logout -> logout
                        .logoutSuccessUrl("/login.html") // 退出登录后重定向到登录页面
                        .permitAll()
                );

        return http.build();
    }


}
