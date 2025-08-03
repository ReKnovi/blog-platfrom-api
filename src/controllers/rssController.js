const RSS = require('rss');
const Blog = require('../models/Blog');

exports.getRSSFeed = async (req, res, next) => {
  try {
    const { 
      category, 
      author, 
      limit = 20, 
      tags,
      since
    } = req.query;

    
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (author) {
      filter.user = author;
    }
    
    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagsArray };
    }
    
    if (since) {
      filter.createdAt = { $gte: new Date(since) };
    }

    const itemLimit = Math.min(parseInt(limit) || 20, 100);

    const feed = new RSS({
      title: 'Blog Platform - Latest Posts',
      description: 'Stay updated with the latest blog posts and articles from our community',
      feed_url: `${process.env.BASE_URL}/api/v1/rss${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`,
      site_url: process.env.BASE_URL,
      image_url: `${process.env.BASE_URL}/logo.png`,
      managingEditor: 'editor@blogplatform.com (Blog Platform)',
      webMaster: 'webmaster@blogplatform.com (Web Master)',
      copyright: `${new Date().getFullYear()} Blog Platform`,
      language: 'en-us',
      categories: ['Technology', 'Programming', 'Web Development', 'Tutorials'],
      pubDate: new Date(),
      ttl: 60, // Cache for 60 minutes
      generator: 'Blog Platform RSS Generator v1.0',
      docs: 'https://validator.w3.org/feed/docs/rss2.html',
      custom_namespaces: {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'dc': 'http://purl.org/dc/elements/1.1/',
        'atom': 'http://www.w3.org/2005/Atom'
      },
      custom_elements: [
        {'atom:link': {
          _attr: {
            href: `${process.env.BASE_URL}/api/v1/rss`,
            rel: 'self',
            type: 'application/rss+xml'
          }
        }}
      ]
    });

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(itemLimit)
      .populate('user', 'name email')
      .lean();

    if (blogs.length === 0) {
      return res.status(200).set('Content-Type', 'application/rss+xml').send(feed.xml({ indent: true }));
    }

    blogs.forEach(blog => {
      const description = blog.description.length > 400 
        ? blog.description.substring(0, 397) + '...' 
        : blog.description;

      feed.item({
        title: blog.title,
        description: description,
        url: `${process.env.BASE_URL}/blogs/${blog._id}`,
        guid: `${process.env.BASE_URL}/blogs/${blog._id}`,
        author: blog.user?.email || 'noreply@blogplatform.com',
        date: blog.createdAt,
        categories: blog.tags || [],
        custom_elements: [
          {'dc:creator': blog.user?.name || 'Anonymous'},
          {'content:encoded': {
            _cdata: `<p>${blog.description}</p>
                     <p><strong>Tags:</strong> ${(blog.tags || []).join(', ')}</p>
                     <p><strong>Author:</strong> ${blog.user?.name || 'Anonymous'}</p>
                     <p><a href="${process.env.BASE_URL}/blogs/${blog._id}">Read full article</a></p>`
          }},
          {'dc:date': blog.createdAt.toISOString()},
          {'dc:modified': blog.updatedAt?.toISOString() || blog.createdAt.toISOString()}
        ]
      });
    });

    const xml = feed.xml({ indent: true });
    
    res.set({
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'ETag': `"${Buffer.from(xml).toString('base64').substring(0, 32)}"`,
      'Last-Modified': blogs[0]?.createdAt?.toUTCString() || new Date().toUTCString()
    });
    
    res.send(xml);
  } catch (err) {
    next(err);
  }
};
exports.getCategoryRSSFeed = async (req, res, next) => {
  req.query.category = req.params.category;
  return exports.getRSSFeed(req, res, next);
};
exports.getAuthorRSSFeed = async (req, res, next) => {
  req.query.author = req.params.authorId;
  return exports.getRSSFeed(req, res, next);
};
exports.getTagRSSFeed = async (req, res, next) => {
  req.query.tags = req.params.tag;
  return exports.getRSSFeed(req, res, next);
};