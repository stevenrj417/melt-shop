const form = document.querySelector("[data-waitlist-form]");
const status = document.querySelector("[data-form-status]");
const submitButton = form?.querySelector("button[type='submit']");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const originalLabel = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Squeezing…";
  status.className = "form-status";
  status.textContent = "";

  try {
    const values = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const result = await response.json();

    if (!response.ok) throw new Error(result.message || "Something went wrong.");

    form.reset();
    status.classList.add("is-success");
    status.textContent = result.message;
    submitButton.textContent = "You’re on the list!";
  } catch (error) {
    status.classList.add("is-error");
    status.textContent = error.message || "Please try again.";
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }
});

const menuButton = document.querySelector("[data-menu-button]");
const navLinks = document.querySelector("[data-nav-links]");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
  }
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.12 }
  );

  document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
} else {
  document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
}
