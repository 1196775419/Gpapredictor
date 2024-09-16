package com.example.gpapredictor.service;

import com.example.gpapredictor.model.User;
import com.example.gpapredictor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // 使用 PasswordEncoder 而不是具体的 BCryptPasswordEncoder

    public void registerUser(String username, String email, String password) {
        // 将原始密码加密
        String encodedPassword = passwordEncoder.encode(password);

        // 创建新用户对象
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(encodedPassword);  // 存储加密后的密码

        // 保存用户到数据库
        userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
