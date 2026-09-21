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
// CONTACT FORM
// FormSubmit AJAX with bounded waiting and honest delivery feedback.
// The provider controls actual submission time and email delivery.
// ========================================

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const serviceField = contactForm.querySelector("#contact-service");
    if (serviceField) {
        const requestedService = new URLSearchParams(window.location.search).get("service");
        const choices = {
            consultancy: "UI/UX Consultancy",
            figma: "UI/UX Design in Figma",
            development: "Full Website Design & Development"
        };
        if (Object.prototype.hasOwnProperty.call(choices, requestedService)) {
            serviceField.value = choices[requestedService];
        }
    }

    const formNote = document.querySelector("#form-note");
    const sendButton = contactForm.querySelector(".contact-send-button");
    const sendButtonText = sendButton ? sendButton.querySelector("span:first-child") : null;
    const CONTACT_EMAIL = "starrfieldfunwork@gmail.com";
    const MAX_WAIT_MS = 12000;
    let isSubmitting = false;
    let resetButtonTimer;

    function showFormNote(message, state, offerEmail) {
        if (!formNote) return;
        formNote.textContent = message;
        formNote.classList.remove("is-success", "is-error");
        if (state) formNote.classList.add(state);
        if (offerEmail) {
            const link = document.createElement("a");
            link.href = "mailto:" + CONTACT_EMAIL;
            link.textContent = " Email me directly ↗";
            link.style.textDecoration = "underline";
            link.style.textUnderlineOffset = "3px";
            formNote.appendChild(link);
        }
    }

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (isSubmitting) return;
        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const honeypot = contactForm.querySelector('input[name="_honey"]');
        if (honeypot && honeypot.value.trim() !== "") {
            // Avoid submitting suspected spam. Do not show a success confirmation.
            showFormNote("Please use the direct email link if you cannot submit this form.", "is-error", true);
            return;
        }

        const name = contactForm.querySelector("#contact-name").value.trim();
        const email = contactForm.querySelector("#contact-email").value.trim();
        const subject = contactForm.querySelector("#contact-subject").value.trim();
        const service = serviceField ? serviceField.value : "";
        const message = contactForm.querySelector("#contact-message").value.trim();

        isSubmitting = true;
        window.clearTimeout(resetButtonTimer);
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.classList.add("is-sending");
        }
        if (sendButtonText) sendButtonText.textContent = "SENDING…";
        showFormNote("Sending your message. Please keep this page open…", null, false);

        const controller = new AbortController();
        let timedOut = false;
        const slowNoticeTimer = window.setTimeout(function () {
            showFormNote("The email service is responding slowly. Still waiting for confirmation…", null, false);
        }, 5000);
        const timeoutTimer = window.setTimeout(function () {
            timedOut = true;
            controller.abort();
        }, MAX_WAIT_MS);

        try {
            const response = await fetch("https://formsubmit.co/ajax/" + CONTACT_EMAIL, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Accept": "application/json"},
                signal: controller.signal,
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    service: service || "Not specified",
                    message: message,
                    _subject: subject + " — Portfolio enquiry from " + name,
                    _template: "table",
                    _url: window.location.href
                })
            });

            // FormSubmit can send an HTTP 200 even when its response says success:false.
            // Only show success when FormSubmit explicitly confirms acceptance.
            const data = await response.json();
            const accepted = data && (data.success === true || data.success === "true");
            if (!response.ok || !accepted) {
                throw new Error("FormSubmit did not confirm this submission.");
            }

            contactForm.reset();
            if (sendButtonText) sendButtonText.textContent = "MESSAGE SENT";
            showFormNote("The email service accepted your message. Thanks — I’ll get back to you soon.", "is-success", false);
            resetButtonTimer = window.setTimeout(function () {
                if (sendButtonText && !isSubmitting) sendButtonText.textContent = "SEND MESSAGE";
            }, 3200);
        } catch (error) {
            console.error("Contact form error:", error);
            if (sendButtonText) sendButtonText.textContent = "TRY AGAIN";
            if (timedOut || (error && error.name === "AbortError")) {
                // Aborting a browser request cannot undo a submission the provider received.
                showFormNote("This is taking too long, so delivery could not be confirmed. Your message may still arrive. Please avoid sending it again immediately; use email instead.", "is-error", true);
            } else {
                showFormNote("The email service could not confirm your message. Your details are still here. Please email me directly or try again later.", "is-error", true);
            }
        } finally {
            window.clearTimeout(slowNoticeTimer);
            window.clearTimeout(timeoutTimer);
            isSubmitting = false;
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.classList.remove("is-sending");
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
