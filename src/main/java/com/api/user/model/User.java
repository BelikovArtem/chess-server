package com.api.user.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity()
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true, length = 30)
  private String name;

  @Column(length = 30)
  private String password;

  private Integer blitzRating;

  private Integer rapidRating;

  private Integer bulletRating;

  private Boolean isDeleted;

  private final Timestamp createdAt;

  private Timestamp updatedAt;

  // GETTERS
  public Long getId() {
    return id;
  }
  public String getName() {
    return name;
  }
  public String getPassword() {
    return password;
  }
  public Integer getBlitzRating() {
    return blitzRating;
  }
  public Integer getRapidRating() {
    return rapidRating;
  }
  public Integer getBulletRating() {
    return bulletRating;
  }
  public Boolean getDeleted() {
    return isDeleted;
  }
  public Timestamp getCreatedAt() {
    return createdAt;
  }
  public Timestamp getUpdatedAt() {
    return updatedAt;
  }

  // SETTERS
  public void setName(String name) {
    setUpdatedAt();
    this.name = name;
  }
  public void setBlitzRating(Integer blitzRating) {
    setUpdatedAt();
    this.blitzRating = blitzRating;
  }
  public void setRapidRating(Integer rapidRating) {
    setUpdatedAt();
    this.rapidRating = rapidRating;
  }
  public void setBulletRating(Integer bulletRating) {
    setUpdatedAt();
    this.bulletRating = bulletRating;
  }
  public void setDeleted(Boolean deleted) {
    setUpdatedAt();
    isDeleted = deleted;
  }

  public void setPassword(String password) {
    setUpdatedAt();
    this.password = password;
  }
  public void setUpdatedAt() {
    this.updatedAt = new Timestamp(System.currentTimeMillis());
  }

  public User() {
    this.blitzRating = 400;
    this.rapidRating = 400;
    this.bulletRating = 400;
    this.createdAt = new Timestamp(System.currentTimeMillis());
    this.updatedAt = this.createdAt;
    this.isDeleted = false;
  }
}
