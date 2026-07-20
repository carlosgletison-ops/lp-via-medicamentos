/**
 * Via Medicamentos - Custom JS Controller
 * Logic for GSAP Animations, input masking, form conversion, and conversion-focused scrolling.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Spotlight Card Effect
    const spotlightCards = document.querySelectorAll(".bento-card, .glass-card, .glass-card-dark");
    spotlightCards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // 2. Sticky Navbar & Scroll Progress Indicator
    const navbar = document.querySelector("nav");
    const scrollIndicator = document.getElementById("scroll-indicator");
    
    window.addEventListener("scroll", () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add("bg-white/90", "shadow-lg", "border-b", "border-black/5", "backdrop-blur-md");
            navbar.classList.remove("bg-transparent");
        } else {
            navbar.classList.remove("bg-white/90", "shadow-lg", "border-b", "border-black/5", "backdrop-blur-md");
            navbar.classList.add("bg-transparent");
        }

        // Top progress bar width calculation
        const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalScrollHeight > 0) {
            const scrollPercentage = (window.scrollY / totalScrollHeight) * 100;
            if (scrollIndicator) {
                scrollIndicator.style.width = `${scrollPercentage}%`;
            }
        }
    });

    // 3. GSAP Scroll Animations Setup
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Trust Bar Horizontal Scroll Parallax Animation
        gsap.fromTo(".gsap-trust-bar-track", 
            { x: 50 }, 
            {
                x: -50,
                scrollTrigger: {
                    trigger: ".trust-bar-section",
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            }
        );

        // Hero Content entrance
        gsap.to(".gsap-hero", {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        });

        // Section Title Animations
        const sectionTitles = document.querySelectorAll(".gsap-section-title");
        sectionTitles.forEach(title => {
            gsap.fromTo(title,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: title,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });

        // Sobre Nós Column Cards Animation
        gsap.fromTo("#sobre .hover-premium", 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#sobre",
                    start: "top 80%"
                }
            }
        );

        // Product Category Cards Entrance Animation
        gsap.fromTo(".product-category-card",
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#produtos",
                    start: "top 80%"
                }
            }
        );

        // Brand Slider Entrance Animation
        gsap.fromTo(".slider-wrapper", 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#marcas",
                    start: "top 85%"
                }
            }
        );

        // Timeline Step Cards Animation
        gsap.fromTo(".step-card", 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: "#fluxo",
                    start: "top 80%"
                }
            }
        );

        // Testimonial Cards Animation
        gsap.fromTo(".testimonial-card", 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#depoimentos",
                    start: "top 80%"
                }
            }
        );

        // CTA Section reveal
        gsap.fromTo(".gsap-cta-card",
            { scale: 0.95, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#lead-capture",
                    start: "top 80%"
                }
            }
        );
    }

    // 4. Scroll To Form functionality for all anchor links
    const leadCaptureLinks = document.querySelectorAll('a[href="#lead-capture"]');
    leadCaptureLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const formSection = document.getElementById("lead-capture");
            if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth" });
                const nameField = document.getElementById("lead-name");
                if (nameField) {
                    setTimeout(() => nameField.focus(), 800);
                }
            }
        });
    });

    // 5. Input Masking (CNPJ and Phone)
    const cnpjInput = document.getElementById("lead-cnpj");
    if (cnpjInput) {
        cnpjInput.addEventListener("input", (e) => {
            let x = e.target.value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : x[1] + "." + x[2] + "." + x[3] + "/" + x[4] + (x[5] ? "-" + x[5] : "");
        });
    }

    const phoneInput = document.getElementById("lead-phone");
    if (phoneInput) {
        phoneInput.addEventListener("input", (e) => {
            let x = e.target.value.replace(/\D/g, "");
            if (x.length <= 10) {
                let match = x.match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
                e.target.value = !match[2] ? match[1] : "(" + match[1] + ") " + match[2] + (match[3] ? "-" + match[3] : "");
            } else {
                let match = x.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                e.target.value = !match[2] ? match[1] : "(" + match[1] + ") " + match[2] + (match[3] ? "-" + match[3] : "");
            }
        });
    }

    // 6. Lead Generation Form & WhatsApp URL Constructor
    const b2bForm = document.getElementById("b2b-lead-form");
    const formSubmitBtn = document.getElementById("form-submit-btn");
    const successModal = document.getElementById("success-modal");

    if (b2bForm && formSubmitBtn) {
        b2bForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Fetch inputs
            const name = document.getElementById("lead-name").value.trim();
            const phone = document.getElementById("lead-phone").value.trim();
            const cnpj = document.getElementById("lead-cnpj").value.trim();
            
            const segmentSelect = document.getElementById("lead-segment");
            const segment = segmentSelect.options[segmentSelect.selectedIndex].value;
            
            const stateSelect = document.getElementById("lead-state");
            const state = stateSelect.options[stateSelect.selectedIndex].text;

            // Simple validation check
            if (!name || !phone || !cnpj || !segment || !state) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            // Animate Button State
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> Processando...`;

            // Prepare WhatsApp pre-filled text
            const intro = `Olá equipe Via Medicamentos!`;
            const body = `Gostaria de solicitar um contato comercial / cotação B2B:
- **Nome Completo:** ${name}
- **WhatsApp/Telefone:** ${phone}
- **CNPJ da Empresa:** ${cnpj}
- **Segmento de Atuação:** ${segment}
- **Região / Estado:** ${state}`;
            
            const encodedText = encodeURIComponent(intro + "\n\n" + body);
            // Official Via Medicamentos contact number: 558896641852
            const whatsappURL = `https://wa.me/558896641852?text=${encodedText}`;

            // Directly redirect lead to WhatsApp immediately
            window.open(whatsappURL, "_blank") || (window.location.href = whatsappURL);
            
            b2bForm.reset();
            formSubmitBtn.disabled = false;
            formSubmitBtn.innerHTML = `<span>ENVIAR DADOS E SOLICITAR COTAÇÃO</span><i class="fa-solid fa-paper-plane text-xs"></i>`;
        });
    }

    // Modal Close button
    const closeModalBtn = document.getElementById("close-modal-btn");
    if (closeModalBtn && successModal) {
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.add("hidden");
            successModal.classList.remove("flex");
        });
    }

    // FAQ Accordion Toggle Behavior
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        const answerDiv = item.querySelector(".faq-answer");
        
        if (questionBtn && answerDiv) {
            questionBtn.addEventListener("click", () => {
                // Close other active FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("active")) {
                        otherItem.classList.remove("active");
                        otherItem.querySelector(".faq-answer").style.maxHeight = null;
                    }
                });
                
                // Toggle current FAQ item
                item.classList.toggle("active");
                if (item.classList.contains("active")) {
                    answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                } else {
                    answerDiv.style.maxHeight = null;
                }
            });
        }
    });
});
