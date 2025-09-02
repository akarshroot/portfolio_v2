import { BlogPost, BlogCategory } from '../types/blog';

export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Backend Development',
    slug: 'backend',
    description: 'Deep dives into backend architecture, APIs, and server-side development'
  },
  {
    id: '2', 
    name: 'System Design',
    slug: 'system-design',
    description: 'Exploring scalable architectures and distributed systems'
  },
  {
    id: '3',
    name: 'DevOps & Cloud',
    slug: 'devops',
    description: 'Infrastructure, deployment, and cloud technologies'
  },
  {
    id: '4',
    name: 'Machine Learning',
    slug: 'ml',
    description: 'AI/ML concepts, implementations, and real-world applications'
  },
  {
    id: '5',
    name: 'Career & Growth',
    slug: 'career',
    description: 'Professional development and software engineering insights'
  }
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Scalable REST APIs with Node.js and Express',
    slug: 'scalable-rest-apis-nodejs',
    category: 'backend',
    content: `
# Building Scalable REST APIs with Node.js and Express

REST APIs are the backbone of modern web applications. In this comprehensive guide, we'll explore how to build scalable, maintainable APIs using Node.js and Express.

## Table of Contents
1. Project Setup
2. Architecture Patterns
3. Database Integration
4. Authentication & Authorization
5. Error Handling
6. Testing Strategies
7. Performance Optimization

## 1. Project Setup

First, let's set up our project structure:

\`\`\`bash
mkdir scalable-api
cd scalable-api
npm init -y
npm install express mongoose helmet cors morgan compression
npm install -D nodemon @types/node typescript
\`\`\`

### Project Structure
\`\`\`
src/
├── controllers/
├── models/
├── routes/
├── middleware/
├── services/
├── utils/
└── config/
\`\`\`

## 2. Architecture Patterns

We'll implement a layered architecture:

### Controller Layer
\`\`\`typescript
// controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private userService = new UserService();

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json({ success: true, data: users });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
\`\`\`

### Service Layer
\`\`\`typescript
// services/userService.ts
import { User } from '../models/User';

export class UserService {
  async getAllUsers() {
    return await User.find().select('-password');
  }

  async createUser(userData: any) {
    const user = new User(userData);
    return await user.save();
  }
}
\`\`\`

## 3. Database Integration

Using Mongoose for MongoDB integration:

\`\`\`typescript
// models/User.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
\`\`\`

## 4. Authentication & Authorization

Implementing JWT-based authentication:

\`\`\`typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
\`\`\`

## 5. Error Handling

Centralized error handling:

\`\`\`typescript
// middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};
\`\`\`

## 6. Testing Strategies

Setting up comprehensive testing:

\`\`\`typescript
// tests/user.test.ts
import request from 'supertest';
import app from '../src/app';

describe('User API', () => {
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
\`\`\`

## 7. Performance Optimization

### Caching with Redis
\`\`\`typescript
import redis from 'redis';
const client = redis.createClient();

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cached = await client.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      client.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  };
};
\`\`\`

### Database Optimization
- Use indexes for frequently queried fields
- Implement pagination for large datasets
- Use aggregation pipelines for complex queries

## Conclusion

Building scalable REST APIs requires careful consideration of architecture, performance, and maintainability. By following these patterns and best practices, you can create robust APIs that scale with your application's growth.

## Next Steps
- Implement rate limiting
- Add API documentation with Swagger
- Set up monitoring and logging
- Deploy with Docker and orchestration
`,
    excerpt: 'Learn how to build scalable, maintainable REST APIs using Node.js and Express with proper architecture patterns, authentication, and performance optimization.',
    publishedAt: '2024-03-15',
    tags: ['Node.js', 'Express', 'REST API', 'Backend', 'Scalability'],
    readTime: 12
  },
  {
    id: '2',
    title: 'Microservices vs Monolith: When to Choose What',
    slug: 'microservices-vs-monolith',
    category: 'system-design',
    content: `
# Microservices vs Monolith: When to Choose What

The age-old debate in software architecture: should you go with a monolithic architecture or break everything down into microservices? The answer, like most things in software engineering, is "it depends."

## Understanding the Architectures

### Monolithic Architecture
A monolithic application is deployed as a single unit. All components are interconnected and interdependent.

**Pros:**
- Simple to develop, test, and deploy initially
- Better performance for simple applications
- Easier debugging and monitoring
- ACID transactions across the entire application

**Cons:**
- Scaling requires scaling the entire application
- Technology stack lock-in
- Large codebase can become unwieldy
- Single point of failure

### Microservices Architecture
Applications are broken down into small, independent services that communicate over well-defined APIs.

**Pros:**
- Independent scaling of services
- Technology diversity
- Better fault isolation
- Easier to understand individual services

**Cons:**
- Increased complexity in deployment and monitoring
- Network latency and reliability issues
- Data consistency challenges
- Distributed system complexity

## Decision Framework

### Choose Monolith When:
1. **Small team** (< 10 developers)
2. **Simple applications** with limited complexity
3. **Rapid prototyping** or MVP development
4. **Limited DevOps maturity**
5. **Strong consistency requirements**

### Choose Microservices When:
1. **Large teams** that can be organized around services
2. **Complex domains** that can be naturally decomposed
3. **Different scaling requirements** for different parts
4. **Strong DevOps culture** and infrastructure
5. **Need for technology diversity**

## Migration Strategy

If you're considering migrating from monolith to microservices:

1. **Start with domain identification**
2. **Extract services gradually** (Strangler Fig pattern)
3. **Implement proper monitoring** and observability
4. **Establish DevOps practices** first
5. **Consider the two-pizza team rule**

## Conclusion

There's no one-size-fits-all answer. Start with a monolith, and when you feel the pain points, consider microservices. Remember: distributed systems are hard, and microservices are distributed systems.
`,
    excerpt: 'A comprehensive guide to choosing between monolithic and microservices architectures, including decision frameworks and migration strategies.',
    publishedAt: '2024-03-10',
    tags: ['System Design', 'Architecture', 'Microservices', 'Monolith'],
    readTime: 8
  },
  {
    id: '3',
    title: 'Docker Best Practices for Production Deployments',
    slug: 'docker-production-best-practices',
    category: 'devops',
    content: `
# Docker Best Practices for Production Deployments

Docker has revolutionized how we package and deploy applications. However, moving from development to production requires careful consideration of security, performance, and reliability.

## Dockerfile Optimization

### Multi-stage Builds
\`\`\`dockerfile
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:16-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Security Best Practices
- Use non-root users
- Scan images for vulnerabilities
- Keep base images updated
- Use minimal base images (Alpine)

## Container Orchestration

### Docker Compose for Development
\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    restart: unless-stopped
\`\`\`

### Kubernetes for Production
Production deployments benefit from Kubernetes for:
- Auto-scaling
- Rolling deployments
- Service discovery
- Health checks

## Monitoring and Logging

Implement comprehensive monitoring:
- Application metrics
- Container resource usage
- Log aggregation
- Health checks

## Conclusion

Proper Docker practices ensure reliable, secure, and performant production deployments.
`,
    excerpt: 'Essential Docker practices for production deployments, covering optimization, security, orchestration, and monitoring.',
    publishedAt: '2024-03-08',
    tags: ['Docker', 'DevOps', 'Production', 'Containers'],
    readTime: 6
  },
  {
    id: '4',
    title: 'Introduction to Machine Learning with Python',
    slug: 'ml-python-introduction',
    category: 'ml',
    content: `
# Introduction to Machine Learning with Python

Machine Learning (ML) is transforming industries and creating new possibilities. This guide will get you started with ML using Python and popular libraries.

## Setting Up Your Environment

\`\`\`bash
pip install numpy pandas scikit-learn matplotlib seaborn jupyter
\`\`\`

## Types of Machine Learning

### 1. Supervised Learning
Learn from labeled data to make predictions.

**Examples:**
- Classification: Email spam detection
- Regression: House price prediction

### 2. Unsupervised Learning
Find patterns in unlabeled data.

**Examples:**
- Clustering: Customer segmentation
- Dimensionality reduction: Data visualization

### 3. Reinforcement Learning
Learn through interaction with an environment.

**Examples:**
- Game playing (AlphaGo)
- Autonomous vehicles

## Your First ML Model

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Load data
data = pd.read_csv('housing.csv')

# Prepare features and target
X = data[['size', 'bedrooms', 'age']]
y = data['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')
\`\`\`

## Next Steps

1. **Learn data preprocessing**
2. **Explore different algorithms**
3. **Understand model evaluation**
4. **Practice with real datasets**
5. **Learn deep learning frameworks**

Machine Learning is a journey of continuous learning. Start with simple projects and gradually tackle more complex problems.
`,
    excerpt: 'Get started with Machine Learning using Python. Learn the fundamentals, set up your environment, and build your first ML model.',
    publishedAt: '2024-03-05',
    tags: ['Machine Learning', 'Python', 'Data Science', 'Beginner'],
    readTime: 10
  },
  {
    id: '5',
    title: 'From Junior to Senior: A Software Engineering Career Guide',
    slug: 'junior-to-senior-career-guide',
    category: 'career',
    content: `
# From Junior to Senior: A Software Engineering Career Guide

The journey from junior to senior software engineer isn't just about years of experience—it's about growth, learning, and developing both technical and soft skills.

## The Career Levels

### Junior Developer (0-2 years)
**Focus:** Learning fundamentals
- Master your primary programming language
- Understand basic algorithms and data structures
- Learn version control (Git)
- Practice coding consistently

**Key Activities:**
- Build side projects
- Contribute to open source
- Read code from experienced developers
- Ask questions and seek feedback

### Mid-Level Developer (2-5 years)
**Focus:** Becoming productive and independent
- Design and implement features independently
- Understand system architecture
- Mentor junior developers
- Take ownership of code quality

**Key Activities:**
- Lead small projects
- Participate in technical discussions
- Learn about testing and deployment
- Expand technology stack

### Senior Developer (5+ years)
**Focus:** Leadership and system thinking
- Design complex systems
- Make architectural decisions
- Mentor and guide team members
- Drive technical initiatives

**Key Activities:**
- Lead major projects
- Influence technical direction
- Communicate with stakeholders
- Build and improve processes

## Essential Skills for Growth

### Technical Skills
1. **Programming Mastery:** Deep understanding of at least one language
2. **System Design:** Ability to architect scalable systems
3. **Database Knowledge:** SQL and NoSQL databases
4. **DevOps Understanding:** CI/CD, containerization, cloud platforms
5. **Testing:** Unit, integration, and end-to-end testing

### Soft Skills
1. **Communication:** Articulate technical concepts clearly
2. **Collaboration:** Work effectively in teams
3. **Problem Solving:** Break down complex problems
4. **Time Management:** Prioritize tasks effectively
5. **Continuous Learning:** Stay updated with technology trends

## Practical Tips for Advancement

### 1. Take Initiative
- Volunteer for challenging projects
- Propose improvements to existing systems
- Help teammates when they're stuck

### 2. Build Your Network
- Attend conferences and meetups
- Engage on professional social media
- Contribute to tech communities

### 3. Document Your Impact
- Keep track of your achievements
- Quantify the value you've delivered
- Prepare for performance reviews

### 4. Seek Feedback
- Ask for regular feedback from peers and managers
- Act on constructive criticism
- Set clear goals for improvement

### 5. Stay Current
- Follow industry blogs and newsletters
- Experiment with new technologies
- Take online courses and certifications

## Common Pitfalls to Avoid

1. **Only focusing on code:** Don't neglect soft skills and business understanding
2. **Working in isolation:** Collaborate and seek mentorship
3. **Avoiding difficult conversations:** Learn to communicate technical debt and constraints
4. **Not documenting work:** Poor documentation limits your impact
5. **Resistance to change:** Embrace new technologies and methodologies

## Building Your Personal Brand

### 1. Content Creation
- Write technical blog posts
- Create tutorial videos
- Share insights on social media

### 2. Open Source Contributions
- Contribute to projects you use
- Maintain your own open source projects
- Participate in community discussions

### 3. Speaking and Teaching
- Present at local meetups
- Mentor junior developers
- Conduct technical workshops

## Measuring Progress

Track your growth through:
- **Project complexity:** Are you handling more complex features?
- **Independence level:** Do you need less guidance?
- **Team influence:** Are others seeking your technical input?
- **Problem-solving speed:** How quickly can you debug and resolve issues?
- **Code quality:** Is your code more maintainable and well-tested?

## Salary and Negotiation Tips

### Research Market Rates
- Use sites like Glassdoor, Levels.fyi, and PayScale
- Talk to peers in similar roles
- Consider total compensation, not just base salary

### Prepare for Negotiations
- Document your achievements and impact
- Research the company's compensation philosophy
- Practice articulating your value proposition
- Be prepared to walk away if necessary

### Timing Matters
- Annual review cycles
- After completing major projects
- When taking on additional responsibilities
- During high-performance periods

## Work-Life Balance

As you advance, remember:
- **Set boundaries:** Don't let work consume your personal life
- **Take breaks:** Regular vacations and mental health days
- **Pursue interests:** Hobbies and activities outside of tech
- **Stay healthy:** Physical and mental wellness should be priorities

## The Long-Term Perspective

Career growth isn't always linear. You might:
- Switch companies for better opportunities
- Move into management or stay in IC roles
- Transition to different domains or technologies
- Start your own company or consultancy

## Conclusion

The path from junior to senior engineer is unique for everyone. Focus on continuous learning, building relationships, and delivering value. Success comes from consistency, curiosity, and the willingness to step outside your comfort zone.

Remember: every senior engineer was once a junior developer asking the same questions you're asking now. Be patient with yourself, stay curious, and enjoy the journey.

## Resources for Continued Learning

### Books
- "Clean Code" by Robert Martin
- "System Design Interview" by Alex Xu
- "The Pragmatic Programmer" by Hunt and Thomas

### Online Platforms
- LeetCode for algorithm practice
- System Design Primer on GitHub
- Coursera and Udemy for specialized courses

### Communities
- Stack Overflow
- Reddit (r/programming, r/cscareerquestions)
- Discord servers for specific technologies
- Local tech meetups and conferences

The most important advice: never stop learning, and always be willing to help others along their journey.
`,
    excerpt: 'A comprehensive guide to advancing your software engineering career from junior to senior level, covering technical skills, soft skills, and practical advice.',
    publishedAt: '2024-03-01',
    tags: ['Career', 'Software Engineering', 'Professional Development', 'Growth'],
    readTime: 15
  }
];

export const getBlogsByCategory = (categorySlug: string): BlogPost[] => {
  return blogPosts.filter(post => post.category === categorySlug);
};

export const getBlogBySlug = (categorySlug: string, blogSlug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.category === categorySlug && post.slug === blogSlug);
};

export const getCategoryBySlug = (categorySlug: string): BlogCategory | undefined => {
  return blogCategories.find(category => category.slug === categorySlug);
};

export const getAllBlogs = (): BlogPost[] => {
  return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
};
