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

        // Bento Grid Card Animations (Público-alvo / Dores)
        gsap.to(".gsap-bento-card", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: "#dores-publico",
                start: "top 80%"
            }
        });

        // Brand Badges Entrance Animation
        gsap.fromTo(".gsap-brand-badge", 
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "#marcas",
                    start: "top 85%"
                }
            }
        );

        // Differential Cards Animation
        gsap.fromTo(".gsap-diff-card", 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "back.out(1.2)",
                scrollTrigger: {
                    trigger: ".diff-grid-container",
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
                    trigger: "#closing-cta",
                    start: "top 80%"
                }
            }
        );
    }

    // 4. Scroll To Form button functionality
    const scrollToFormBtn = document.getElementById("scroll-to-form-btn");
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener("click", () => {
            const formSection = document.getElementById("lead-capture");
            if (formSection) {
                formSection.scrollIntoView({ behavior: "smooth" });
                const nameField = document.getElementById("lead-name");
                if (nameField) {
                    setTimeout(() => nameField.focus(), 800);
                }
            }
        });
    }

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

            // Show Success Animation / Feedback
            setTimeout(() => {
                if (successModal) {
                    successModal.classList.remove("hidden");
                    successModal.classList.add("flex");
                    
                    // GSAP entrance for modal
                    gsap.fromTo(successModal.querySelector(".modal-card"),
                        { scale: 0.7, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
                    );

                    // Reset Form
                    b2bForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `<span>SOLICITAR COTAÇÃO IMEDIATA</span><i class="fa-solid fa-paper-plane text-xs"></i>`;

                    // Redirect to WhatsApp after 2 seconds
                    setTimeout(() => {
                        window.open(whatsappURL, "_blank");
                        successModal.classList.add("hidden");
                        successModal.classList.remove("flex");
                    }, 2200);
                } else {
                    // Fallback to immediate redirect
                    window.open(whatsappURL, "_blank");
                    b2bForm.reset();
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = `<span>SOLICITAR COTAÇÃO IMEDIATA</span><i class="fa-solid fa-paper-plane text-xs"></i>`;
                }
            }, 1000);
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
});
