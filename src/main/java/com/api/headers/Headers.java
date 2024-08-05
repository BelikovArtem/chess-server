  package com.api.headers;

  import org.springframework.http.HttpHeaders;

  public class Headers extends HttpHeaders {
    public Headers() {
      // CORS HEADERS
      this.add("Access-Control-Allow-Origin", "http://localhost:3000");
      this.add("Access-Control-Allow-Credentials", "true");
      this.add("Access-Control-Allow-Headers", "origin, content-type," +
        "accept, authorization");
      // CONTENT-TYPE HEADER
      this.add("Content-Type", "application/json");
    }
  }
