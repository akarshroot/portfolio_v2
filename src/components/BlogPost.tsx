import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBlogBySlug, getCategoryBySlug } from '../data/blogs';
import { Helmet } from 'react-helmet';
import './Blog.css';

const BlogPost: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();
  const navigate = useNavigate();
  
  if (!category || !slug) {
    navigate('/blogs');
    return null;
  }

  const blog = getBlogBySlug(category, slug);
  const categoryInfo = getCategoryBySlug(category);

  if (!blog) {
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: 'var(--night)', color: 'var(--lavender-blush)' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <Link 
            to="/blogs" 
            className="text-blue-400 hover:underline"
          >
            ← Back to all blogs
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown-like rendering for demonstration
    // In a real app, you'd use a library like react-markdown
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentElement: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={i} className="p-4 rounded-lg overflow-x-auto my-4 border" 
                 style={{ 
                   backgroundColor: 'rgba(18, 22, 25, 0.8)', 
                   borderColor: 'var(--mountbatten-pink)',
                   color: 'var(--lavender-blush)'
                 }}>
              <code className={`language-${codeLanguage}`} style={{ color: 'var(--lavender-blush)', fontSize: '0.9em' }}>
                {currentElement.join('\n')}
              </code>
            </pre>
          );
          currentElement = [];
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.slice(3);
        }
        continue;
      }

      if (inCodeBlock) {
        currentElement.push(line);
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold mb-6 mt-8" style={{ color: 'var(--lavender-blush)' }}>
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold mb-4 mt-6" style={{ color: 'var(--lavender-blush)', borderBottom: '2px solid var(--mountbatten-pink)', paddingBottom: '0.5rem' }}>
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-xl font-bold mb-3 mt-4" style={{ color: 'var(--rose-quartz)' }}>
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={i} className="mb-4 font-bold" style={{ color: 'var(--rose-quartz)' }}>
            {line.slice(2, -2)}
          </p>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="mb-2 ml-6 relative" style={{ color: 'var(--silver)', fontSize: '1.1rem', lineHeight: '1.7' }}>
            <span 
              className="absolute -left-4 top-2"
              style={{ 
                color: 'var(--mountbatten-pink)',
                fontSize: '0.8rem'
              }}
            >
              •
            </span>
            {line.slice(2)}
          </li>
        );
      } else if (line.trim()) {
        // Handle inline code and links
        const processedLine = line
          .replace(/`([^`]+)`/g, '<code style="background-color: rgba(162, 136, 166, 0.2); color: var(--lavender-blush); padding: 2px 6px; border-radius: 4px; font-size: 0.9em;">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong style="color: var(--lavender-blush);">$1</strong>')
          .replace(/\*([^*]+)\*/g, '<em style="color: var(--rose-quartz);">$1</em>');
        
        elements.push(
          <p 
            key={i} 
            className="mb-4 blog-text" 
            style={{ color: 'var(--silver)', fontSize: '1.1rem', lineHeight: '1.7' }}
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        );
      } else {
        elements.push(<br key={i} />);
      }
    }

    return elements;
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Akarsh Tripathi - Backend Engineer</title>
        <meta name="description" content={blog.excerpt} />
        <meta name="keywords" content={`${blog.tags.join(', ')}, Akarsh Tripathi, Backend Development, Software Engineering`} />
        <link rel="canonical" href={`https://akarshtripathi.com/blogs/${category}/${slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${blog.title} | Akarsh Tripathi`} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://akarshtripathi.com/blogs/${category}/${slug}`} />
        <meta property="og:site_name" content="Akarsh Tripathi - Backend Engineer" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${blog.title} | Akarsh Tripathi`} />
        <meta name="twitter:description" content={blog.excerpt} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={blog.publishedAt} />
        <meta property="article:author" content="Akarsh Tripathi" />
        <meta property="article:section" content={categoryInfo?.name} />
        {blog.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "author": {
              "@type": "Person",
              "name": "Akarsh Tripathi",
              "url": "https://akarshtripathi.com"
            },
            "datePublished": blog.publishedAt,
            "dateModified": blog.updatedAt || blog.publishedAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://akarshtripathi.com/blogs/${category}/${slug}`
            },
            "publisher": {
              "@type": "Person",
              "name": "Akarsh Tripathi"
            },
            "keywords": blog.tags,
            "articleSection": categoryInfo?.name,
            "wordCount": blog.content.split(' ').length,
            "timeRequired": `PT${blog.readTime}M`
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen" style={{ backgroundColor: 'var(--night)', overflow: 'auto', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 p-4 rounded"
          style={{ 
            backgroundColor: 'var(--lavender-blush)', 
            color: 'var(--night)',
            textDecoration: 'none'
          }}
        >
          Skip to main content
        </a>
        
        <div className="max-w-4xl mx-auto px-6 py-8" id="main-content">
          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm" style={{ color: 'var(--rose-quartz)' }}>
              <Link 
                to="/" 
                className="hover:underline"
              >
                Home
              </Link>
              <span>⋮</span>
              <Link 
                to="/blogs" 
                className="hover:underline"
              >
                Blogs
              </Link>
              {categoryInfo && (
                <>
                  <span>⋮</span>
                  <Link 
                    to={`/blogs/${category}`}
                    className="hover:underline"
                  >
                    {categoryInfo.name}
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--lavender-blush)' }}>
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center mb-6" style={{ color: 'var(--rose-quartz)' }}>
              <time dateTime={blog.publishedAt}>
                {formatDate(blog.publishedAt)}
              </time>
              <span>•</span>
              <span>{blog.readTime} min read</span>
              {categoryInfo && (
                <>
                  <span>•</span>
                  <Link 
                    to={`/blogs/${category}`}
                    className="hover:underline"
                    style={{ color: 'var(--mountbatten-pink)' }}
                  >
                    {categoryInfo.name}
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: 'var(--mountbatten-pink)', 
                    color: 'var(--night)' 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-invert max-w-none blog-content">
            {/* Reading progress indicator */}
            <div 
              className="fixed top-0 left-0 h-1 z-50 transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--rose-quartz)',
                width: '0%'
              }}
              id="reading-progress"
            ></div>
            
            {renderMarkdown(blog.content)}
          </article>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t blog-footer" style={{ borderColor: 'var(--mountbatten-pink)' }}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Link 
                  to="/blogs" 
                  className="inline-flex items-center hover:underline nav-link"
                  style={{ color: 'var(--rose-quartz)' }}
                >
                  ← Back to all blogs
                </Link>
              </div>
              
              <div className="text-right">
                <div style={{ color: 'var(--silver)', fontSize: '0.9rem' }}>
                  Published on {formatDate(blog.publishedAt)}
                </div>
                <div style={{ color: 'var(--silver)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {blog.readTime} minute read • {blog.content.split(' ').length} words
                </div>
              </div>
            </div>
            
            {/* Author bio */}
            <div className="mt-8 p-6 rounded-lg" style={{ backgroundColor: 'rgba(162, 136, 166, 0.1)', borderLeft: '4px solid var(--mountbatten-pink)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--lavender-blush)' }}>
                About the Author
              </h3>
              <p style={{ color: 'var(--silver)', lineHeight: '1.6' }}>
                <strong>Akarsh Tripathi</strong> is a backend software engineer specializing in scalable architectures, 
                API design, and distributed systems. With expertise in Node.js, Python, and cloud technologies, 
                he helps teams build robust and maintainable software solutions.
              </p>
              <div className="flex gap-4 mt-4">
                <a 
                  href="https://github.com/akarshroot" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--rose-quartz)' }}
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/akarshtripathi-tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: 'var(--rose-quartz)' }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
