//Model uživatelského účtu
class User {
  constructor(id, authId, email, name, phone, country, tabs) {
    this.id = id;
    this.authId = authId;
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.country = country;
    this.tabs = tabs;
  }
}

export default User;
