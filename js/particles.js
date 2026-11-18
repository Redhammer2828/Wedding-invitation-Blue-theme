window.InvitationParticles = {
  init() {
    const layer = document.getElementById("particle-canvas");
    if (!layer) return;
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
