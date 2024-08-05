package com.api.auth.service;

import com.api.user.model.User;
import com.api.helpers.InputValidator;
import com.api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AuthService {

  @Autowired
  private UserRepository userRepo;

  public void signUp(User user) throws Exception {
    if (!InputValidator.validateName(user.getName()) ||
        !InputValidator.validatePassword(user.getPassword())) {
      throw new Exception("Unprocessable entity");
    }
    if (userRepo.findByName(user.getName()) != null) {
      throw new Exception("Username taken");
    }
    userRepo.save(user);
  }
}
