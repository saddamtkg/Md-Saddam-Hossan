// ========== CONFIGURATION ==========
const GITHUB_USERNAME = "saddamtkg";
const GITHUB_API_USER = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_API_REPOS = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
const CONTACT_EMAIL = "saddamhossan.tkg@gmail.com";

// ========== FALLBACK DATA ==========
const FALLBACK_DATA = {
    name: "Md Saddam Hossan",
    login: "saddamtkg",
    avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
    bio: "Passionate developer with 5+ years of experience crafting modern web applications and custom websites. Specialized in WordPress solutions, integrating OpraSync Systems, and designing digital experiences.",
    location: "Thakurgaon, Bangladesh",
    email: CONTACT_EMAIL,
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    public_repos: 0,
    followers: 0,
    following: 0,
};

// ========== INITIALIZATION ==========
document.addEventListener("DOMContentLoaded", () => {
    // Wait for jQuery to be fully loaded
    if (typeof jQuery === "undefined") {
        console.error("jQuery is not loaded!");
        return;
    }

    initializeApp();
});

function initializeApp() {
    // Set current year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize components
    typeEffect();
    initParticles();
    renderSkills();
    fetchGitHubData();
    fetchGitHubRepos();
    initScrollAnimations();
    initContactForm();

    // Animate skill progress bars after a delay
    setTimeout(() => {
        animateSkillBars();
    }, 500);
}

// ========== TYPING EFFECT ==========
const typingTexts = [
    "Full Stack Developer",
    "WordPress Expert",
    "Shopify Developer",
    "Webflow Designer",
    "Problem Solver",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const typingElement = document.getElementById("typingText");
    if (!typingElement) return;

    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// ========== PARTICLE ANIMATION ==========
function initParticles() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(99, 102, 241, 0.5)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 - distance / 750
                        })`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========== FETCH GITHUB DATA ==========
async function fetchGitHubData() {
    try {
        const response = await fetch(GITHUB_API_USER);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        updateUserUI(data);
        return data;
    } catch (error) {
        console.error("GitHub API Error:", error);
        updateUserUI(FALLBACK_DATA);
        return FALLBACK_DATA;
    }
}

function updateUserUI(data) {
    const avatar = data.avatar_url || FALLBACK_DATA.avatar_url;
    const name = data.name || data.login || FALLBACK_DATA.name;
    const bio = data.bio || FALLBACK_DATA.bio;
    const location = data.location || FALLBACK_DATA.location;

    // Update all avatar instances
    const avatars = ["navAvatar", "heroAvatar"];
    avatars.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.src = avatar;
    });

    // Update names
    const names = ["navName", "heroName", "footerName"];
    names.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = name;
    });

    // Update bio
    const bioElements = ["heroBio", "aboutBio"];
    bioElements.forEach((id) => {
        const el = document.getElementById(id);
        if (el && bio) el.textContent = bio;
    });

    // Update location
    const locationElements = ["aboutLocation", "contactLocation"];
    locationElements.forEach((id) => {
        const el = document.getElementById(id);
        if (el && location) el.textContent = location;
    });

    // Update email
    const emailEl = document.getElementById("aboutEmail");
    if (emailEl) {
        emailEl.textContent = data.email || CONTACT_EMAIL;
        emailEl.href = `mailto:${data.email || CONTACT_EMAIL}`;
    }

    // Update GitHub link
    const githubLink = document.getElementById("githubLink");
    if (githubLink) githubLink.href = data.html_url || FALLBACK_DATA.html_url;

    // Update stats
    const reposCount = document.getElementById("reposCount");
    const followersCount = document.getElementById("followersCount");

    if (reposCount) animateCounter(reposCount, data.public_repos || 0);
    if (followersCount) animateCounter(followersCount, data.followers || 0);
}

// ========== FETCH GITHUB REPOS ==========
async function fetchGitHubRepos() {
    const loading = document.getElementById("projectsLoading");
    const container = document.getElementById("projectsContainer");

    try {
        const response = await fetch(GITHUB_API_REPOS);
        if (!response.ok) throw new Error("Failed to fetch repos");

        const repos = await response.json();

        if (loading) loading.style.display = "none";
        if (container) container.style.display = "block";

        // Filter and sort repos
        const filtered = repos
            .filter((repo) => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        if (filtered.length > 0) {
            displayProjects(filtered);

            // Calculate total stars
            const totalStars = filtered.reduce(
                (sum, repo) => sum + repo.stargazers_count,
                0
            );
            const starsCount = document.getElementById("starsCount");
            if (starsCount) animateCounter(starsCount, totalStars);
        } else {
            showNoProjects();
        }
    } catch (error) {
        console.error("GitHub Repos Error:", error);
        showProjectError();
    }
}

function displayProjects(repos) {
    const slider = document.getElementById("projectsSlider");
    if (!slider) return;

    slider.innerHTML = "";

    // Show only top repos
    const displayRepos = repos.slice(0, 12);

    displayRepos.forEach((repo) => {
        const card = createProjectCard(repo);
        slider.appendChild(card);
    });

    // Initialize Slick Slider after adding cards
    setTimeout(() => {
        initSlickSlider();
    }, 100);
}

function createProjectCard(repo) {
    const card = document.createElement("div");
    card.className = "project-card";

    const color = getLanguageColor(repo.language);
    const name = formatRepoName(repo.name);
    const desc =
        repo.description ||
        "A great project built with passion and dedication.";
    const shortDesc = desc.length > 120 ? desc.substring(0, 120) + "..." : desc;

    card.innerHTML = `
        <div class="project-image" style="background: linear-gradient(135deg, ${color}33 0%, ${color}11 100%);">
            <div class="project-overlay">
                <a href="${repo.html_url
        }" class="project-link" target="_blank" rel="noopener noreferrer" title="View on GitHub">
                <i class="fab fa-github"></i>
                </a>
                ${repo.homepage
            ? `
                    <a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer" title="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                `
            : ""
        }
                <div class="project-title">
                    <a href="${repo.homepage || repo.html_url}"
                    target="_blank"
                    rel="noopener noreferrer">
                        <h3>${escapeHtml(name)}</h3>
                    </a>
                </div>
            </div>
            <div class="project-content">
            <h3>${escapeHtml(name)}</h3>
            <p>${escapeHtml(shortDesc)}</p>
            <div class="project-meta">
             <div class="project-tags">
                ${repo.language
            ? `<span class="tag">${escapeHtml(
                repo.language
            )}</span>`
            : ""
        }
                ${repo.topics
            ? repo.topics
                .slice(0, 2)
                .map(
                    (topic) =>
                        `<span class="tag">${escapeHtml(
                            topic
                        )}</span>`
                )
                .join("")
            : ""
        }
            </div>
            <div class="project-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count
        }</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count
        }</span>
                ${repo.homepage
            ? '<span><i class="fas fa-link"></i> Live</span>'
            : ""
        }
            </div>
            </div>

        </div>

        </div>
    `;

    return card;
}

function showNoProjects() {
    const loading = document.getElementById("projectsLoading");
    if (loading) {
        loading.style.display = "block";
        loading.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-folder-open" style="font-size: 64px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <p style="color: var(--text-muted);">No public repositories found yet.</p>
            </div>
        `;
    }
}

function showProjectError() {
    const loading = document.getElementById("projectsLoading");
    if (loading) {
        loading.style.display = "block";
        loading.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 64px; color: #f59e0b; margin-bottom: 20px;"></i>
                <p style="color: var(--text-muted); margin-bottom: 15px;">Unable to load projects from GitHub.</p>
                <button onclick="fetchGitHubRepos()" class="btn btn-primary">
                    <span>Retry</span>
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        `;
    }
}

// ========== HELPER FUNCTIONS ==========
function formatRepoName(name) {
    return name
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getLanguageColor(lang) {
    const colors = {
        JavaScript: "#f1e05a",
        TypeScript: "#2b7489",
        Python: "#3572A5",
        Java: "#b07219",
        HTML: "#e34c26",
        CSS: "#563d7c",
        PHP: "#4F5D95",
        Ruby: "#701516",
        Go: "#00ADD8",
        Rust: "#dea584",
        "C++": "#f34b7d",
        C: "#555555",
        Shell: "#89e051",
        Vue: "#41b883",
        React: "#61dafb",
        Swift: "#ffac45",
        Kotlin: "#F18E33",
    };
    return colors[lang] || "#6366f1";
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function animateCounter(element, target) {
    if (!element || !target) return;

    let current = 0;
    const increment = target / 60;
    const duration = 1500;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ========== PROJECT SLIDER WITH SLICK ==========
function initSlickSlider() {
    const $slider = $("#projectsSlider");

    // Destroy existing slider if it exists
    if ($slider.hasClass("slick-initialized")) {
        $slider.slick("unslick");
    }

    // Initialize Slick Slider
    $slider.slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
        pauseOnFocus: true,
        arrows: true,
        prevArrow:
            '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
        nextArrow:
            '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                },
            },
        ],
    });
}

// ========== SKILLS DATA ==========
const SKILLS = [
    { name: "HTML5", icon: "fab fa-html5", progress: 95 },
    { name: "CSS3", icon: "fab fa-css3-alt", progress: 92 },
    { name: "JavaScript", icon: "fab fa-js", progress: 88 },
    { name: "React", icon: "fab fa-react", progress: 85 },
    { name: "WordPress", icon: "fab fa-wordpress", progress: 90 },
    { name: "PHP", icon: "fab fa-php", progress: 82 },
    { name: "Git", icon: "fab fa-git-alt", progress: 87 },
    { name: "Node.js", icon: "fab fa-node", progress: 78 },
];

function renderSkills() {
    const skillsGrid = document.getElementById("skillsGrid");
    if (!skillsGrid) return;

    skillsGrid.innerHTML = "";

    SKILLS.forEach((skill, index) => {
        const card = document.createElement("div");
        card.className = "skill-card";
        card.setAttribute("data-aos", "zoom-in");
        card.setAttribute("data-aos-delay", index * 50);

        card.innerHTML = `
            <div class="skill-icon">
                <i class="${skill.icon}"></i>
            </div>
            <h3>${skill.name}</h3>
            <div class="skill-bar">
                <div class="skill-progress" data-progress="${skill.progress}"></div>
            </div>
        `;

        skillsGrid.appendChild(card);
    });
}

function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
        const progress = bar.getAttribute("data-progress");
        bar.style.width = progress + "%";
    });
}

// ========== NAVIGATION ==========
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const mobileToggle = document.getElementById("mobileToggle");
const navLinksContainer = document.getElementById("navLinks");

// Scroll effect
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    // Active nav link
    let current = "";
    document.querySelectorAll("section").forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").slice(1) === current) {
            link.classList.add("active");
        }
    });
});

// Mobile menu toggle
if (mobileToggle && navLinksContainer) {
    mobileToggle.onclick = () => {
        mobileToggle.classList.toggle("active");
        navLinksContainer.classList.toggle("active");
    };

    navLinks.forEach((link) => {
        link.onclick = () => {
            mobileToggle.classList.remove("active");
            navLinksContainer.classList.remove("active");
        };
    });
}

// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    themeToggle.classList.add("active");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.onclick = () => {
    const currentTheme = document.body.getAttribute("data-theme");

    if (currentTheme === "light") {
        document.body.removeAttribute("data-theme");
        themeToggle.classList.remove("active");
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem("theme", "dark");
    } else {
        document.body.setAttribute("data-theme", "light");
        themeToggle.classList.add("active");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem("theme", "light");
    }
};

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("aos-animate");
            }
        });
    }, observerOptions);

    document.querySelectorAll("[data-aos]").forEach((el) => {
        observer.observe(el);
    });
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById("contactForm");

    if (form) {
        form.addEventListener("submit", handleContactSubmit);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Show loading state
    const submitBtn = e.target.querySelector(".btn-submit");
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
        '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide form and show success message
        document.getElementById("contactForm").style.display = "none";
        document.getElementById("formSuccess").classList.add("show");

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Log form data (replace with actual submission)
        console.log("Form submitted:", data);

        // You can add actual form submission here:
        // Example with mailto:
        const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
            data.subject
        )}&body=${encodeURIComponent(
            `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
        )}`;
        window.location.href = mailtoLink;
    }, 1500);
}

function resetContactForm() {
    document.getElementById("contactForm").style.display = "block";
    document.getElementById("formSuccess").classList.remove("show");
    document.getElementById("contactForm").reset();
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to resize events
window.addEventListener(
    "resize",
    debounce(() => {
        // Slick handles responsive resizing automatically
        const $slider = $("#projectsSlider");
        if ($slider.hasClass("slick-initialized")) {
            $slider.slick("setPosition");
        }
    }, 250)
);

// ========== ERROR HANDLING ==========
window.addEventListener("error", (e) => {
    console.error("Global error:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection:", e.reason);
});

console.log("Portfolio initialized successfully!");
