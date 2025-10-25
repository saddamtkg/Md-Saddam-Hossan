# Portfolio Website - Md Saddam Hossan

A modern, responsive portfolio website for a Full Stack Developer with dynamic GitHub integration, smooth animations, and an elegant dark theme.

## 🚀 Features

### Core Functionality
- **Dynamic GitHub Integration**: Automatically fetches and displays your repositories, stats, and profile information
- **Typing Animation**: Auto-rotating job titles in the hero section
- **Particle Background**: Interactive animated particle system
- **Project Slider**: Touch-enabled carousel with auto-play functionality
- **Contact Form**: Functional contact form with validation
- **Theme Toggle**: Light/Dark mode with localStorage persistence
- **Smooth Animations**: Scroll-triggered animations throughout the site
- **Responsive Design**: Fully responsive across all devices

### Sections
1. **Hero Section**: Introduction with animated typing effect and GitHub stats
2. **About Section**: Biography, location, email, and certifications
3. **Skills Section**: Animated skill cards with progress bars
4. **Projects Section**: Dynamic GitHub repository showcase
5. **Blog Section**: Latest articles with categories
6. **Contact Section**: Contact form and social links

## 📁 File Structure

```
portfolio/
├── index.html          # Main HTML file
├── style.css          # Complete CSS with animations
├── custom.js          # JavaScript functionality
└── README.md          # This file
```

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Create a new folder for your portfolio
2. Save the three main files:
   - `index.html`
   - `style.css`
   - `custom.js`
3. Open `index.html` in a web browser

### 2. Customization

#### Update Your Information
In `custom.js`, modify these constants:

```javascript
const GITHUB_USERNAME = "saddamtkg";  // Your GitHub username
const CONTACT_EMAIL = "saddamhossan.tkg@gmail.com";  // Your email
```

#### Update Social Links
In `index.html`, find and update all social media links:

```html
<a href="https://linkedin.com/in/YOUR-PROFILE" ...>
<a href="https://wa.me/YOUR-NUMBER" ...>
<a href="https://facebook.com/YOUR-PROFILE" ...>
```

#### Customize Skills
In `custom.js`, modify the `SKILLS` array:

```javascript
const SKILLS = [
    { name: "HTML5", icon: "fab fa-html5", progress: 95 },
    // Add or modify skills here
];
```

#### Update Blog Posts
In `index.html`, modify the blog section with your actual articles.

### 3. Deployment Options

#### Option 1: GitHub Pages
1. Create a new repository named `username.github.io`
2. Upload all files to the repository
3. Enable GitHub Pages in repository settings
4. Access your site at `https://username.github.io`

#### Option 2: Netlify
1. Sign up at [Netlify](https://netlify.com)
2. Drag and drop your folder to Netlify
3. Your site will be live instantly

#### Option 3: Vercel
1. Sign up at [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Deploy with one click

#### Option 4: Traditional Hosting
1. Upload files via FTP to your hosting provider
2. Ensure all files are in the root directory
3. Access via your domain

## 🎨 Customization Guide

### Colors
Edit CSS variables in `style.css`:

```css
:root {
    --primary-color: #6366f1;     /* Main brand color */
    --secondary-color: #8b5cf6;   /* Secondary brand color */
    --accent-color: #ec4899;      /* Accent color */
    /* Modify as needed */
}
```

### Fonts
Change the Google Font import in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap" rel="stylesheet">
```

Then update in `style.css`:

```css
body {
    font-family: "YOUR-FONT", sans-serif;
}
```

### Profile Images
The portfolio automatically fetches your GitHub avatar. To use custom images:

1. Replace the `src` attributes in `index.html`:
```html
<img src="path/to/your/image.jpg" id="heroAvatar" ...>
```

### Typing Effect
Modify the typing texts in `custom.js`:

```javascript
const typingTexts = [
    "Your Title 1",
    "Your Title 2",
    "Your Title 3"
];
```

## 🔧 Advanced Features

### Contact Form Integration

#### Option 1: FormSpree
1. Sign up at [FormSpree](https://formspree.io)
2. Update the form in `index.html`:
```html
<form action="https://formspree.io/f/YOUR-ID" method="POST">
```

#### Option 2: EmailJS
1. Sign up at [EmailJS](https://www.emailjs.com)
2. Add EmailJS SDK to `index.html`
3. Update the `handleContactSubmit` function in `custom.js`

#### Option 3: Custom Backend
Create your own backend API and update the fetch call in `custom.js`.

### Analytics Integration
Add Google Analytics to `index.html` before closing `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR-ID');
</script>
```

## 🐛 Troubleshooting

### GitHub API Rate Limiting
- GitHub limits API requests to 60 per hour for unauthenticated requests
- If you hit the limit, the site will use fallback data
- For higher limits, use a GitHub personal access token

### Images Not Loading
- Check browser console for errors
- Verify image URLs are correct
- Ensure images are accessible (not blocked by CORS)

### Animations Not Working
- Ensure JavaScript is enabled in your browser
- Check browser console for errors
- Verify all files are loaded correctly

### Mobile Menu Not Opening
- Clear browser cache
- Check if JavaScript is running
- Verify the mobile toggle button is visible

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚦 Performance Tips

1. **Optimize Images**: Use WebP format and compress images
2. **Enable Caching**: Add cache headers on your server
3. **Minify Files**: Minify CSS and JavaScript for production
4. **Use CDN**: Host Font Awesome and fonts on CDN
5. **Lazy Loading**: Implement lazy loading for images

## 📄 License

This portfolio template is free to use for personal and commercial projects.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all files are in the correct location
4. Verify your GitHub username is correct

## 🎯 Next Steps

1. **Add Real Blog Posts**: Connect to a blog platform or CMS
2. **Implement Contact Form**: Set up a backend for form submissions
3. **Add More Projects**: Pin repositories on GitHub for better showcase
4. **SEO Optimization**: Add meta tags, sitemap, and robots.txt
5. **Add Analytics**: Track visitors and engagement
6. **Custom Domain**: Connect a custom domain to your site

## 📞 Contact

- **Email**: saddamhossan.tkg@gmail.com
- **GitHub**: [@saddamtkg](https://github.com/saddamtkg)
- **Location**: Thakurgaon, Bangladesh

---

**Built with ❤️ by Md Saddam Hossan**
