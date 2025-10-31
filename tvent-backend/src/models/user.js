// User model based on migration and class diagram
class User {
  constructor({ id, username, email, password, no_handphone, role, profile_picture, created_at, updated_at }) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.no_handphone = no_handphone;
    this.role = role;
    this.profile_picture = profile_picture;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

module.exports = User;