window.InvitationCountdown = (() => {
  const selectors = {
    days: "[data-days]",
    hours: "[data-hours]",
    minutes: "[data-minutes]",
    seconds: "[data-seconds]"
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function setValue(element, value) {
    if (!element || element.textContent === value) return;
    element.textContent = value;
    element.classList.add("is-changing");
    window.setTimeout(() => element.classList.remove("is-changing"), 260);
  }

  function render(targetDate) {
    const now = new Date();
    const distance = Math.max(0, targetDate.getTime() - now.getTime());
    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setValue(document.querySelector(selectors.days), pad(days));
    setValue(document.querySelector(selectors.hours), pad(hours));
    setValue(document.querySelector(selectors.minutes), pad(minutes));
    setValue(document.querySelector(selectors.seconds), pad(seconds));
  }

  function init(isoDate) {
    const targetDate = new Date(isoDate);
    if (Number.isNaN(targetDate.getTime())) return;
    render(targetDate);
    window.setInterval(() => render(targetDate), 1000);
  }

  return { init };
})();
