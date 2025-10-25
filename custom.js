// GitHub Configuration
const GITHUB_USERNAME = "saddamhosan1";
const GITHUB_API = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_REPOS_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Add fallback data in case API fails
const FALLBACK_DATA = {
    name: "Md Saddam Hossan",
    bio: "Passionate developer with 5+ years of experience crafting modern web applications and custom websites. Specialized in WordPress solutions, integrating OpraSync Systems, and designing digital experiences.",
    avatar_url: "https://github.com/saddamhosan1.png",
    public_repos: 0,
    followers: 0,
    following: 0,
    location: "Thakurgaon, Rangpur, Bangladesh",
    email: "goldenseoct54@gmail.com",
    login: "saddamhosan1",
    html_url: "https://github.com/saddamhosan1",
};

// Fetch GitHub User Data with better error handling
async function fetchGitHubData() {
    try {
        console.log("Fetching GitHub user data...");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(GITHUB_API, {
            signal: controller.signal,
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("GitHub data received:", data);

        updateUIWithData(data);
        console.log("GitHub user data updated successfully!");
    } catch (error) {
        console.error("Error fetching GitHub user data:", error);
        console.log("Using fallback data...");
        updateUIWithData(FALLBACK_DATA);
    }
}

// Separate function to update UI with data
function updateUIWithData(data) {
    // Update profile images
    const profileImg = document.getElementById("profileImage");
    const aboutProfileImg = document.getElementById("aboutProfileImage");

    if (profileImg && data.avatar_url) {
        profileImg.src = data.avatar_url;
        profileImg.onerror = () => {
            console.error("Error loading profile image");
            profileImg.src = "https://via.placeholder.com/400x400?text=Profile";
        };
    }

    if (aboutProfileImg && data.avatar_url) {
        aboutProfileImg.src = data.avatar_url;
        aboutProfileImg.onerror = () => {
            console.error("Error loading about profile image");
            aboutProfileImg.src =
                "https://via.placeholder.com/400x400?text=Profile";
        };
    }

    // Update name
    const displayName = data.name || GITHUB_USERNAME;
    const nameElement = document.getElementById("githubName");
    const footerNameElement = document.getElementById("footerName");

    if (nameElement) nameElement.textContent = displayName;
    if (footerNameElement) footerNameElement.textContent = displayName;

    // Update bio
    const bioElement = document.getElementById("githubBio");
    if (bioElement && data.bio) {
        bioElement.textContent = data.bio;
    }

    // Update stats with animation
    const totalReposElement = document.getElementById("totalRepos");
    const followersElement = document.getElementById("githubFollowers");
    const commitsElement = document.getElementById("totalCommits");
    const followersCountElement = document.getElementById("followersCount");
    const followingCountElement = document.getElementById("followingCount");

    if (totalReposElement) {
        totalReposElement.textContent = data.public_repos || "0";
        setTimeout(
            () => animateCounter(totalReposElement, data.public_repos || 0),
            500
        );
    }

    if (followersElement) {
        followersElement.textContent = data.followers || "0";
        setTimeout(
            () => animateCounter(followersElement, data.followers || 0),
            700
        );
    }

    if (commitsElement) commitsElement.textContent = data.public_repos || "0";
    if (followersCountElement)
        followersCountElement.textContent = data.followers || "0";
    if (followingCountElement)
        followingCountElement.textContent = data.following || "0";

    // Update location
    const locationElement = document.getElementById("githubLocation");
    if (locationElement && data.location) {
        locationElement.textContent = data.location;
    }

    // Update email
    const emailElement = document.getElementById("githubEmail");
    const emailLinkElement = document.getElementById("emailLink");

    if (data.email) {
        if (emailElement) {
            emailElement.textContent = data.email;
            emailElement.href = `mailto:${data.email}`;
        }
        if (emailLinkElement) {
            emailLinkElement.href = `mailto:${data.email}`;
        }
    }

    // Update GitHub links
    const usernameElement = document.getElementById("githubUsername");
    const githubLinkElement = document.getElementById("githubLink");

    if (usernameElement) {
        usernameElement.textContent = `@${data.login}`;
        usernameElement.href = data.html_url;
    }
    if (githubLinkElement) {
        githubLinkElement.href = data.html_url;
    }
}

// Fetch GitHub Repositories with better error handling
async function fetchGitHubRepos() {
    const loadingElement = document.getElementById("projectsLoading");
    const containerElement = document.getElementById("projectsContainer");

    try {
        console.log("Fetching GitHub repositories...");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(GITHUB_REPOS_API, {
            signal: controller.signal,
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();
        console.log(`Fetched ${repos.length} repositories`);

        // Hide loading, show container
        if (loadingElement) loadingElement.style.display = "none";
        if (containerElement) containerElement.style.display = "block";

        // Filter out forks and sort by stars
        const filteredRepos = repos
            .filter((repo) => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        console.log(`Displaying ${filteredRepos.length} repositories`);

        if (filteredRepos.length > 0) {
            displayProjects(filteredRepos);
        } else {
            if (loadingElement) {
                loadingElement.style.display = "block";
                loadingElement.innerHTML = `
                    <p style="color: var(--text-muted);">No repositories found. Start creating amazing projects!</p>
                `;
            }
        }
    } catch (error) {
        console.error("Error fetching repositories:", error);
        if (loadingElement) {
            loadingElement.style.display = "block";
            loadingElement.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f59e0b; margin-bottom: 20px;"></i>
                    <p style="color: var(--text-muted); margin-bottom: 15px;">Unable to load projects from GitHub.</p>
                    <p style="color: var(--text-muted); font-size: 14px;">Please check your internet connection or try again later.</p>
                    <button onclick="fetchGitHubRepos()" class="btn btn-primary" style="margin-top: 20px;">
                        Retry <i class="fas fa-redo"></i>
                    </button>
                </div>
            `;
        }
    }
}

// Display Projects
function displayProjects(repos) {
    const slider = document.getElementById("projectsSlider");
    const dotsContainer = document.getElementById("sliderDots");

    if (!slider || !dotsContainer) {
        console.error("Slider elements not found");
        return;
    }

    slider.innerHTML = "";
    dotsContainer.innerHTML = "";

    console.log("Creating project cards...");

    repos.forEach((repo, index) => {
        // Create project card
        const card = document.createElement("div");
        card.className = "project-card";

        // Get language color
        const languageColor = getLanguageColor(repo.language);

        // Format description
        const description =
            repo.description ||
            "A great project built with passion and dedication.";
        const truncatedDescription =
            description.length > 120
                ? description.substring(0, 120) + "..."
                : description;

        // Format repo name
        const formattedName = repo.name
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

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
                <h3>${formattedName}</h3>
                <p>${truncatedDescription}</p>
                <div class="project-tags">
                    ${
                        repo.language
                            ? `<span class="tag">${repo.language}</span>`
                            : ""
                    }
                    ${
                        repo.topics && repo.topics.length > 0
                            ? repo.topics
                                  .slice(0, 2)
                                  .map(
                                      (topic) =>
                                          `<span class="tag">${topic}</span>`
                                  )
                                  .join("")
                            : ""
                    }
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
                            ? '<span><i class="fas fa-link"></i> Live</span>'
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

    console.log(`Created ${repos.length} project cards`);

    // Initialize slider after a short delay
    setTimeout(() => {
        initializeSlider();
    }, 100);
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

if (mobileToggle && navLinksContainer) {
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
}

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
                if (progressBar) {
                    const progress = progressBar.getAttribute("data-progress");
                    progressBar.style.setProperty("--progress", progress + "%");
                    progressBar.style.width = progress + "%";
                }
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
let cardWidth = 380;
let autoPlayInterval;

// Initialize Slider
function initializeSlider() {
    slider = document.getElementById("projectsSlider");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    dots = document.querySelectorAll(".dot");
    projectCards = document.querySelectorAll(".project-card");

    if (!slider || !prevBtn || !nextBtn || projectCards.length === 0) {
        console.log("Slider elements not fully loaded yet");
        return;
    }

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
    if (slider) {
        slider.scrollTo({
            left: cardWidth * index,
            behavior: "smooth",
        });
        updateDots();
    }
}

function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    autoPlayInterval = setInterval(() => {
        if (projectCards && projectCards.length > 0) {
            if (currentSlide < projectCards.length - 1) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(0);
            }
        }
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Contact Form
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm && formSuccess) {
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
            // Try to save to localStorage (may fail in some environments)
            try {
                const submissions = JSON.parse(
                    localStorage.getItem("contactSubmissions") || "[]"
                );
                submissions.push(formData);
                localStorage.setItem(
                    "contactSubmissions",
                    JSON.stringify(submissions)
                );
            } catch (storageError) {
                console.log("LocalStorage not available:", storageError);
            }

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
            alert(
                "There was an error submitting your message. Please try again."
            );
        }
    });
}

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
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    let charIndex = 0;

    function typeWriter() {
        if (charIndex < originalText.length) {
            heroSubtitle.textContent = originalText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect
    window.addEventListener("load", () => {
        heroSubtitle.textContent = "";
        setTimeout(typeWriter, 500);
    });
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
if (window.innerWidth > 768) {
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
    `;
    document.body.appendChild(cursorFollower);

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

// Initialize on page load with retry mechanism
let initAttempts = 0;
const maxAttempts = 3;

function initializePortfolio() {
    initAttempts++;
    console.log(
        `Portfolio initialization attempt ${initAttempts}/${maxAttempts}`
    );

    // Fetch GitHub data
    fetchGitHubData();

    // Fetch repositories
    fetchGitHubRepos();

    console.log("Portfolio initialized! ✨");
}

// Try multiple initialization strategies
window.addEventListener("load", initializePortfolio);

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");

    // Wait a bit and try again if needed
    setTimeout(() => {
        const profileImg = document.getElementById("profileImage");
        if (
            profileImg &&
            (profileImg.src.includes("placeholder") || !profileImg.complete)
        ) {
            console.log("Retrying initialization...");
            initializePortfolio();
        }
    }, 2000);
});

// Final fallback after 5 seconds
setTimeout(() => {
    if (initAttempts === 0) {
        console.log("Final fallback initialization");
        initializePortfolio();
    }
}, 5000);
