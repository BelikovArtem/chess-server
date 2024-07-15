class UserDTO {
  static fields = [
    'id',
    'name',
    'password',
    'is_deleted',
    'games_count',
    'rapid_rating',
    'blitz_rating',
    'bullet_rating',
    'registered_at'
  ];
}

module.exports = UserDTO;