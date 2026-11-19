window.InvitationAnimations = (() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function playSound(selector) {
    const audio = document.querySelector(selector);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function presentSeal() {
    const card = document.querySelector("[data-cover-card]");
    const hint = document.querySelector("[data-tap-hint]");
    const seal = document.querySelector("[data-wax-seal]");
    if (!card || !seal || !window.gsap) return;

    gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(hint, { opacity: 0, y: 8, duration: 0.35 }, 0)
      .to(card, { y: -10, scale: 1.025, duration: 0.8 }, 0)
      .to(seal, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 0.42);
  }

  function openInvitation(done) {
    const card = document.querySelector("[data-cover-card]");
    const hint = document.querySelector("[data-tap-hint]");
    const coverScene = document.querySelector("[data-cover-scene]");
    const page = document.querySelector(".paper-world");
    if (!card || !coverScene) {
      done?.();
      return;
    }

    playSound("[data-audio-wax]");
    card.classList.add("is-opening");
    playSound("[data-audio-paper]");

    const duration = reducedMotion ? 180 : 850;
    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
    const animations = [
      coverScene.animate(
        [
          { opacity: 1 },
          { opacity: 0 }
        ],
        { duration, easing, fill: "forwards" }
      ),
      card.animate(
        [
          { transform: "translateY(0) scale(1)", filter: "blur(0)" },
          { transform: "translateY(-18px) scale(1.045)", filter: "blur(2px)" }
        ],
        { duration, easing, fill: "forwards" }
      )
    ];

    if (hint) {
      animations.push(hint.animate(
        [{ opacity: 1 }, { opacity: 0, transform: "translateY(12px)" }],
        { duration: Math.min(duration, 380), easing, fill: "forwards" }
      ));
    }

    if (page) {
      animations.push(page.animate(
        [
          { opacity: 0.35, transform: "scale(0.985)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        { duration: duration + 180, easing, fill: "both" }
      ));
    }

    Promise.all(animations.map((animation) => animation.finished.catch(() => null)))
      .then(() => {
        coverScene.setAttribute("hidden", "");
        done?.();
      });
  }

  function setupScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add("section-enter");
          observer.unobserve(target);
        });
      });
      document.querySelectorAll("main section").forEach(section => observer.observe(section));
      const footer = document.querySelector(".invitation-footer");
      if (footer) {
        footer.classList.add("sprig-ready");
        observer.observe(footer);
      }
    }
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".invite-section").forEach((section) => {
      gsap.fromTo(section,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true
          }
        }
      );
    });

    gsap.to(".paper-grain", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: ".paper-world",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }

  return { presentSeal, openInvitation, setupScroll };
})();
