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
                    "Close";

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
// ========================================

const contactForm =
    document.querySelector(
        "#contact-form"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.querySelector(
                    "#contact-name"
                ).value;


            const email =
                document.querySelector(
                    "#contact-email"
                ).value;


            const subject =
                document.querySelector(
                    "#contact-subject"
                ).value;


            const message =
                document.querySelector(
                    "#contact-message"
                ).value;


            const emailSubject =
                encodeURIComponent(
                    subject +
                    " — Website enquiry from " +
                    name
                );


            const emailBody =
                encodeURIComponent(
                    "Hi Starrfield Fun,\n\n" +
                    message +
                    "\n\n" +
                    "From: " +
                    name +
                    "\n" +
                    "Email: " +
                    email
                );


            const mailLink =
                "mailto:starrfieldfunwork@gmail.com" +
                "?subject=" +
                emailSubject +
                "&body=" +
                emailBody;


            window.location.href =
                mailLink;

        }
    );

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