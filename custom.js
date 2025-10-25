// GitHub Configuration
const GITHUB_USERNAME = "saddamhosan1";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Fetch GitHub User Data
async function fetchGitHubData() {
    try {
        const response = await fetch(GITHUB_API);
        const data = await response.json();

        // Update profile image
        document.getElementById("profileImage").src = data.avatar_url;
        document.getElementById("aboutProfileImage").src = data.avatar_url;

        // Update name
        const displayName = data.name || GITHUB_USERNAME;
        document.getElementById("githubName").textContent = displayName;
        document.getElementById("footerName").textContent = displayName;

        // Update bio
        if (data.bio) {
            document.getElementById("githubBio").textContent = data.bio;
        }

        // Update stats
        document.getElementById("totalRepos").textContent = data.public_repos;
        document.getElementById("githubFollowers").textContent = data.followers;
        document.getElementById("totalCommits").textContent = data.public_repos;
        document.getElementById("followersCount").textContent = data.followers;
        document.getElementById("followingCount").textContent = data.following;

        // Update location
        if (data.location) {
            document.getElementById("githubLocation").textContent =
                data.location;
        }

        // Update email
        if (data.email) {
            document.getElementById("githubEmail").textContent = data.email;
            document.getElementById(
                "githubEmail"
            ).href = `mailto:${data.email}`;
            document.getElementById("emailLink").href = `mailto:${data.email}`;
        }

        // Update GitHub links
        document.getElementById(
            "githubUsername"
        ).textContent = `@${data.login}`;
        document.getElementById("githubUsername").href = data.html_url;
        document.getElementById("githubLink").href = data.html_url;

        // Animate counters
        animateCounter(
            document.getElementById("totalRepos"),
            data.public_repos
        );
        animateCounter(
            document.getElementById("githubFollowers"),
            data.followers
        );
    } catch (error) {
        console.error("Error fetching GitHub data:", error);
    }
}

// Fetch GitHub Repositories
async function fetchGitHubRepos() {
    try {
        const response = await fetch(GITHUB_REPOS_API);
        const repos = await response.json();

        // Hide loading, show container
        document.getElementById("projectsLoading").style.display = "none";
        document.getElementById("projectsContainer").style.display = "block";

        // Filter out forks and sort by stars
        const filteredRepos = repos
            .filter((repo) => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        displayProjects(filteredRepos);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        document.getElementById("projectsLoading").innerHTML = `
            <p style="color: var(--text-muted);">Unable to load projects. Please check back later.</p>
        `;
    }
}

// Display Projects
function displayProjects(repos) {
    const slider = document.getElementById("projectsSlider");
    const dotsContainer = document.getElementById("sliderDots");

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    repos.forEach((repo, index) => {
        // Create project card
        const card = document.createElement("div");
        card.className = "project-card";

        // Get language color
        const languageColor = getLanguageColor(repo.language);

        card.innerHTML = `
            <div class="project-image" style="background: linear-gradient(135deg, ${languageColor}33 0%, ${languageColor}11 100%);">
                <div class="project-overlay">
                    <a href="${
                        repo.html_url
                    }" class="project-link" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github"></i>
                    </a>
                    ${
                        repo.homepage
                            ? `
                        <a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer" style="margin-left: 15px;">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                    `
                            : ""
                    }
                </div>
            </div>
            <div class="project-content">
                <h3>${repo.name
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}</h3>
                <p>${
                    repo.description ||
                    "A great project built with passion and dedication."
                }</p>
                <div class="project-tags">
                    ${
                        repo.language
                            ? `<span class="tag">${repo.language}</span>`
                            : ""
                    }
                    ${repo.topics
                        .slice(0, 3)
                        .map((topic) => `<span class="tag">${topic}</span>`)
                        .join("")}
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${
                        repo.stargazers_count
                    }</span>
                    <span><i class="fas fa-code-branch"></i> ${
                        repo.forks_count
                    }</span>
                    ${
                        repo.homepage
                            ? '<span><i class="fas fa-link"></i> Live Demo</span>'
                            : ""
                    }
                </div>
            </div>
        `;

        slider.appendChild(card);

        // Create dot
        const dot = document.createElement("div");
        dot.className = "dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Initialize slider
    initializeSlider();
}

// Get language color
function getLanguageColor(language) {
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
    };
    return colors[language] || "#6366f1";
}

// Counter Animation
function animateCounter(element, target) {
    if (!element || !target) return;

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    // Active nav link on scroll
    let current = "";
    document.querySelectorAll("section").forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
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

// Mobile Menu Toggle
const mobileToggle = document.getElementById("mobileToggle");
const navLinksContainer = document.getElementById("navLinks");

mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileToggle.classList.remove("active");
        navLinksContainer.classList.remove("active");
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");

            // Animate skill progress bars
            if (entry.target.classList.contains("skill-card")) {
                const progressBar =
                    entry.target.querySelector(".skill-progress");
                const progress = progressBar.getAttribute("data-progress");
                progressBar.style.setProperty("--progress", progress + "%");
                progressBar.style.width = progress + "%";
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
document.querySelectorAll(".skill-card").forEach((el) => observer.observe(el));

// Projects Slider Variables
let slider, prevBtn, nextBtn, dots, projectCards;
let currentSlide = 0;
let cardWidth = 380; // card width + gap
let autoPlayInterval;

// Initialize Slider
function initializeSlider() {
    slider = document.getElementById("projectsSlider");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    dots = document.querySelectorAll(".dot");
    projectCards = document.querySelectorAll(".project-card");

    // Calculate card width based on screen size
    if (window.innerWidth < 768) {
        cardWidth = 290;
    } else if (window.innerWidth < 1024) {
        cardWidth = 330;
    }

    // Button click events
    prevBtn.addEventListener("click", () => {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1);
        }
        stopAutoPlay();
    });

    nextBtn.addEventListener("click", () => {
        if (currentSlide < projectCards.length - 1) {
            goToSlide(currentSlide + 1);
        }
        stopAutoPlay();
    });

    // Update current slide on scroll
    let scrollTimeout;
    slider.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPosition = slider.scrollLeft;
            currentSlide = Math.round(scrollPosition / cardWidth);
            updateDots();
        }, 150);
    });

    // Touch/Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchStartX - touchEndX > 50) {
            if (currentSlide < projectCards.length - 1) {
                goToSlide(currentSlide + 1);
            }
        }
        if (touchEndX - touchStartX > 50) {
            if (currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }

    // Auto-play
    startAutoPlay();
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);

    // Project card hover effects
    projectCards.forEach((card) => {
        card.addEventListener("mousemove", function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });

        card.addEventListener("mouseleave", function () {
            this.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
        });
    });
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    slider.scrollTo({
        left: cardWidth * index,
        behavior: "smooth",
    });
    updateDots();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        if (currentSlide < projectCards.length - 1) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(0);
        }
    }, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Contact Form
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
        timestamp: new Date().toISOString(),
    };

    try {
        const submissions = JSON.parse(
            localStorage.getItem("contactSubmissions") || "[]"
        );
        submissions.push(formData);
        localStorage.setItem("contactSubmissions", JSON.stringify(submissions));

        contactForm.style.display = "none";
        formSuccess.classList.add("show");

        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = "block";
            formSuccess.classList.remove("show");
        }, 3000);

        console.log("Form submitted:", formData);
    } catch (error) {
        console.error("Error saving form data:", error);
        alert("There was an error submitting your message. Please try again.");
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }
    });
});

// Parallax effect for background orbs
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const orbs = document.querySelectorAll(".gradient-orb");

    orbs.forEach((orb, index) => {
        const speed = 0.5 + index * 0.2;
        const yPos = -(scrolled * speed);
        orb.style.transform = `translateY(${yPos}px)`;
    });
});

// Typing effect
const heroSubtitle = document.querySelector(".hero-subtitle");
const originalText = heroSubtitle.textContent;
let charIndex = 0;

function typeWriter() {
    if (charIndex < originalText.length) {
        heroSubtitle.textContent = originalText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, 100);
    }
}

// Scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    progressBar.id = "scroll-progress";
    document.body.appendChild(progressBar);

    window.addEventListener("scroll", () => {
        const windowHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + "%";
    });
};

createScrollProgress();

// Button ripple effect
document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function (e) {
        const ripple = document.createElement("span");
        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        const rect = this.getBoundingClientRect();
        ripple.style.left = e.clientX - rect.left + "px";
        ripple.style.top = e.clientY - rect.top + "px";

        this.style.position = "relative";
        this.style.overflow = "hidden";
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

if (!document.getElementById("ripple-styles")) {
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = `
        @keyframes ripple {
            to {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Custom cursor for desktop
const cursor = document.createElement("div");
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #6366f1;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    transition: all 0.1s ease;
    transform: translate(-50%, -50%);
    display: none;
`;
document.body.appendChild(cursor);

const cursorFollower = document.createElement("div");
cursorFollower.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: #6366f1;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10001;
    transition: all 0.15s ease;
    transform: translate(-50%, -50%);
    display: none;
`;
document.body.appendChild(cursorFollower);

if (window.innerWidth > 768) {
    cursor.style.display = "block";
    cursorFollower.style.display = "block";

    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";

        setTimeout(() => {
            cursorFollower.style.left = e.clientX + "px";
            cursorFollower.style.top = e.clientY + "px";
        }, 50);
    });

    document
        .querySelectorAll("a, button, .btn, .project-card, .skill-card")
        .forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.style.width = "40px";
                cursor.style.height = "40px";
                cursor.style.borderColor = "#8b5cf6";
            });

            el.addEventListener("mouseleave", () => {
                cursor.style.width = "20px";
                cursor.style.height = "20px";
                cursor.style.borderColor = "#6366f1";
            });
        });
}

// Handle visibility change
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});

// Console message
console.log(
    "%c👋 Hello Developer!",
    "color: #6366f1; font-size: 24px; font-weight: bold;"
);
console.log(
    "%cThanks for checking out the code! 🚀",
    "color: #8b5cf6; font-size: 16px;"
);
console.log(
    "%cBuilt with ❤️ by Md Saddam Hossan",
    "color: #ec4899; font-size: 14px;"
);
console.log(
    "%cGitHub: https://github.com/saddamhosan1",
    "color: #94a3b8; font-size: 12px;"
);

// Initialize on page load
window.addEventListener("load", () => {
    heroSubtitle.textContent = "";
    setTimeout(typeWriter, 500);
    fetchGitHubData();
    fetchGitHubRepos();
    console.log("Portfolio loaded successfully! ✨");
});
