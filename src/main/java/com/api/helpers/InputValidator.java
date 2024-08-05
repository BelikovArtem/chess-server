package com.api.helpers;

import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class InputValidator {
  private static final Pattern NAME_PATTERN =
    Pattern.compile("^[a-zA-Z0-9]{4,30}$");
  private static final Pattern PASSWORD_PATTERN =
    Pattern.compile("^[a-zA-Z0-9]{8,30}$");

  public static boolean validateName(String name) {
    Matcher matcher = NAME_PATTERN.matcher(name);
    return matcher.matches();
  }

  public static boolean validatePassword(String password) {
    Matcher matcher = PASSWORD_PATTERN.matcher(password);
    return matcher.matches();
  }
}
