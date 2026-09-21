// ========================================
// JAVASCRIPT IS WORKING
// ========================================

document.documentElement.classList.add("js");


// ========================================
// CURRENT YEAR
// ========================================

const yearElements =
    document.querySelectorAll(".current-year");

const currentYear =
    new Date().getFullYear();


yearElements.forEach(function (element) {

    element.textContent =
        currentYear;

});


// ========================================
// MOBILE MENU
// ========================================

const menuButton =
    document.querySelector(".menu-button");

const mobileMenu =
    document.querySelector(".mobile-menu");


if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        function () {

            const menuIsOpen =
                mobileMenu.classList.toggle("open");


            document.body.classList.toggle(
                "menu-open",
                menuIsOpen
            );


            menuButton.setAttribute(
                "aria-expanded",
                menuIsOpen
            );


            if (menuIsOpen) {

                menuButton.textContent =
                    "Close ×";

            } else {

                menuButton.textContent =
                    "Menu";

            }

        }
    );

}


// ========================================
// SCROLL REVEAL
// ========================================

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    revealElements.forEach(
        function (element) {

            element.classList.add(
                "visible"
            );

        }
    );

}


// ========================================
// APPLE STYLE STORY
// ========================================

const storySteps =
    document.querySelectorAll(
        ".story-step"
    );

const storyScenes =
    document.querySelectorAll(
        ".story-scene"
    );


function activateStoryScene(sceneNumber) {

    storySteps.forEach(
        function (step) {

            step.classList.remove(
                "active"
            );

        }
    );


    storyScenes.forEach(
        function (scene) {

            scene.classList.remove(
                "active"
            );

        }
    );


    const activeStep =
        document.querySelector(
            '[data-step="' +
            sceneNumber +
            '"]'
        );


    const activeScene =
        document.querySelector(
            '[data-scene="' +
            sceneNumber +
            '"]'
        );


    if (activeStep) {

        activeStep.classList.add(
            "active"
        );

    }


    if (activeScene) {

        activeScene.classList.add(
            "active"
        );

    }

}


if (storySteps.length > 0) {

    activateStoryScene("0");


    const storyObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (entry.isIntersecting) {

                            activateStoryScene(
                                entry.target.dataset.step
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.55
            }

        );


    storySteps.forEach(
        function (step) {

            storyObserver.observe(
                step
            );

        }
    );

}


// ========================================
// SCROLL PROGRESS
// ========================================

const progressBar =
    document.querySelector(
        ".scroll-progress-fill"
    );


function updateScrollProgress() {

    if (!progressBar) {
        return;
    }


    const scrollTop =
        window.scrollY;


    const pageHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    let progress = 0;


    if (pageHeight > 0) {

        progress =
            (
                scrollTop /
                pageHeight
            ) * 100;

    }


    progressBar.style.width =
        progress + "%";

}


// ========================================
// NAVIGATION
// ========================================

const navbar =
    document.querySelector(".navbar");


function updateNavbar() {

    if (!navbar) {
        return;
    }


    if (window.scrollY > 80) {

        navbar.classList.add(
            "scrolled"
        );

    } else {

        navbar.classList.remove(
            "scrolled"
        );

    }

}


// ========================================
// HERO SCROLL
// ========================================

const homeHero =
    document.querySelector(
        ".home-hero"
    );

const heroTitle =
    document.querySelector(
        ".hero-title-wrap"
    );

const heroOrb =
    document.querySelector(
        ".hero-orb"
    );


function updateHeroScroll() {

    if (!homeHero || !heroTitle) {
        return;
    }


    const heroHeight =
        homeHero.offsetHeight;


    const scrollAmount =
        window.scrollY;


    let progress =
        scrollAmount /
        heroHeight;


    progress =
        Math.max(
            0,
            Math.min(progress, 1)
        );


    const titleMove =
        progress * -70;


    const titleScale =
        1 -
        progress * 0.08;


    const titleOpacity =
        1 -
        progress * 0.7;


    heroTitle.style.transform =
        "translateY(" +
        titleMove +
        "px) scale(" +
        titleScale +
        ")";


    heroTitle.style.opacity =
        titleOpacity;


    if (heroOrb) {

        const orbMove =
            progress * 130;


        const orbScale =
            1 +
            progress * 0.35;


        heroOrb.style.transform =
            "translateY(" +
            orbMove +
            "px) scale(" +
            orbScale +
            ")";

    }

}


// ========================================
// PROJECT CARD TILT
// ========================================

const projectImages =
    document.querySelectorAll(
        ".project-preview .preview-image"
    );


if (
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    projectImages.forEach(
        function (image) {

            image.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        image.getBoundingClientRect();


                    const mouseX =
                        event.clientX -
                        rect.left;


                    const mouseY =
                        event.clientY -
                        rect.top;


                    const middleX =
                        rect.width / 2;


                    const middleY =
                        rect.height / 2;


                    const rotateY =
                        (
                            mouseX -
                            middleX
                        ) /
                        middleX *
                        2.5;


                    const rotateX =
                        -(
                            (
                                mouseY -
                                middleY
                            ) /
                            middleY *
                            2.5
                        );


                    image.style.setProperty(
                        "--rotate-x",
                        rotateX + "deg"
                    );


                    image.style.setProperty(
                        "--rotate-y",
                        rotateY + "deg"
                    );

                }
            );


            image.addEventListener(
                "mouseleave",
                function () {

                    image.style.setProperty(
                        "--rotate-x",
                        "0deg"
                    );


                    image.style.setProperty(
                        "--rotate-y",
                        "0deg"
                    );

                }
            );

        }
    );

}


// ========================================
// CUSTOM PROJECT CURSOR
// ========================================

const projectCursor =
    document.querySelector(
        ".project-cursor"
    );


const projectPreviews =
    document.querySelectorAll(
        ".project-preview"
    );


if (
    projectCursor &&
    window.matchMedia(
        "(pointer: fine)"
    ).matches
) {

    document.addEventListener(
        "mousemove",
        function (event) {

            projectCursor.style.left =
                event.clientX + "px";


            projectCursor.style.top =
                event.clientY + "px";

        }
    );


    projectPreviews.forEach(
        function (project) {

            project.addEventListener(
                "mouseenter",
                function () {

                    projectCursor.classList.add(
                        "visible"
                    );

                }
            );


            project.addEventListener(
                "mouseleave",
                function () {

                    projectCursor.classList.remove(
                        "visible"
                    );

                }
            );

        }
    );

}


// ========================================
// CONTACT FORM — WEB3FORMS
// Access key is configured by the site owner in contact/index.html.
// Provider acknowledgement means accepted for processing, not inbox delivery.
// ========================================

// CONTACT FORM VERSION: 20260921-RELIABLE-3
// Configuration is in contact/form-config.js so replacing this script or the
// contact page does not erase the visitor-facing access key configuration.
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const serviceField = contactForm.querySelector("#contact-service");
    const serviceChoices = {
        consultancy: "UI/UX Consultancy",
        figma: "UI/UX Design in Figma",
        development: "Full Website Design & Development"
    };
    const serviceRequested = new URLSearchParams(window.location.search).get("service");
    if (serviceField && Object.prototype.hasOwnProperty.call(serviceChoices, serviceRequested)) {
        serviceField.value = serviceChoices[serviceRequested];
    }

    const formNote = contactForm.querySelector("#form-note");
    const sendButton = contactForm.querySelector(".contact-send-button");
    const sendButtonText = sendButton ? sendButton.querySelector("span:first-child") : null;
    let isSubmitting = false;
    let buttonResetTimer = null;

    function setFormNote(message, state) {
        if (!formNote) return;
        formNote.textContent = message;
        formNote.classList.remove("is-success", "is-error");
        if (state) formNote.classList.add(state);
    }

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (isSubmitting) return;

        const configuredKey = window.STARR_CONTACT_CONFIG && window.STARR_CONTACT_CONFIG.accessKey;
        const accessKey = typeof configuredKey === "string" ? configuredKey.trim() : "";
        if (!accessKey || accessKey.includes("PASTE_") || accessKey.includes("ADD_YOUR_") || accessKey.includes("YOUR_ACCESS_KEY")) {
            setFormNote("This form is not set up yet. Please try again later.", "is-error");
            return;
        }
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }
        const botcheck = contactForm.querySelector('input[name="botcheck"]');
        if (botcheck && botcheck.checked) return;

        const submission = {
            access_key: accessKey,
            name: contactForm.querySelector("#contact-name").value.trim(),
            email: contactForm.querySelector("#contact-email").value.trim(),
            subject: contactForm.querySelector("#contact-subject").value.trim(),
            service: serviceField && serviceField.value ? serviceField.value : "Not specified",
            message: contactForm.querySelector("#contact-message").value.trim(),
            from_name: "Starrfield Fun portfolio",
            botcheck: false
        };

        isSubmitting = true;
        window.clearTimeout(buttonResetTimer);
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.classList.add("is-sending");
            sendButton.setAttribute("aria-busy", "true");
        }
        if (sendButtonText) sendButtonText.textContent = "SENDING…";
        setFormNote("Sending your enquiry. Please wait for confirmation.", null);

        // A slow provider response is not proof of failed delivery. Do not
        // cancel the request, auto-retry, or tell visitors their email failed.
        const slowNoticeTimer = window.setTimeout(function () {
            setFormNote("Still waiting for confirmation. Your enquiry may already have arrived; please don't submit again yet.", null);
        }, 10000);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(submission)
            });
            // Both HTTP status AND provider success must confirm acceptance.
            const result = await response.json();
            if (!response.ok || !result || result.success !== true) {
                if (response.status === 429) {
                    setFormNote("Too many requests were sent. Please wait before trying again.", "is-error");
                } else {
                    setFormNote("The email service did not accept this enquiry. Please check your details and try again later.", "is-error");
                }
                if (sendButtonText) sendButtonText.textContent = "SEND MESSAGE";
                return;
            }

            contactForm.reset();
            if (serviceField && Object.prototype.hasOwnProperty.call(serviceChoices, serviceRequested)) {
                serviceField.value = serviceChoices[serviceRequested];
            }
            if (sendButtonText) sendButtonText.textContent = "MESSAGE SENT";
            setFormNote("Your enquiry was accepted. Thanks — I’ll be in touch soon.", "is-success");
            buttonResetTimer = window.setTimeout(function () {
                if (sendButtonText && !isSubmitting) sendButtonText.textContent = "SEND MESSAGE";
            }, 4000);
        } catch (error) {
            // A network error or an unreadable acknowledgement cannot prove
            // whether the provider accepted a message. Avoid false failures.
            console.error("Contact form: confirmation unavailable", error);
            if (sendButtonText) sendButtonText.textContent = "STATUS UNCONFIRMED";
            setFormNote("We couldn't confirm delivery. Your message may still arrive. Please check your inbox before resending.", "is-error");
        } finally {
            window.clearTimeout(slowNoticeTimer);
            isSubmitting = false;
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.classList.remove("is-sending");
                sendButton.removeAttribute("aria-busy");
            }
        }
    });
}


// ========================================
// ALL SCROLL FUNCTIONS
// ========================================

let animationFrameRunning =
    false;


function handleScroll() {

    if (animationFrameRunning) {
        return;
    }


    animationFrameRunning =
        true;


    window.requestAnimationFrame(
        function () {

            updateScrollProgress();

            updateNavbar();

            updateHeroScroll();


            animationFrameRunning =
                false;

        }
    );

}


window.addEventListener(
    "scroll",
    handleScroll,
    {
        passive: true
    }
);


updateScrollProgress();

updateNavbar();

updateHeroScroll();

// ========================================
// FINAL PORTFOLIO POLISH
// ========================================

(function () {

    // Mark the current section in desktop + mobile navigation.
    const cleanPath = window.location.pathname.replace(/\/+$/, "");
    const currentPage = cleanPath.split("/").pop().replace(/\.html$/, "") || "index";

    const projectPages = new Set([
        "bus-finder", "busfinder", "monitor-control", "promptchecker", "snpc", "eternal-shutterwave"
    ]);

    const activePage = projectPages.has(currentPage) ? "work" : currentPage;
    const activeFile = activePage === "index" ? "/" : "/" + activePage + "/";

    document.querySelectorAll(
        ".desktop-nav a, .mobile-menu a"
    ).forEach(function (link) {

        const href = (link.getAttribute("href") || "").split("#")[0];

        if (href === activeFile) {
            link.classList.add("is-active");
            link.setAttribute("aria-current", "page");
        }

    });


    // Close the mobile menu cleanly after selecting a destination.
    function closeMobileMenu() {

        if (!mobileMenu || !menuButton) {
            return;
        }

        mobileMenu.classList.remove("open");
        document.body.classList.remove("menu-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "Menu";

    }

    if (mobileMenu) {

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMobileMenu);
        });

    }

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });


    // Respect reduced-motion preferences even before reveal observers run.
    if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {

        document.querySelectorAll(".reveal").forEach(function (element) {
            element.classList.add("visible");
        });

    }

})();
