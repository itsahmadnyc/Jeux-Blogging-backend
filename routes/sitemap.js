const Blog = require('../models/Blog'); // Adjust the path to your Blog model

// Static routes configuration
const staticRoutes = [
  {
    loc: 'https://jeuxdevelopers.com/',
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: 'https://jeuxdevelopers.com/CustomSoftware',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: 'https://jeuxdevelopers.com/MobileApp',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: 'https://jeuxdevelopers.com/WebDevelopment',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: 'https://jeuxdevelopers.com/HybridApp',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: 'https://jeuxdevelopers.com/UxDesign',
    changefreq: 'daily',
    priority: '0.8'
  },
  {
    loc: 'https://jeuxdevelopers.com/Blogs',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: 'https://jeuxdevelopers.com/AllBlogs',
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    loc: 'https://jeuxdevelopers.com/AboutUsPage',
    changefreq: 'daily',
    priority: '0.7'
  },
  {
    loc: 'https://jeuxdevelopers.com/ServicesHome',
    changefreq: 'daily',
    priority: '0.7'
  },
  {
    loc: 'https://jeuxdevelopers.com/GetBlogByCategory',
    changefreq: 'daily',
    priority: '0.7'
  }
];

// Sitemap route handler
const generateSitemap = async (req, res) => {
  try {
    // Set proper headers for XML
    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    });

    // Fetch published blogs from database
    const blogs = await Blog.findAll({
      where: {
        publish: true
      },
      attributes: ['blogUrl', 'updatedAt'],
      order: [['updatedAt', 'DESC']]
    });

    // Start building XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

    // Add static routes
    staticRoutes.forEach(route => {
      xml += `<url>\n`;
      xml += `<loc>${route.loc}</loc>\n`;
      xml += `<changefreq>${route.changefreq}</changefreq>\n`;
      xml += `<priority>${route.priority}</priority>\n`;
      xml += `</url>\n`;
    });

    // Add dynamic blog routes
    blogs.forEach(blog => {
      xml += `<url>\n`;
      xml += `<loc>https://jeuxdevelopers.com/Blogs/${blog.blogUrl}</loc>\n`;
      xml += `<lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>\n`;
      xml += `<changefreq>weekly</changefreq>\n`;
      xml += `<priority>0.8</priority>\n`;
      xml += `</url>\n`;
    });

    // Close XML
    xml += `</urlset>`;

    res.send(xml);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = generateSitemap;