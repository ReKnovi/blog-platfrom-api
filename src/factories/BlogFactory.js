const { faker } = require('@faker-js/faker');

class BlogFactory {
  static create(user, overrides = {}) {
    const techTags = [
      'javascript', 'nodejs', 'react', 'vue', 'angular', 'python', 'django',
      'flask', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes',
      'aws', 'azure', 'devops', 'ci-cd', 'testing', 'jest', 'typescript',
      'graphql', 'rest-api', 'microservices', 'frontend', 'backend',
      'fullstack', 'web-development', 'mobile', 'css', 'html', 'sass'
    ];

    const techTitleTemplates = [
      () => `Getting Started with ${faker.helpers.arrayElement(['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Docker'])}`,
      () => `${faker.helpers.arrayElement(['Advanced', 'Modern', 'Complete', 'Ultimate'])} Guide to ${faker.helpers.arrayElement(['JavaScript', 'TypeScript', 'Python', 'Web Development'])}`,
      () => `Building ${faker.helpers.arrayElement(['Scalable', 'Production-Ready', 'Enterprise', 'Modern'])} Applications with ${faker.helpers.arrayElement(['Express.js', 'React', 'Vue.js', 'Django'])}`,
      () => `${faker.helpers.arrayElement(['Docker', 'Kubernetes', 'AWS', 'MongoDB', 'PostgreSQL'])} for Developers`,
      () => `Mastering ${faker.helpers.arrayElement(['GraphQL', 'REST APIs', 'Microservices', 'DevOps', 'Testing'])}`,
      () => `${faker.helpers.arrayElement(['React', 'Vue', 'Angular'])} vs ${faker.helpers.arrayElement(['React', 'Vue', 'Angular'])}: Which to Choose?`,
      () => `${faker.helpers.arrayElement(['Performance', 'Security', 'Testing'])} Best Practices for ${faker.helpers.arrayElement(['Node.js', 'React', 'Web Applications'])}`
    ];

    const randomTitleGenerator = faker.helpers.arrayElement(techTitleTemplates);
    const createdDate = faker.date.recent({ days: 90 });

    return {
      title: randomTitleGenerator(),
      description: faker.lorem.paragraphs({ min: 2, max: 4 }, '\n\n'),
      tags: faker.helpers.arrayElements(techTags, { min: 2, max: 6 }),
      user: user._id,
      createdAt: createdDate,
      updatedAt: faker.date.between({ from: createdDate, to: new Date() }),
      ...overrides
    };
  }

  static createMany(users, count = 30) {
    return Array.from({ length: count }, () => {
      const randomUser = faker.helpers.arrayElement(users);
      return this.create(randomUser);
    });
  }
}

module.exports = BlogFactory;