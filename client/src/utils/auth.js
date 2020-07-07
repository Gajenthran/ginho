class Auth {
  login(token, cb) {
    localStorage.setItem('login', token);
    cb();
  }

  logout(cb) {
    localStorage.removeItem('login');
    cb();
  }

  getUsername() {
    console.log(localStorage.getItem('login').firstName);
    return localStorage.getItem('login').firstName;
  }

  isLogin() {
    if (localStorage.getItem('login')) {
      return true;
  }
  return false;
  }
}

export default new Auth();