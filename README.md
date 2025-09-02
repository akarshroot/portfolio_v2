# Portfolio v2 - Personal Website & Blog

A modern, terminal-inspired portfolio website with integrated blog functionality built with React and TypeScript.

## Features

### 🖥️ Terminal Interface
- Interactive terminal emulation with command support
- ASCII art banner display
- Responsive design with mobile-friendly fallback

### 📝 Blog System
- Categorized blog posts with clean URLs (`/blogs/<category>/<slug>`)
- Categories: Backend Development, System Design, DevOps, Machine Learning, Career Growth
- Full markdown-like rendering for rich content
- SEO-optimized with meta tags and structured data

### 🎨 Design
- Dark theme with beautiful color palette
- Window-like interface with terminal aesthetics
- Consistent styling across all pages
- Mobile-responsive design

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Routing**: React Router v6
- **Styling**: CSS with custom variables, Tailwind-like utilities
- **SEO**: React Helmet for meta tags
- **Build**: Create React App

## Project Structure

```
src/
├── app/
│   ├── App.tsx              # Main app with routing
│   ├── App.css              # App-level styles
│   └── pages/               # Page components
│       ├── BlogListing.tsx  # All blogs page (/blogs)
│       └── BlogCategory.tsx # Category page (/blogs/<category>)
├── components/
│   ├── Window.tsx           # Terminal window wrapper
│   ├── Terminal.tsx         # Interactive terminal
│   ├── BlogCard.tsx         # Blog post preview card
│   └── BlogPost.tsx         # Individual blog post (/blogs/<category>/<slug>)
├── data/
│   └── blogs.ts             # Blog content and metadata
├── types/
│   └── blog.ts              # TypeScript interfaces
└── constants/
    └── terminal.ts          # Terminal configuration
```

## Available Commands (Terminal)

- `help` - Show available commands
- `about` - Learn about me
- `resume` - Get resume link
- `contact` - Get contact information
- `blog` - Navigate to blog
- `clear` - Clear terminal

## Blog Routes

- `/blogs` - All blog posts and categories
- `/blogs/<category>` - Posts in a specific category
- `/blogs/<category>/<slug>` - Individual blog post

### Available Categories

1. **Backend Development** (`/blogs/backend`) - API design, server architecture
2. **System Design** (`/blogs/system-design`) - Scalable architectures, distributed systems
3. **DevOps & Cloud** (`/blogs/devops`) - Infrastructure, deployment, cloud technologies
4. **Machine Learning** (`/blogs/ml`) - AI/ML concepts and implementations
5. **Career & Growth** (`/blogs/career`) - Professional development insights

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
