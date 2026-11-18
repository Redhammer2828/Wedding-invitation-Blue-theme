window.InvitationRSVP = (() => {
  const GOOGLE_FORM_ENDPOINT = "https://docs.google.com/forms/d/e/1FAIpQLScS-68fRrUe7phlWwHMgIboSx2C1mMo__VxbMs6erQNoLZR0g/formResponse";
  const GOOGLE_FORM_FIELDS = {
    fullName: "entry.1493318309",
    phone: "entry.614911774",
    willAttend: "entry.1814049251",
    guests: "entry.164156719",
    message: "entry.1234864912"
  };
  const ATTENDANCE_CHOICES = {
    Yes: "joyfully,yes",
    Maybe: "May be-ill confirm soon",
    No: "with love,icant attend"
  };

  function formToJSON(form) {
    const data = new FormData(form);
    return {
      fullName: String(data.get("fullName") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      guests: Number(data.get("guests") || 0),
      willAttend: String(data.get("willAttend") || "Yes"),
      message: String(data.get("message") || "").trim(),
      submittedAt: new Date().toISOString()
    };
  }

  function validate(payload) {
    if (!payload.fullName) return "Please enter your full name.";
    if (!payload.phone || payload.phone.replace(/\D/g, "").length < 7) return "Please enter a valid phone number.";
    if (!payload.guests || payload.guests < 1) return "Please enter the number of guests.";
    return "";
  }

  function init() {
    const form = document.querySelector("[data-rsvp-form]");
    const shell = document.querySelector("[data-rsvp-shell]");
    const error = document.querySelector("[data-form-error]");
    const submitButton = document.querySelector("[data-rsvp-submit]");
    const submitLabel = document.querySelector("[data-submit-label]");
    if (!form || !shell) return;

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
        formData.set(GOOGLE_FORM_FIELDS.phone, payload.phone);
        formData.set(GOOGLE_FORM_FIELDS.willAttend, ATTENDANCE_CHOICES[payload.willAttend] || ATTENDANCE_CHOICES.Yes);
        formData.set(GOOGLE_FORM_FIELDS.guests, String(payload.guests));
        formData.set(GOOGLE_FORM_FIELDS.message, payload.message);

        await fetch(GOOGLE_FORM_ENDPOINT, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          body: formData.toString()
        });

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
