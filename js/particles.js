window.InvitationParticles = {
  init() {
    const layer = document.getElementById("particle-canvas");
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let index = 0; index < 10; index++) {
      const flower = document.createElement("span");
      flower.className = "falling-flower";
      flower.style.left = (index * 10 + Math.random() * 5) + "%";
      flower.style.animationDelay = (-Math.random() * 16) + "s";
      flower.style.animationDuration = (12 + Math.random() * 7) + "s";
      layer.appendChild(flower);
    }
    const count = Math.min(28, Math.ceil(window.innerWidth / 36));
    for (let i = 0; i < count; i++) {
      const glint = document.createElement("i");
      glint.style.left = ((i + Math.random()) / count * 100) + "%";
      glint.style.top = (Math.random() * 100) + "%";
      glint.style.animationDelay = (-Math.random() * 6) + "s";
      glint.style.animationDuration = (4 + Math.random() * 3) + "s";
      layer.appendChild(glint);
    }
  }
};
