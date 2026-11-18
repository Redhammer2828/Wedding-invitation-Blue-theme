window.InvitationParticles = (() => {
  const particles = [];
  let canvas;
  let context;
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * window.devicePixelRatio);
    canvas.height = Math.floor(height * window.devicePixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function seed() {
    particles.length = 0;
    const count = Math.min(96, Math.floor(width / 7));
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 1.6,
        speed: 0.08 + Math.random() * 0.28,
        drift: -0.15 + Math.random() * 0.3,
        alpha: 0.18 + Math.random() * 0.55
      });
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      if (particle.y < -10) particle.y = height + 10;
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;

      const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 5);
      gradient.addColorStop(0, `rgba(212, 175, 55, ${particle.alpha})`);
      gradient.addColorStop(1, "rgba(212, 175, 55, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = requestAnimationFrame(draw);
  }

  function init() {
    canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    context = canvas.getContext("2d", { alpha: true });
    resize();
    seed();
    draw();

    window.addEventListener("resize", () => {
      cancelAnimationFrame(animationFrame);
      resize();
      seed();
      draw();
    }, { passive: true });
  }

  return { init };
})();
