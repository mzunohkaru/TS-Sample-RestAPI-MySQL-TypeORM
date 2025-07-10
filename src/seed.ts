import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(Post);

    // Clear existing data
    await postRepository.createQueryBuilder().delete().execute();
    await userRepository.createQueryBuilder().delete().execute();

    // Create sample users
    const users = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        age: 28,
        password: "password",
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        age: 34,
        password: "password",
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        age: 22,
        password: "password",
      },
      {
        name: "Diana Prince",
        email: "diana@example.com",
        age: 30,
        password: "password",
      },
      {
        name: "Eve Davis",
        email: "eve@example.com",
        age: 26,
        password: "password",
      },
    ];

    const savedUsers = await userRepository.save(users);
    console.log(`Created ${savedUsers.length} users`);

    // Create sample posts
    const posts = [
      {
        title: "Getting Started with TypeScript",
        content: "TypeScript is a powerful superset of JavaScript...",
        userId: savedUsers[0].id,
      },
      {
        title: "Building REST APIs with Express",
        content:
          "Express.js is a minimal and flexible Node.js web framework...",
        userId: savedUsers[0].id,
      },
      {
        title: "Database Design Best Practices",
        content: "When designing databases, it's important to consider...",
        userId: savedUsers[1].id,
      },
      {
        title: "Introduction to TypeORM",
        content: "TypeORM is an ORM that can run in Node.js...",
        userId: savedUsers[1].id,
      },
      {
        title: "JavaScript ES6 Features",
        content: "ES6 introduced many new features that make JavaScript...",
        userId: savedUsers[2].id,
      },
      {
        title: "Docker for Developers",
        content:
          "Docker provides a way to run applications in lightweight containers...",
        userId: savedUsers[3].id,
      },
      {
        title: "Web Security Fundamentals",
        content:
          "Security should be a primary concern when building web applications...",
        userId: savedUsers[3].id,
      },
      {
        title: "Testing Node.js Applications",
        content: "Testing is crucial for maintaining code quality...",
        userId: savedUsers[4].id,
      },
    ];

    const savedPosts = await postRepository.save(posts);
    console.log(`Created ${savedPosts.length} posts`);

    console.log("Seed data has been successfully created!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
