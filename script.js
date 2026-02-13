// ====================================
// CONFIGURATION GLOBALE
// ====================================
const CONFIG = {
    countdownTarget: new Date("April 15, 2026 22:59:00").getTime(),
    animationDelay: 61, 
    scrollThreshold: 0.1
};

// ====================================
// UTILITAIRES
// ====================================
const Utils = {
    select: (selector) => document.querySelector(selector),
    selectAll: (selector) => document.querySelectorAll(selector),
    padZero: (num) => String(num).padStart(2, '0')
};

// ====================================
// MODULE: MENU MOBILE (Bouton Burger)
// ====================================
const MobileMenu = {
    init() {
        const menuBtn = Utils.select("#menuBtn");
        const navMenu = Utils.select("nav ul");
        
        if (!menuBtn || !navMenu) return;
        
        menuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle("show");
            menuBtn.textContent = isOpen ? "✕" : "☰";
            
            if (!isOpen) MobileDropdown.closeAll();
        });

        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768 && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove("show");
                menuBtn.textContent = "☰";
                MobileDropdown.closeAll();
            }
        });
    }
};

// ====================================
// MODULE: DROPDOWN MOBILE (UN SEUL CLIC)
// ====================================
const MobileDropdown = {
    init() {
        const dropdowns = Utils.selectAll(".dropdown-custom");

        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector(".dropdown-toggle");

            link.addEventListener("click", (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isOpen = dropdown.classList.contains("open");
                    this.closeAll();

                    if (!isOpen) {
                        dropdown.classList.add("open");
                    }
                }
            });
        });
    },

    closeAll() {
        Utils.selectAll(".dropdown-custom.open").forEach(openDrp => {
            openDrp.classList.remove("open");
        });
    }
};

// ====================================
// MODULE: BOUTON "VOIR PLUS" - VERSION AMÉLIORÉE
// ====================================
const ToggleContent = {
    init() {
        const profileCards = Utils.selectAll(".profile-card");
        
        console.log(`Found ${profileCards.length} profile cards`);

        profileCards.forEach((card, index) => {
            const btn = card.querySelector(".btn-read-more");
            const content = card.querySelector(".more-text");

            if (btn && content) {
                console.log(`Initializing card ${index + 1}`);
                
                // S'assurer que le contenu commence caché
                content.classList.remove("expanded");
                btn.textContent = "Voir plus";
                
                // Ajouter l'écouteur d'événement
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isExpanded = content.classList.toggle("expanded");
                    btn.textContent = isExpanded ? "Voir moins" : "Voir plus";
                    
                    console.log(`Card ${index + 1}: ${isExpanded ? 'Expanded' : 'Collapsed'}`);
                    
                    // Scroll doux vers le contenu si on l'ouvre
                    if (isExpanded) {
                        setTimeout(() => {
                            content.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'nearest' 
                            });
                        }, 300);
                    }
                });
            } else {
                console.warn(`Card ${index + 1}: Missing button or content`, {
                    hasButton: !!btn,
                    hasContent: !!content
                });
            }
        });
    }
};

// ====================================
// MODULE: COMPTE À REBOURS
// ====================================
const Countdown = {
    elements: {},
    intervalId: null,
    
    init() {
        this.elements = {
            days: Utils.selectAll("#days"),
            hours: Utils.selectAll("#hours"),
            minutes: Utils.selectAll("#minutes"),
            seconds: Utils.selectAll("#seconds")
        };
        
        if (this.elements.days.length === 0) return;
        
        this.update();
        this.intervalId = setInterval(() => this.update(), 1000);
    },
    
    update() {
        const now = new Date().getTime();
        const distance = CONFIG.countdownTarget - now;
        
        if (distance <= 0) {
            clearInterval(this.intervalId);
            return;
        }
        
        const time = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
        
        Object.keys(time).forEach(key => {
            this.elements[key].forEach(el => el.textContent = Utils.padZero(time[key]));
        });
    }
};

// ====================================
// MODULE: HEADER DYNAMIQUE (Au Scroll)
// ====================================
const DynamicHeader = {
    init() {
        const header = Utils.select('header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
};

// ====================================
// INITIALISATION
// ====================================
const App = {
    start() {
        console.log('Initializing app...');
        
        MobileMenu.init();
        MobileDropdown.init();
        ToggleContent.init();
        Countdown.init();
        DynamicHeader.init();
        
        // Année dynamique pour le footer
        const yearEl = Utils.select('#year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
        
        console.log('App initialized successfully');
    }
};

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => App.start());

// Injection des styles d'animation pour le "Voir plus"
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    /* Styles de base pour le contenu caché */
    .more-text { 
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height 0.5s ease-in-out, opacity 0.4s ease, margin-top 0.3s ease;
        margin-top: 0;
    }
    
    /* Affichage du contenu quand expandé */
    .more-text.expanded { 
        max-height: 2000px;
        opacity: 1;
        margin-top: 15px;
    }
    
    /* Style du bouton "Voir plus" */
    .btn-read-more {
        margin-top: 10px;
        padding: 8px 20px;
        background-color: rgba(139,209,51,1);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
    
    .btn-read-more:hover {
        background-color: rgba(139,209,51,1);
        transform: translateY(-2px);
    }
    
    .btn-read-more:active {
        transform: translateY(0);
    }
    
    /* Assurer que le contenu des cartes est bien structuré */
    .profile-card .content {
        position: relative;
    }
    
    .profile-card .more-text p {
        margin: 0;
        line-height: 1.6;
    }
`;
document.head.appendChild(styleSheet);