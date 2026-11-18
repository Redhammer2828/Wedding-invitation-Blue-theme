(() => {
  const backgroundImages = [
    "assets/beige-floral-background.png",
    "assets/navy-botanical-background.png"
  ];

  const state = {
    lenis: null,
    opened: false,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  function preloadImages() {
    const images = Array.from(document.images);
    for (const src of backgroundImages) {
      const image = new Image();
      image.src = src;
      images.push(image);
    }
    return Promise.allSettled(images.map((image) => image.decode()));
  }

  function setupLenis() {
    if (state.reducedMotion || !window.Lenis) return;
    state.lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.82
    });

    function raf(time) {
      state.lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  function setupRipples() {
    document.querySelectorAll(".ripple").forEach((element) => {
      element.addEventListener("pointerdown", (event) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
        element.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
        element.classList.remove("is-rippling");
        void element.offsetWidth;
        element.classList.add("is-rippling");
      });
    });
  }

  function setupMusic() {
    const audio = document.querySelector("[data-wedding-music]");
    const toggle = document.querySelector("[data-music-toggle]");
    const cover = document.querySelector("[data-cover-card]");
    if (!audio || !toggle) return;

    let fadeFrame = 0;
    audio.volume = 0;

    function fadeTo(target, duration, done) {
      cancelAnimationFrame(fadeFrame);
      const startVolume = audio.volume;
      const startedAt = performance.now();

      function step(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        audio.volume = startVolume + ((target - startVolume) * progress);
        if (progress < 1) {
          fadeFrame = requestAnimationFrame(step);
        } else {
          done?.();
        }
      }

      fadeFrame = requestAnimationFrame(step);
    }

    function updateButton(isPlaying) {
      toggle.classList.toggle("is-playing", isPlaying);
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute("aria-label", isPlaying ? "Pause wedding music" : "Play wedding music");
      toggle.title = isPlaying ? "Pause Married Life" : "Play Married Life";
    }

    async function startPlayback() {
      if (!audio.paused) return;

      try {
        audio.volume = 0;
        await audio.play();
        updateButton(true);
        fadeTo(0.55, 900);
      } catch (error) {
        updateButton(false);
      }
    }

    // Starting from the guest's opening tap is allowed by mobile browser
    // autoplay rules and makes the music feel part of opening the invitation.
    cover?.addEventListener("click", startPlayback, { once: true });

    toggle.addEventListener("click", async () => {
      if (audio.paused) {
        await startPlayback();
      } else {
        updateButton(false);
        fadeTo(0, 600, () => audio.pause());
      }
    });

    audio.addEventListener("ended", () => updateButton(false));
  }

  function bindOpening() {
    const cover = document.querySelector("[data-cover-card]");
    if (!cover || !window.InvitationAnimations) return;

    document.body.classList.add("is-locked");
    cover.addEventListener("click", () => {
      if (state.opened) return;
      state.opened = true;
      cover.disabled = true;
      window.InvitationAnimations.openInvitation(() => {
        document.body.classList.remove("is-locked");
        document.querySelector(".paper-world")?.scrollIntoView({ block: "start" });
      });
    });
  }

  async function init() {
    setupLenis();
    setupRipples();
    setupMusic();
    window.InvitationParticles?.init();
    window.InvitationCountdown?.init("2027-01-04T12:00:00+05:30");
    window.InvitationRSVP?.init();
    bindOpening();

    await preloadImages();
    window.InvitationAnimations?.setupScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
