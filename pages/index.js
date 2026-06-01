use this code to our web site only for Ui.Use our Samar Career Guidance Data.
index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Book Portfolio</title>
    <!-- Boxicons for the social media and tech icons seen in the video -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="book-container">
        <div class="book" id="book">
            
            <!-- PAGE 1: COVER (PROFILE PAGE) -->
            <div class="page" id="p1">
                <div class="front cover-page">
                    <div class="profile-card">
                        <div class="avatar-circle">
                            <i class='bx bx-user-circle'></i>
                        </div>
                        <h1>Mr Skeleton</h1>
                        <p class="subtitle">Web Developer</p>
                        
                        <div class="social-media">
                            <a href="#"><i class='bx bxl-facebook'></i></a>
                            <a href="#"><i class='bx bxl-twitter'></i></a>
                            <a href="#"><i class='bx bxl-instagram'></i></a>
                            <a href="#"><i class='bx bxl-linkedin-square'></i></a>
                        </div>
                        
                        <p class="bio-text">
                            Hi, I'm a Web Developer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque commodi numquam dolor a desicunt.
                        </p>
                        
                        <div class="btn-box">
                            <button class="btn btn-primary" onclick="nextPage()">Download CV</button>
                            <button class="btn btn-secondary" onclick="nextPage()">Contact Me</button>
                        </div>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>Work Experience</h2>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2024 - 2026</span>
                        <h3>Web Developer - Software Pro</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, omnis aspernatur!</p>
                    </div>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2022 - 2024</span>
                        <h3>Graphic Designer - Software Pro</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, omnis aspernatur!</p>
                    </div>
                    <button class="nav-btn next" onclick="nextPage()">Next →</button>
                </div>
            </div>

            <!-- PAGE 2: EDUCATION & SERVICES -->
            <div class="page" id="p2">
                <div class="front standard-page">
                    <h2>Education</h2>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2020 - 2022</span>
                        <h3>Master Degree - University</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2017 - 2020</span>
                        <h3>B.Sc Computer Science</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>My Services</h2>
                    <div class="services-grid">
                        <div class="service-box">
                            <i class='bx bx-code-alt'></i>
                            <h3>Web Dev</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-brush'></i>
                            <h3>UI/UX Design</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-trending-up'></i>
                            <h3>SEO</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-megaphone'></i>
                            <h3>Marketing</h3>
                        </div>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
            </div>

            <!-- PAGE 3: SKILLS & LATEST PROJECT -->
            <div class="page" id="p3">
                <div class="front standard-page">
                    <h2>My Skills</h2>
                    <div class="skills-container">
                        <div class="skill-badge"><i class='bx bxl-html5'></i> HTML</div>
                        <div class="skill-badge"><i class='bx bxl-css3'></i> CSS</div>
                        <div class="skill-badge"><i class='bx bxl-javascript'></i> JS</div>
                        <div class="skill-badge"><i class='bx bxl-react'></i> React</div>
                        <div class="skill-badge"><i class='bx bxl-nodejs'></i> Node</div>
                        <div class="skill-badge"><i class='bx bxl-python'></i> Python</div>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>Latest Project</h2>
                    <div class="project-card">
                        <div class="project-img-placeholder">
                            <i class='bx bx-image-alt'></i>
                        </div>
                        <h3>Project Name</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, expedita?</p>
                        <a href="#" class="project-link">Live Preview <i class='bx bx-link-external'></i></a>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Contact →</button>
                    </div>
                </div>
            </div>

            <!-- PAGE 4: CONTACT & BACK COVER -->
            <div class="page" id="p4">
                <div class="front standard-page">
                    <h2>Contact Me</h2>
                    <form class="ui-form" onsubmit="event.preventDefault();">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email Address" required>
                        <textarea placeholder="Your Message" rows="4" required></textarea>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                    </div>
                </div>
                <div class="back cover-page final-page">
                    <h2>Thank You</h2>
                    <p>The End</p>
                    <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                </div>
            </div>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
.........
style.css
/* Color Palette Variables directly from Video Aesthetic */
:root {
    --bg-dark: #081b29;
    --page-bg: #081b29;
    --accent-blue: #00abf0;
    --text-white: #ededed;
    --text-muted: #999;
    --border-color: #00abf0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-white);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    padding: 20px;
}

/* 3D Viewport Setup */
.book-container {
    perspective: 2000px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.book {
    position: relative;
    width: 420px;
    height: 580px;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform: translateX(0%);
}

/* Page Layering and Physics */
.page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    transform-origin: left center;
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 35px;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    border: 2px solid var(--border-color);
    box-shadow: 0 0 15px rgba(0, 171, 240, 0.2);
}

.front {
    background: var(--page-bg);
    z-index: 2;
    transform: rotateY(0deg);
}

.back {
    background: var(--page-bg);
    transform: rotateY(180deg);
}

.page.flipped {
    transform: rotateY(-180deg);
}

/* UI Formatting: Profile/Cover Page */
.cover-page {
    justify-content: center;
    align-items: center;
    text-align: center;
}

.avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid var(--accent-blue);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    font-size: 5rem;
    color: var(--accent-blue);
}

.subtitle {
    color: var(--accent-blue);
    font-weight: 600;
    margin-top: 5px;
    font-size: 1.1rem;
}

.social-media {
    margin: 15px 0;
    display: flex;
    gap: 12px;
}

.social-media a {
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: var(--accent-blue);
    font-size: 1.3rem;
    text-decoration: none;
    transition: 0.3s;
}

.social-media a:hover {
    background: var(--accent-blue);
    color: var(--bg-dark);
    box-shadow: 0 0 10px var(--accent-blue);
}

.bio-text {
    font-size: 0.9rem;
    color: var(--text-white);
    line-height: 1.5;
    margin-bottom: 20px;
}

.btn-box {
    display: flex;
    gap: 15px;
}

.btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    font-size: 0.9rem;
}

.btn-primary {
    background: var(--accent-blue);
    border: 2px solid var(--accent-blue);
    color: var(--bg-dark);
}

.btn-primary:hover {
    background: transparent;
    color: var(--accent-blue);
    box-shadow: none;
}

.btn-secondary {
    background: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
}

.btn-secondary:hover {
    background: var(--accent-blue);
    color: var(--bg-dark);
}

/* UI Formatting: Internal Content Pages */
.standard-page h2 {
    font-size: 1.8rem;
    color: var(--text-white);
    margin-bottom: 20px;
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 8px;
    display: inline-block;
}

.timeline-item {
    border-left: 2px solid var(--accent-blue);
    padding-left: 15px;
    position: relative;
    margin-bottom: 20px;
}

.timeline-item::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--accent-blue);
    border-radius: 50%;
    left: -6px;
    top: 5px;
}

.timeline-item .year {
    color: var(--accent-blue);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.timeline-item h3 {
    font-size: 1.1rem;
    margin: 5px 0;
}

.timeline-item p {
    font-size: 0.85rem;
    color: var(--text-muted);
}

/* Grid Framework: Services */
.services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 10px;
}

.service-box {
    border: 2px solid var(--accent-blue);
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    transition: 0.3s;
}

.service-box i {
    font-size: 2.5rem;
    color: var(--accent-blue);
    margin-bottom: 8px;
}

.service-box h3 {
    font-size: 1rem;
}

.service-box:hover {
    background: rgba(0, 171, 240, 0.1);
    transform: translateY(-3px);
}

/* Badges Framework: Skills */
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.skill-badge {
    border: 2px solid var(--accent-blue);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 171, 240, 0.05);
}

.skill-badge i {
    font-size: 1.2rem;
    color: var(--accent-blue);
}

/* Components Layout: Project Card */
.project-card {
    border: 2px solid var(--accent-blue);
    border-radius: 6px;
    padding: 15px;
}

.project-img-placeholder {
    height: 140px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: var(--text-muted);
    border-radius: 4px;
    margin-bottom: 12px;
}

.project-card p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 8px 0;
}

.project-link {
    color: var(--accent-blue);
    text-decoration: none;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* UI Formatting: Forms */
.ui-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ui-form input, .ui-form textarea {
    background: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--text-white);
    padding: 10px;
    border-radius: 5px;
    outline: none;
}

.ui-form input::placeholder, .ui-form textarea::placeholder {
    color: var(--text-muted);
}

/* Nav Execution Controllers */
.page-footer-nav {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
}

.nav-btn {
    background: transparent;
    border: none;
    color: var(--accent-blue);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 5px 10px;
    transition: 0.2s;
}

.nav-btn:hover {
    text-shadow: 0 0 8px var(--accent-blue);
}

.nav-btn.next {
    margin-left: auto;
    margin-top: auto;
}

.nav-btn.prev {
    margin-right: auto;
    margin-top: auto;
}

/* Mobile Adaptive Viewport Fallback */
@media (max-width: 768px) {
    body {
        overflow-y: auto;
        display: block;
    }
    .book-container {
        perspective: none;
        display: block;
    }
    .book {
        width: 100%;
        height: auto;
        transform: none !important;
    }
    .page {
        position: relative;
        width: 100%;
        height: auto;
        transform: none !important;
        margin-bottom: 25px;
        z-index: auto !important;
    }
    .front, .back {
        position: relative;
        width: 100%;
        height: auto;
        backface-visibility: visible;
        transform: none !important;
        padding: 30px 20px;
        border-radius: 6px;
    }
    .back {
        margin-top: 15px;
    }
    .nav-btn, .page-footer-nav {
        display: none !important;
    }
    .final-page {
        display: none !important;
    }
}
..........
script.js
let currentLoc = 1;
const totalPages = 4; // Incremented to match the actual page sequence count
const maxLoc = totalPages + 1;
const book = document.getElementById("book");

function updateZIndices() {
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById(`p${i}`);
        if (i < currentLoc) {
            page.style.zIndex = i;
        } else {
            page.style.zIndex = totalPages - i + 1;
        }
    }

    // Centering alignment logic based on state progression
    if (window.innerWidth > 768) {
        if (currentLoc === 1) {
            book.style.transform = "translateX(0%)";
        } else if (currentLoc === maxLoc) {
            book.style.transform = "translateX(100%)";
        } else {
            book.style.transform = "translateX(50%)";
        }
    }
}

function nextPage() {
    if (currentLoc < maxLoc) {
        const currentPage = document.getElementById(`p${currentLoc}`);
        currentPage.classList.add("flipped");
        currentLoc++;
        updateZIndices();
    }
}

function prevPage() {
    if (currentLoc > 1) {
        currentLoc--;
        const currentPage = document.getElementById(`p${currentLoc}`);
        currentPage.classList.remove("flipped");
        updateZIndices();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth > 768) {
        updateZIndices();use this code to our web site only for Ui.Use our Samar Career Guidance Data.
index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Book Portfolio</title>
    <!-- Boxicons for the social media and tech icons seen in the video -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div class="book-container">
        <div class="book" id="book">
            
            <!-- PAGE 1: COVER (PROFILE PAGE) -->
            <div class="page" id="p1">
                <div class="front cover-page">
                    <div class="profile-card">
                        <div class="avatar-circle">
                            <i class='bx bx-user-circle'></i>
                        </div>
                        <h1>Mr Skeleton</h1>
                        <p class="subtitle">Web Developer</p>
                        
                        <div class="social-media">
                            <a href="#"><i class='bx bxl-facebook'></i></a>
                            <a href="#"><i class='bx bxl-twitter'></i></a>
                            <a href="#"><i class='bx bxl-instagram'></i></a>
                            <a href="#"><i class='bx bxl-linkedin-square'></i></a>
                        </div>
                        
                        <p class="bio-text">
                            Hi, I'm a Web Developer. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque commodi numquam dolor a desicunt.
                        </p>
                        
                        <div class="btn-box">
                            <button class="btn btn-primary" onclick="nextPage()">Download CV</button>
                            <button class="btn btn-secondary" onclick="nextPage()">Contact Me</button>
                        </div>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>Work Experience</h2>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2024 - 2026</span>
                        <h3>Web Developer - Software Pro</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, omnis aspernatur!</p>
                    </div>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2022 - 2024</span>
                        <h3>Graphic Designer - Software Pro</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, omnis aspernatur!</p>
                    </div>
                    <button class="nav-btn next" onclick="nextPage()">Next →</button>
                </div>
            </div>

            <!-- PAGE 2: EDUCATION & SERVICES -->
            <div class="page" id="p2">
                <div class="front standard-page">
                    <h2>Education</h2>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2020 - 2022</span>
                        <h3>Master Degree - University</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                    <div class="timeline-item">
                        <span class="year"><i class='bx bx-calendar'></i> 2017 - 2020</span>
                        <h3>B.Sc Computer Science</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>My Services</h2>
                    <div class="services-grid">
                        <div class="service-box">
                            <i class='bx bx-code-alt'></i>
                            <h3>Web Dev</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-brush'></i>
                            <h3>UI/UX Design</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-trending-up'></i>
                            <h3>SEO</h3>
                        </div>
                        <div class="service-box">
                            <i class='bx bx-megaphone'></i>
                            <h3>Marketing</h3>
                        </div>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
            </div>

            <!-- PAGE 3: SKILLS & LATEST PROJECT -->
            <div class="page" id="p3">
                <div class="front standard-page">
                    <h2>My Skills</h2>
                    <div class="skills-container">
                        <div class="skill-badge"><i class='bx bxl-html5'></i> HTML</div>
                        <div class="skill-badge"><i class='bx bxl-css3'></i> CSS</div>
                        <div class="skill-badge"><i class='bx bxl-javascript'></i> JS</div>
                        <div class="skill-badge"><i class='bx bxl-react'></i> React</div>
                        <div class="skill-badge"><i class='bx bxl-nodejs'></i> Node</div>
                        <div class="skill-badge"><i class='bx bxl-python'></i> Python</div>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Next →</button>
                    </div>
                </div>
                <div class="back standard-page">
                    <h2>Latest Project</h2>
                    <div class="project-card">
                        <div class="project-img-placeholder">
                            <i class='bx bx-image-alt'></i>
                        </div>
                        <h3>Project Name</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio, expedita?</p>
                        <a href="#" class="project-link">Live Preview <i class='bx bx-link-external'></i></a>
                    </div>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                        <button class="nav-btn next" onclick="nextPage()">Contact →</button>
                    </div>
                </div>
            </div>

            <!-- PAGE 4: CONTACT & BACK COVER -->
            <div class="page" id="p4">
                <div class="front standard-page">
                    <h2>Contact Me</h2>
                    <form class="ui-form" onsubmit="event.preventDefault();">
                        <input type="text" placeholder="Full Name" required>
                        <input type="email" placeholder="Email Address" required>
                        <textarea placeholder="Your Message" rows="4" required></textarea>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                    <div class="page-footer-nav">
                        <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                    </div>
                </div>
                <div class="back cover-page final-page">
                    <h2>Thank You</h2>
                    <p>The End</p>
                    <button class="nav-btn prev" onclick="prevPage()">← Back</button>
                </div>
            </div>

        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
.........
style.css
/* Color Palette Variables directly from Video Aesthetic */
:root {
    --bg-dark: #081b29;
    --page-bg: #081b29;
    --accent-blue: #00abf0;
    --text-white: #ededed;
    --text-muted: #999;
    --border-color: #00abf0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
}

body {
    background-color: var(--bg-dark);
    color: var(--text-white);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    padding: 20px;
}

/* 3D Viewport Setup */
.book-container {
    perspective: 2000px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.book {
    position: relative;
    width: 420px;
    height: 580px;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform: translateX(0%);
}

/* Page Layering and Physics */
.page {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    transform-style: preserve-3d;
    transform-origin: left center;
    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.front, .back {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 35px;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    border: 2px solid var(--border-color);
    box-shadow: 0 0 15px rgba(0, 171, 240, 0.2);
}

.front {
    background: var(--page-bg);
    z-index: 2;
    transform: rotateY(0deg);
}

.back {
    background: var(--page-bg);
    transform: rotateY(180deg);
}

.page.flipped {
    transform: rotateY(-180deg);
}

/* UI Formatting: Profile/Cover Page */
.cover-page {
    justify-content: center;
    align-items: center;
    text-align: center;
}

.avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid var(--accent-blue);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    font-size: 5rem;
    color: var(--accent-blue);
}

.subtitle {
    color: var(--accent-blue);
    font-weight: 600;
    margin-top: 5px;
    font-size: 1.1rem;
}

.social-media {
    margin: 15px 0;
    display: flex;
    gap: 12px;
}

.social-media a {
    width: 40px;
    height: 40px;
    border: 2px solid var(--accent-blue);
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: var(--accent-blue);
    font-size: 1.3rem;
    text-decoration: none;
    transition: 0.3s;
}

.social-media a:hover {
    background: var(--accent-blue);
    color: var(--bg-dark);
    box-shadow: 0 0 10px var(--accent-blue);
}

.bio-text {
    font-size: 0.9rem;
    color: var(--text-white);
    line-height: 1.5;
    margin-bottom: 20px;
}

.btn-box {
    display: flex;
    gap: 15px;
}

.btn {
    padding: 10px 20px;
    border-radius: 5px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    font-size: 0.9rem;
}

.btn-primary {
    background: var(--accent-blue);
    border: 2px solid var(--accent-blue);
    color: var(--bg-dark);
}

.btn-primary:hover {
    background: transparent;
    color: var(--accent-blue);
    box-shadow: none;
}

.btn-secondary {
    background: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--accent-blue);
}

.btn-secondary:hover {
    background: var(--accent-blue);
    color: var(--bg-dark);
}

/* UI Formatting: Internal Content Pages */
.standard-page h2 {
    font-size: 1.8rem;
    color: var(--text-white);
    margin-bottom: 20px;
    border-bottom: 2px solid var(--accent-blue);
    padding-bottom: 8px;
    display: inline-block;
}

.timeline-item {
    border-left: 2px solid var(--accent-blue);
    padding-left: 15px;
    position: relative;
    margin-bottom: 20px;
}

.timeline-item::before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--accent-blue);
    border-radius: 50%;
    left: -6px;
    top: 5px;
}

.timeline-item .year {
    color: var(--accent-blue);
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.timeline-item h3 {
    font-size: 1.1rem;
    margin: 5px 0;
}

.timeline-item p {
    font-size: 0.85rem;
    color: var(--text-muted);
}

/* Grid Framework: Services */
.services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-top: 10px;
}

.service-box {
    border: 2px solid var(--accent-blue);
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    transition: 0.3s;
}

.service-box i {
    font-size: 2.5rem;
    color: var(--accent-blue);
    margin-bottom: 8px;
}

.service-box h3 {
    font-size: 1rem;
}

.service-box:hover {
    background: rgba(0, 171, 240, 0.1);
    transform: translateY(-3px);
}

/* Badges Framework: Skills */
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.skill-badge {
    border: 2px solid var(--accent-blue);
    padding: 8px 15px;
    border-radius: 4px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 171, 240, 0.05);
}

.skill-badge i {
    font-size: 1.2rem;
    color: var(--accent-blue);
}

/* Components Layout: Project Card */
.project-card {
    border: 2px solid var(--accent-blue);
    border-radius: 6px;
    padding: 15px;
}

.project-img-placeholder {
    height: 140px;
    background: rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: var(--text-muted);
    border-radius: 4px;
    margin-bottom: 12px;
}

.project-card p {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 8px 0;
}

.project-link {
    color: var(--accent-blue);
    text-decoration: none;
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

/* UI Formatting: Forms */
.ui-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.ui-form input, .ui-form textarea {
    background: transparent;
    border: 2px solid var(--accent-blue);
    color: var(--text-white);
    padding: 10px;
    border-radius: 5px;
    outline: none;
}

.ui-form input::placeholder, .ui-form textarea::placeholder {
    color: var(--text-muted);
}

/* Nav Execution Controllers */
.page-footer-nav {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
}

.nav-btn {
    background: transparent;
    border: none;
    color: var(--accent-blue);
    font-weight: 600;
    cursor: pointer;
    font-size: 0.95rem;
    padding: 5px 10px;
    transition: 0.2s;
}

.nav-btn:hover {
    text-shadow: 0 0 8px var(--accent-blue);
}

.nav-btn.next {
    margin-left: auto;
    margin-top: auto;
}

.nav-btn.prev {
    margin-right: auto;
    margin-top: auto;
}

/* Mobile Adaptive Viewport Fallback */
@media (max-width: 768px) {
    body {
        overflow-y: auto;
        display: block;
    }
    .book-container {
        perspective: none;
        display: block;
    }
    .book {
        width: 100%;
        height: auto;
        transform: none !important;
    }
    .page {
        position: relative;
        width: 100%;
        height: auto;
        transform: none !important;
        margin-bottom: 25px;
        z-index: auto !important;
    }
    .front, .back {
        position: relative;
        width: 100%;
        height: auto;
        backface-visibility: visible;
        transform: none !important;
        padding: 30px 20px;
        border-radius: 6px;
    }
    .back {
        margin-top: 15px;
    }
    .nav-btn, .page-footer-nav {
        display: none !important;
    }
    .final-page {
        display: none !important;
    }
}
..........
script.js
let currentLoc = 1;
const totalPages = 4; // Incremented to match the actual page sequence count
const maxLoc = totalPages + 1;
const book = document.getElementById("book");

function updateZIndices() {
    for (let i = 1; i <= totalPages; i++) {
        const page = document.getElementById(`p${i}`);
        if (i < currentLoc) {
            page.style.zIndex = i;
        } else {
            page.style.zIndex = totalPages - i + 1;
        }
    }

    // Centering alignment logic based on state progression
    if (window.innerWidth > 768) {
        if (currentLoc === 1) {
            book.style.transform = "translateX(0%)";
        } else if (currentLoc === maxLoc) {
            book.style.transform = "translateX(100%)";
        } else {
            book.style.transform = "translateX(50%)";
        }
    }
}

function nextPage() {
    if (currentLoc < maxLoc) {
        const currentPage = document.getElementById(`p${currentLoc}`);
        currentPage.classList.add("flipped");
        currentLoc++;
        updateZIndices();
    }
}

function prevPage() {
    if (currentLoc > 1) {
        currentLoc--;
        const currentPage = document.getElementById(`p${currentLoc}`);
        currentPage.classList.remove("flipped");
        updateZIndices();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth > 768) {
        updateZIndices();
    }
});import { useState } from 'react';
import { useRouter } from 'next/router';

export default function HomeLanding() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const uiContent = {
    en: {
      brand: "Samar Career Guidance",
      founder: "Founder: Dr. Ashfaque Umar",
      alertText: "🔥 Notification Alert: Government Approved Career Alignment Matrix Now Live! Explore Over 150+ Dynamic Strategic Stems.",
      heroTitle: "Samar Career Guidance Platform",
      heroSub: "Discover the perfect career path with enterprise-grade data protection and analytical student profiling matrices.",
      btnStart: "Start Assessment Test",
      btnLogin: "Student Login",
      navHome: "Home",
      navAbout: "About Us",
      navCategory: "Explore Categories",
      navContact: "Contact Us",
      searchPlaceholder: "Search courses instantly...",
      footerNote: "© 2026 Samar Foundation. Enterprise-Grade Architecture Layer Protection Locked.",
      contactTitle: "Contact Professional Help Desk",
      contactDetails: "For analytical matrix guidelines, reach out directly to management desk:",
      ownerLabel: "Platform Controller: Ameen Khan (Umrain Medical Desk)",
      contactPhone: "Official Verification Line: +91 9270323128"
    },
    ur: {
      brand: "ثمر کیریئر رہنمائی",
      founder: "بانی: ڈاکٹر اشفاق عمر",
      alertText: "🔥 نوٹیفکیشن الرٹ: گورنمنٹ منظور شدہ کیریئر الائنمنٹ میٹرکس اب لائیو ہے! 150 سے زیادہ تعلیمی شعبے دریافت کریں۔",
      heroTitle: "ثمر کیریئر رہنمائی پلیٹ فارم",
      heroSub: "انٹرپرائز گریڈ ڈیٹا پروٹیکشن اور اینالیٹیکل اسٹوڈنٹ پروفائلنگ میٹرکس کے ساتھ کامل تعلیمی راستے تلاش کریں۔",
      btnStart: "کیریئر اسیسمنٹ ٹیسٹ شروع کریں",
      btnLogin: "اسٹوڈنٹ لاگ ان",
      navHome: "ہوم پیج",
      navAbout: "ہمارے بارے میں",
      navCategory: "تعلیمی زمرے",
      navContact: "رابطہ کریں",
      searchPlaceholder: "فوری طور پر کورسز تلاش کریں...",
      footerNote: "© 2026 ثمر فاؤنڈیشن۔ انٹرپرائز گریڈ آرکیٹیکچر پروٹیکشن لاکڈ۔",
      contactTitle: "پروفیشنل ہیلپ ڈیسک سے رابطہ کریں",
      contactDetails: "اینالیٹیکل میٹرکس گائیڈ لائنز کے لیے، براہ راست مینجمنٹ ڈیسک سے رابطہ کریں:",
      ownerLabel: "پلیٹ فارم کنٹرولر: امین خان (عمرین میڈیکل ڈیسک)",
      contactPhone: "آفیشل ویریفیکیشن لائن: +91 9270323128"
    }
  };

  const t = uiContent[lang];
  const urduFont = "'AlviNastaleeq', 'UrduFont', 'Tahoma', sans-serif";
  const englishFont = "'Segoe UI', Roboto, sans-serif";

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/categories?search=${encodeURIComponent(searchQuery.trim().toLowerCase())}`);
    }
  };

  return (
    <div style={{
      direction: lang === 'ur' ? 'rtl' : 'ltr',
      fontFamily: lang === 'ur' ? urduFont : englishFont,
      backgroundColor: '#0f172a',
      backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), radial-gradient(rgba(56, 189, 248, 0.15) 1px, #0f172a 1px)`,
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 12px 12px',
      minHeight: '100vh',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      overflowX: 'hidden'
    }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @font-face { font-family: 'AlviNastaleeq'; src: url('/alvi-nastaleeq.ttf') format('truetype'); font-display: swap; }
        @font-face { font-family: 'UrduFont'; src: url('https://fonts.gstatic.com/ea/notonastaleequrdu/v5/NotoNastaleeqUrdu-Regular.woff2') format('woff2'); font-display: swap; }
        .marquee-container { background: rgba(30, 41, 59, 0.6); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 0; overflow: hidden; white-space: nowrap; width: 100%; }
        .marquee-text { display: inline-block; padding-left: 100%; animation: marquee 25s linear infinite; font-size: 0.9rem; font-weight: 600; color: #cbd5e1; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
      `}} />
      
      {/* FULL WIDTH NAVBAR */}
      <nav style={{ width: '100%', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100, padding: '15px 5%' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
            <div>
              <h1 style={{ margin: 0, color: '#38bdf8', fontSize: '1.4rem', fontWeight: '800' }}>{t.brand}</h1>
              <small style={{ color: '#ff7a00', fontWeight: 'bold', display: 'block', marginTop: '-2px' }}>{t.founder}</small>
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ flex: '1', maxWidth: '500px', minWidth: '200px', margin: '0 20px' }}>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder} 
              style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', position: 'relative' }}>
            <button onClick={() => router.push('/')} style={{ color: '#38bdf8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navHome}</button>
            <button onClick={() => router.push('/about')} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navAbout}</button>
            
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowCategoryMenu(!showCategoryMenu)} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                {t.navCategory} ▾
              </button>
              {showCategoryMenu && (
                <div style={{ position: 'absolute', top: '40px', left: lang === 'ur' ? 'auto' : '0', right: lang === 'ur' ? '0' : 'auto', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', width: '260px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 200, padding: '10px 0' }}>
                  <button onClick={() => { router.push('/categories?stream=science'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>🧪 Science Stems</button>
                  <button onClick={() => { router.push('/categories?stream=commerce'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>📊 Commerce Hub</button>
                  <button onClick={() => { router.push('/categories?stream=paramedical'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>🩺 Paramedical & Medical</button>
                  <button onClick={() => { router.push('/categories?stream=btech'); setShowCategoryMenu(false); }} style={{ display: 'block', width: '100%', padding: '12px 20px', background: 'transparent', border: 'none', color: '#cbd5e1', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', textAlign: lang === 'ur' ? 'right' : 'left' }}>⚙️ Engineering Tech</button>
                </div>
              )}
            </div>

            <button onClick={() => setShowContactModal(true)} style={{ color: '#94a3b8', fontWeight: '700', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>{t.navContact}</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button onClick={() => router.push('/login')} style={{ padding: '10px 20px', background: '#38bdf8', border: 'none', color: '#0f172a', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(56,189,248,0.3)' }}>{t.btnLogin}</button>
            <button onClick={() => setLang(lang === 'en' ? 'ur' : 'en')} style={{ padding: '8px 16px', background: '#ff7a00', border: 'none', color: '#fff', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}>{lang === 'en' ? 'اردو' : 'English'}</button>
          </div>

        </div>
      </nav>

      <div className="marquee-container">
        <div className="marquee-text" style={{ paddingLeft: lang === 'ur' ? '0' : '100%', paddingRight: lang === 'ur' ? '100%' : '0', animationDirection: lang === 'ur' ? 'reverse' : 'normal' }}>
          {t.alertText}
        </div>
      </div>

      {/* FULL WIDTH HERO SECTION */}
      <main style={{ flex: 1, width: '100%', padding: '100px 5%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#fff', margin: '0 0 25px 0', letterSpacing: '-1px', lineHeight: '1.1' }}>
          {t.heroTitle}
        </h2>
        <p style={{ fontSize: '1.4rem', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 50px auto', lineHeight: '1.6', fontWeight: '500' }}>
          {t.heroSub}
        </p>
        <button onClick={() => router.push('/assessment')} style={{ padding: '18px 50px', background: '#00b074', border: 'none', color: '#fff', borderRadius: '10px', fontSize: '1.25rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0, 176, 116, 0.4)', transition: '0.2s' }}>
          {t.btnStart}
        </button>
      </main>

      {showContactModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '40px', maxWidth: '550px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: lang === 'ur' ? 'right' : 'left' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#38bdf8', fontSize: '1.5rem', fontWeight: '800' }}>{t.contactTitle}</h4>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 25px 0' }}>{t.contactDetails}</p>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: '8px', borderLeft: lang === 'en' ? '4px solid #ff7a00' : 'none', borderRight: lang === 'ur' ? '4px solid #ff7a00' : 'none', marginBottom: '30px' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', fontSize: '1rem' }}>📍 {t.ownerLabel}</p>
              <p style={{ margin: 0, fontWeight: '800', color: '#ff7a00', fontSize: '1.1rem' }}>📞 {t.contactPhone}</p>
            </div>
            <button onClick={() => setShowContactModal(false)} style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Close Window</button>
          </div>
        </div>
      )}

      <footer style={{ width: '100%', background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#475569', fontWeight: '700' }}>
        {t.footerNote}
      </footer>
    </div>
  );
}
    }
});
