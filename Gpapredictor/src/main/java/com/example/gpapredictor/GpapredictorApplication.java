package com.example.gpapredictor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.gpapredictor.model")
public class GpapredictorApplication {

    public static void main(String[] args) {
        SpringApplication.run(GpapredictorApplication.class, args);
    }

}
