package com.api.auth.controller;

import com.api.user.model.User;
import com.api.headers.Headers;
import com.api.auth.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Objects;

@RestController
@RequestMapping("/auth")
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/signup")
  public ResponseEntity<Void> signUp(@RequestBody User user) {
    Headers responseHeaders = new Headers();
    try {
      authService.signUp(user);
      return new ResponseEntity<>(responseHeaders, HttpStatus.OK);
    } catch (Exception e) {
      if (Objects.equals(e.getMessage(), "Unprocessable entity")) {
        return new ResponseEntity<>(responseHeaders,
          HttpStatus.UNPROCESSABLE_ENTITY);
      } else if (Objects.equals(e.getMessage(), "Username taken")) {
        return new ResponseEntity<>(responseHeaders,
          HttpStatus.CONFLICT);
      } else {
        return new ResponseEntity<>(responseHeaders,
          HttpStatus.BAD_REQUEST);
      }
    }
  }
}
