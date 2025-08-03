const { faker } = require('@faker-js/faker');

class CommentFactory {
  static create(blog, overrides = {}) {
    const commentTemplates = [
      () => `Great article! ${faker.lorem.sentence()}`,
      () => `Thanks for sharing this. ${faker.lorem.sentences(2)}`,
      () => `I have a question about ${faker.lorem.words(3)}.`,
      () => `This is exactly what I was looking for. ${faker.lorem.sentence()}`,
      () => `Could you elaborate more on ${faker.lorem.words(4)}?`,
      () => `Excellent tutorial! ${faker.lorem.sentence()}`,
      () => `${faker.helpers.arrayElement(['Amazing', 'Helpful', 'Insightful', 'Well-written'])} content!`,
      () => faker.lorem.paragraph(),
      () => `How does this compare to ${faker.lorem.words(3)}?`,
      () => `Perfect timing for this article. ${faker.lorem.sentence()}`
    ];

    const randomCommentGenerator = faker.helpers.arrayElement(commentTemplates);
    const commentDate = faker.date.between({ 
      from: blog.createdAt, 
      to: new Date() 
    });

    return {
      blog: blog._id,
      name: faker.person.fullName(),
      text: randomCommentGenerator(),
      createdAt: commentDate,
      ...overrides
    };
  }

  static createManyForBlog(blog, count) {
    return Array.from({ length: count }, () => this.create(blog));
  }

  static createManyForBlogs(blogs) {
    const comments = [];
    blogs.forEach(blog => {
      const numComments = faker.number.int({ min: 1, max: 12 });
      comments.push(...this.createManyForBlog(blog, numComments));
    });
    return comments;
  }
}

module.exports = CommentFactory;