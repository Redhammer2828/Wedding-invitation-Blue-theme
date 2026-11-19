window.InvitationRSVP = (() => {
  const GOOGLE_FORM_ENDPOINT = "https://docs.google.com/forms/d/e/1FAIpQLScS-68fRrUe7phlWwHMgIboSx2C1mMo__VxbMs6erQNoLZR0g/formResponse";
  const GOOGLE_FORM_FIELDS = {
    fullName: "entry.1493318309",
    willAttend: "entry.1814049251",
    message: "entry.1234864912"
  };
  const ATTENDANCE_CHOICES = {
    Yes: "joyfully,yes",
    Maybe: "May be-ill confirm soon",
    No: "with love,icant attend"
  };
  const WISHES_URL = "https://kpggcpnrblcgqrkzirzb.supabase.co/rest/v1/wedding_wishes";
  const WISHES_HEADERS = { apikey: "sb_publishable_oJ3YHwFNT8FxYWuHaaI2Nw_aSDBGk4r" };

  async function loadWishes() {
    const section = document.querySelector("[data-guest-wishes]");
    const list = section?.querySelector("[data-wishes-list]");
    if (!list) return;

    const response = await fetch(WISHES_URL + "?select=name,message&order=id.desc&limit=100", {
      headers: WISHES_HEADERS,
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("Could not load shared wishes.");

    const wishes = await response.json();
    list.replaceChildren(...wishes.map((wish) => {
      const item = document.createElement("li");
      const message = document.createElement("p");
      const name = document.createElement("strong");
      message.textContent = wish.message;
      name.textContent = wish.name;
      item.append(message, name);
      return item;
    }));
    section.querySelector("[data-wishes-empty]").hidden = wishes.length > 0;
  }

  async function saveWish(payload) {
    const response = await fetch(WISHES_URL, {
      method: "POST",
      headers: { ...WISHES_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ name: payload.fullName.slice(0, 120), message: payload.message }),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error("Could not post the shared wish.");
  }

  function formToJSON(form) {
    const data = new FormData(form);
    return {
      fullName: String(data.get("fullName") || "").trim(),
      willAttend: String(data.get("willAttend") || "Yes"),
      message: String(data.get("message") || "").trim(),
      submittedAt: new Date().toISOString()
    };
  }

  function validate(payload) {
    if (!payload.fullName) return "Please enter your full name.";
    return "";
  }

  function init() {
    const form = document.querySelector("[data-rsvp-form]");
    const shell = document.querySelector("[data-rsvp-shell]");
    const error = document.querySelector("[data-form-error]");
    const submitButton = document.querySelector("[data-rsvp-submit]");
    const submitLabel = document.querySelector("[data-submit-label]");
    if (!form || !shell) return;
    const wishStatus = shell.querySelector("[data-wish-status]");
    loadWishes().catch(console.warn);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = formToJSON(form);
      const message = validate(payload);
      if (message) {
        if (error) error.textContent = message;
        return;
      }

      if (error) error.textContent = "";
      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending…";

      try {
        const formData = new URLSearchParams();
        formData.set(GOOGLE_FORM_FIELDS.fullName, payload.fullName);
        formData.set(GOOGLE_FORM_FIELDS.willAttend, ATTENDANCE_CHOICES[payload.willAttend] || ATTENDANCE_CHOICES.Yes);
        formData.set(GOOGLE_FORM_FIELDS.message, payload.message);

        await fetch(GOOGLE_FORM_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: formData.toString()
        });

        if (payload.message) {
          try {
            await saveWish(payload);
            loadWishes().catch(console.warn);
          } catch (wishError) {
            console.warn(wishError);
            if (wishStatus) wishStatus.textContent = "Your wish was included in your RSVP. It could not be posted to the shared guestbook.";
          }
        }
        shell.classList.add("is-flipped");
        form.reset();
      } catch (submissionError) {
        if (error) error.textContent = "We couldn’t save your RSVP. Please check your connection and try again.";
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = "Submit RSVP";
      }
    });
  }

  return { init };
})();
