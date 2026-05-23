(function () {
  const contactForm = document.querySelector("#contact form");

  if (!contactForm) {
    return;
  }

  contactForm.setAttribute("action", "/api/contact");
  contactForm.setAttribute("method", "POST");

  const status = document.createElement("p");
  status.className = "form-status";
  status.setAttribute("aria-live", "polite");
  contactForm.appendChild(status);

  function getFieldKey(field, index) {
    return field.name || field.id || field.getAttribute("aria-label") || field.placeholder || `field${index + 1}`;
  }

  function normalizeKey(key) {
    return key.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, letter) => letter.toUpperCase());
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("[type='submit']");
    const fields = Array.from(contactForm.querySelectorAll("input, textarea, select"));
    const payload = {};

    fields.forEach((field, index) => {
      if (field.type === "checkbox") {
        payload[normalizeKey(getFieldKey(field, index))] = field.checked;
        return;
      }

      payload[normalizeKey(getFieldKey(field, index))] = field.value;
    });

    status.textContent = "Sending...";
    status.dataset.state = "pending";
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      status.textContent = result.message || "Message sent.";
      status.dataset.state = response.ok ? "success" : "error";

      if (response.ok) {
        contactForm.reset();
      }
    } catch (error) {
      status.textContent = "Could not send your message. Please try again.";
      status.dataset.state = "error";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
})();
