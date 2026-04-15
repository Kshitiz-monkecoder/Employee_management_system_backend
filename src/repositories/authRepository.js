const User = require('../models/User');

class AuthRepository {
  async findByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(data) {
    return User.create(data);
  }

  async updateLastLogin(id) {
    return User.findByIdAndUpdate(id, { lastLogin: new Date() });
  }
}

module.exports = new AuthRepository();
