const { faker } = require('@faker-js/faker');

class UserFactory {
  static create(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
      role: 'user',
      ...overrides
    };
  }

  static createAdmin(overrides = {}) {
    return this.create({
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      ...overrides
    });
  }

  static createMany(count = 10, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

module.exports = UserFactory;