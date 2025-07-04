// ===== VARIABLES GLOBALES =====
let navbar = null;
let scrollIndicator = null;
let skillBars = null;
let contactForm = null;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les éléments
    initializeElements();
    
    // Initialiser AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
    
    // Initialiser les fonctionnalités
    initializeNavigation();
    initializeScrollEffects();
    initializeSkillBars();
    initializeContactForm();
    initializeTypingEffect();
    
    // Démarrer les animations
    startFloatingAnimations();
});

// ===== INITIALISATION DES ÉLÉMENTS =====
function initializeElements() {
    navbar = document.getElementById('mainNav');
    scrollIndicator = document.querySelector('.scroll-indicator');
    skillBars = document.querySelectorAll('.skill-progress');
    contactForm = document.getElementById('contactForm');
}

// ===== NAVIGATION =====
function initializeNavigation() {
    // Navigation fluide
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Compensation pour la navbar fixe
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fermer le menu mobile si ouvert
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    navbarToggler.click();
                }
                
                // Mettre à jour les liens actifs
                updateActiveNavLink(this);
            }
        });
    });
    
    // Scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.preventDefault();
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

function updateActiveNavLink(activeLink) {
    // Retirer la classe active de tous les liens
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Ajouter la classe active au lien cliqué
    activeLink.classList.add('active');
}

// ===== EFFETS DE SCROLL =====
function initializeScrollEffects() {
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        // Effet navbar au scroll
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Masquer/afficher l'indicateur de scroll
        if (scrollIndicator) {
            if (scrollTop > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }
        
        // Mettre à jour le lien actif en fonction de la section visible
        updateActiveNavOnScroll();
        
        // Parallax effect pour les formes géométriques
        applyParallaxEffect(scrollTop);
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollTop = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

function applyParallaxEffect(scrollTop) {
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrollTop * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
}

// ===== BARRES DE COMPÉTENCES =====
function initializeSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

function animateSkillBars() {
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
}

// ===== FORMULAIRE DE CONTACT =====
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation du formulaire
        if (validateForm()) {
            // Simulation d'envoi
            showFormSuccess();
        }
    });
    
    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = contactForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    // Validation selon le type de champ
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                errorMessage = 'Le nom doit contenir au moins 2 caractères';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Veuillez entrer une adresse email valide';
                isValid = false;
            }
            break;
            
        case 'projectType':
            if (!value) {
                errorMessage = 'Veuillez sélectionner un type de projet';
                isValid = false;
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                errorMessage = 'Le message doit contenir au moins 10 caractères';
                isValid = false;
            }
            break;
    }
    
    // Afficher ou masquer l'erreur
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFormSuccess() {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Changer le bouton en état de chargement
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    submitBtn.disabled = true;
    
    // Simuler l'envoi
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message envoyé !';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-success');
        
        // Réinitialiser le formulaire
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('btn-success');
            submitBtn.classList.add('btn-primary');
            submitBtn.disabled = false;
            
            // Afficher un message de confirmation
            showNotification('Merci ! Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.', 'success');
        }, 2000);
    }, 1500);
}

// ===== EFFET DE FRAPPE =====
function initializeTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const texts = [
        'Chef de Projet IT | Référent Technique et Pédagogique | Expérimenté dans la Gestion des Formations IT',
        'Spécialiste en Gestion de Projets Informatiques',
        'Expert en Formation et Développement IT',
        'Créateur de Solutions Innovantes'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            heroSubtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            heroSubtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 30 : 30;
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 3000; // Pause à la fin
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause avant le nouveau texte
        }
        
        setTimeout(typeText, typeSpeed);
    }
    
    // Démarrer l'effet après un délai
    setTimeout(typeText, 2000);
}

// ===== ANIMATIONS FLOTTANTES =====
function startFloatingAnimations() {
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Animation de rotation continue
        icon.style.animation = `floatIcon 4s ease-in-out infinite ${index * 0.5}s, rotate 10s linear infinite`;
    });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Ajouter les styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// ===== ANIMATIONS CSS SUPPLÉMENTAIRES =====
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .is-invalid {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.25) !important;
    }
    
    .invalid-feedback {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`;

// Ajouter les styles supplémentaires
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== UTILITAIRES =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== GESTION DES ERREURS =====
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
});

// ===== PERFORMANCE =====
// Optimiser les événements de scroll
const optimizedScrollHandler = throttle(function() {
    // Logique de scroll optimisée
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITÉ =====
// Gestion du focus pour l'accessibilité
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// ===== ANALYTICS (Placeholder) =====
function trackEvent(category, action, label) {
    // Placeholder pour l'intégration d'analytics
    console.log('Event tracked:', { category, action, label });
}

// Tracker les clics sur les boutons CTA
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary, .btn-outline-primary')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('CTA', 'click', buttonText);
    }
});

    // WhatsApp tooltip
    const whatsappBtn = document.getElementById('whatsapp-chat-wrapper');
    const tooltip = document.getElementById('whatsapp-tooltip');
    if (whatsappBtn && tooltip) {
        tooltip.classList.remove('hide');
        const hideTooltip = () => tooltip.classList.add('hide');
        setTimeout(hideTooltip, 4000);
        whatsappBtn.addEventListener('click', hideTooltip);
    }

console.log('🚀 Landing Page IT - JavaScript initialisé avec succès!');



