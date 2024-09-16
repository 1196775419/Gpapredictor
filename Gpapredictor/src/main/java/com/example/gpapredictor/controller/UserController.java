package com.example.gpapredictor.controller;

import com.example.gpapredictor.model.User;
import com.example.gpapredictor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // 检查用户名和邮箱是否已经存在
        if (userService.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email is already in use");
        }

        // 调用服务层，传递原始密码进行加密处理
        userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword());

        return ResponseEntity.ok("{\"success\": true, \"message\": \"User registered successfully\"}");
    }


    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        System.out.println("Received password: " + user.getPassword());  // 确保能获取到密码

        User existingUser = userService.findByUsername(user.getUsername());

        if (existingUser == null || user.getPassword() == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        return ResponseEntity.ok("Login successful");
    }


}
