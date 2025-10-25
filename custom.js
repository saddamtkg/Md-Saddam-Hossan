// ========== CONFIGURATION ==========
const GITHUB_USERNAME = "saddamhosan1";
const GITHUB_API_USER = `https://api.github.com/users/${GITHUB_USERNAME}`;
const GITHUB_API_REPOS = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// ========== FALLBACK DATA ==========
const FALLBACK_DATA = {
    name: "Md Saddam Hossan",
    login: "saddamhosan1",
    avatar_url: "https://github.com/saddamhosan1.png",
    bio: "Passionate developer with 5+ years of experience crafting modern web applications and custom websites. Specialized in WordPress solutions, integrating OpraSync Systems, and designing digital experiences.",
    location: "Thakurgaon, Rangpur, Bangladesh",
    email: "goldenseoct54@gmail.com",
    html_url: "https://github.com/saddamhosan1",
    public_repos: 0,
    followers: 0,
    following: 0,
};

// ========== FETCH GITHUB USER DATA ==========
async function fetchGitHubUser() {
    try {
        const res = await fetch(GITHUB_API_USER);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        updateUserUI(data);
    } catch (err) {
        console.error("GitHub user fetch failed:", err);
        updateUserUI(FALLBACK_DATA);
    }
}

// ========== UPDATE USER UI ==========
function updateUserUI(data) {
    const avatar = data.avatar_url || FALLBACK_DATA.avatar_url;
    const name = data.name || data.login || FALLBACK_DATA.name;
    const bio = data.bio || FALLBACK_DATA.bio;
    const location = data.location || FALLBACK_DATA.location;
    const repos = data.public_repos || 0;
    const followers = data.followers || 0;
    const following = data.following || 0;

    // Profile images
    const profileImg = document.getElementById("profileImage");
    const aboutProfileImg = document.getElementById("aboutProfileImage");
    if (profileImg) profileImg.src = avatar;
    if (aboutProfileImg) aboutProfileImg.src = avatar;

    // Names
    const githubName = document.getElementById("githubName");
    const footerName = document.getElementById("footerName");
    if (githubName) githubName.textContent = name;
    if (footerName) footerName.textContent = name;

    // Bio
    const githubBio = document.getElementById("githubBio");
    if (githubBio) githubBio.textContent = bio;

    // Location
    const githubLocation = document.getElementById("githubLocation");
    if (githubLocation) githubLocation.textContent = location;

    // Stats
    const totalRepos = document.getElementById("totalRepos");
    const githubFollowers = document.getElementById("githubFollowers");
    const totalCommits = document.getElementById("totalCommits");
    const followersCount = document.getElementById("followersCount");
    const followingCount = document.getElementById("followingCount");

    if (totalRepos) {
        totalRepos.textContent = repos;
        animateCounter(totalRepos, repos);
    }
    if (githubFollowers) {
        githubFollowers.textContent = followers;
        animateCounter(githubFollowers, followers);
    }
    if (totalCommits) totalCommits.textContent = repos;
    if (followersCount) followersCount.textContent = followers;
    if (followingCount) followingCount.textContent = following;

    // Email links
    const email = data.email || FALLBACK_DATA.email;
    const githubEmail = document.getElementById("githubEmail");
    const emailLink = document.getElementById("emailLink");
    if (githubEmail) {
        githubEmail.textContent = email;
        githubEmail.href = `mailto:${email}`;
    }
    if (emailLink) emailLink.href = `mailto:${email}`;

    // GitHub links
    const githubUsername = document.getElementById("githubUsername");
    const githubLink = document.getElementById("githubLink");
    if (githubUsername) {
        githubUsername.textContent = `@${data.login}`;
        githubUsername.href = data.html_url;
    }
    if (githubLink) githubLink.href = data.html_url;
}

// ========== FETCH GITHUB REPOS ==========
async function fetchGitHubRepos() {
    const loading = document.getElementById("projectsLoading");
    const container = document.getElementById("projectsContainer");

    try {
        const res = await fetch(GITHUB_API_REPOS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const repos = await res.json();

        if (loading) loading.style.display = "none";
        if (container) container.style.display = "block";

        const filtered = repos
            .filter((r) => !r.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count);

        if (filtered.length > 0) {
            displayProjects(filtered);
        } else {
            showNoProjects();
        }
    } catch (err) {
        console.error("GitHub repos fetch failed:", err);
        showError();
    }
}

// ========== DISPLAY PROJECTS ==========
function displayProjects(repos) {
    const slider = document.getElementById("projectsSlider");
    const dots = document.getElementById("sliderDots");

    if (!slider || !dots) return;

    slider.innerHTML = "";
    dots.innerHTML = "";

    repos.forEach((repo, i) => {
        const card = document.createElement("div");
        card.className = "project-card";

        const color = getLanguageColor(repo.language);
        const name = formatName(repo.name);
        const desc =
            repo.description ||
            "A great project built with passion and dedication.";
        const shortDesc =
            desc.length > 120 ? desc.substring(0, 120) + "..." : desc;

        card.innerHTML = `
            <div class="project-image" style="background: linear-gradient(135deg, ${color}33 0%, ${color}11 100%);">
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
                <h3>${name}</h3>
                <p>${shortDesc}</p>
                <div class="project-tags">
                    ${
                        repo.language
                            ? `<span class="tag">${repo.language}</span>`
                            : ""
                    }
                    ${
                        repo.topics
                            ? repo.topics
                                  .slice(0, 2)
                                  .map((t) => `<span class="tag">${t}</span>`)
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

        const dot = document.createElement("div");
        dot.className = "dot";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dots.appendChild(dot);
    });

    setTimeout(initSlider, 100);
}

// ========== HELPER FUNCTIONS ==========
function formatName(name) {
    return name
        .replace(/[-_]/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
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
    };
    return colors[lang] || "#6366f1";
}

function animateCounter(el, target) {
    if (!el || !target) return;
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 20);
}

function showNoProjects() {
    const loading = document.getElementById("projectsLoading");
    if (loading) {
        loading.style.display = "block";
        loading.innerHTML = `<p style="color: var(--text-muted);">No repositories found. Start creating amazing projects!</p>`;
    }
}

function showError() {
    const loading = document.getElementById("projectsLoading");
    if (loading) {
        loading.style.display = "block";
        loading.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #f59e0b; margin-bottom: 20px;"></i>
                <p style="color: var(--text-muted); margin-bottom: 15px;">Unable to load projects from GitHub.</p>
                <button onclick="fetchGitHubRepos()" class="btn btn-primary" style="margin-top: 20px;">
                    Retry <i class="fas fa-redo"></i>
                </button>
            </div>
        `;
    }
}

// ========== SLIDER LOGIC ==========
let currentSlide = 0;
let slider, prevBtn, nextBtn, dots, cards;
let autoPlay;

function initSlider() {
    slider = document.getElementById("projectsSlider");
    prevBtn = document.getElementById("prevBtn");
    nextBtn = document.getElementById("nextBtn");
    dots = document.querySelectorAll(".dot");
    cards = document.querySelectorAll(".project-card");

    if (!slider || !prevBtn || !nextBtn || cards.length === 0) return;

    prevBtn.onclick = () => {
        if (currentSlide > 0) goToSlide(currentSlide - 1);
        stopAutoPlay();
    };

    nextBtn.onclick = () => {
        if (currentSlide < cards.length - 1) goToSlide(currentSlide + 1);
        stopAutoPlay();
    };

    slider.addEventListener("scroll", () => {
        const cardWidth = cards[0].offsetWidth + 30;
        currentSlide = Math.round(slider.scrollLeft / cardWidth);
        updateDots();
    });

    startAutoPlay();
    slider.addEventListener("mouseenter", stopAutoPlay);
    slider.addEventListener("mouseleave", startAutoPlay);
}

function goToSlide(index) {
    currentSlide = index;
    const cardWidth = cards[0].offsetWidth + 30;
    slider.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    updateDots();
}

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
    });
}

function startAutoPlay() {
    stopAutoPlay();
    autoPlay = setInterval(() => {
        if (cards && cards.length > 0) {
            goToSlide(currentSlide < cards.length - 1 ? currentSlide + 1 : 0);
        }
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlay) clearInterval(autoPlay);
}

// ========== NAVBAR ==========
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

    let current = "";
    document.querySelectorAll("section").forEach((section) => {
        const top = section.offsetTop;
        if (window.scrollY >= top - 100) {
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

// ========== MOBILE MENU ==========
const mobileToggle = document.getElementById("mobileToggle");
const navLinksContainer = document.getElementById("navLinks");

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

// ========== INTERSECTION OBSERVER ==========
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("aos-animate");

                if (entry.target.classList.contains("skill-card")) {
                    const bar = entry.target.querySelector(".skill-progress");
                    if (bar) {
                        const progress = bar.getAttribute("data-progress");
                        bar.style.width = progress + "%";
                    }
                }
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
document.querySelectorAll(".skill-card").forEach((el) => observer.observe(el));

// ========== CONTACT FORM ==========
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

if (contactForm && formSuccess) {
    contactForm.onsubmit = (e) => {
        e.preventDefault();

        contactForm.style.display = "none";
        formSuccess.classList.add("show");

        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = "block";
            formSuccess.classList.remove("show");
        }, 3000);
    };
}

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.onclick = (e) => {
        const href = anchor.getAttribute("href");
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
        }
    };
});

// ========== SCROLL PROGRESS ==========
const progress = document.createElement("div");
progress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
    z-index: 10000;
    transition: width 0.1s ease;
`;
document.body.appendChild(progress);

window.addEventListener("scroll", () => {
    const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
    const scrolled = (window.scrollY / h) * 100;
    progress.style.width = scrolled + "%";
});

// ========== TYPING EFFECT ==========
const subtitle = document.querySelector(".hero-subtitle");
if (subtitle) {
    const text = subtitle.textContent;
    let i = 0;
    subtitle.textContent = "";

    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    setTimeout(type, 500);
}

// ========== INITIALIZE ==========
console.log("Portfolio initializing...");
fetchGitHubUser();
fetchGitHubRepos();
console.log("Portfolio loaded! ✨");

// ========== EXPOSE RETRY FUNCTION ==========
window.fetchGitHubRepos = fetchGitHubRepos;
