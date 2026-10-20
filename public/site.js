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

const products = {
  tee: {
    title: "Butter Club Tee",
    price: "$32",
    image: "/merch/butter-club-tee.jpg",
    alt: "Four views of the butter-yellow MELT Butter Club t-shirt",
    color: "Butter yellow with MELT red ink",
    details: "Relaxed unisex fit · Sizes S–3XL",
    description: "A heavyweight everyday tee with the MELT butter boy at the chest and a quiet Butter Club hit at the back neck. Soft, sunny, and extremely breakfast friendly."
  },
  cap: {
    title: "Breakfast Club Cap",
    price: "$28",
    image: "/merch/breakfast-club-cap.jpg",
    alt: "Four views of the butter-yellow MELT Breakfast Club cap",
    color: "Washed butter yellow with MELT red embroidery",
    details: "Low-profile cotton · Adjustable metal closure",
    description: "The official lid of slow mornings. Embroidered butter boy up front, MELT at the side, and The Breakfast Club across the back."
  },
  tote: {
    title: "Butter Boy Tote",
    price: "$36",
    image: "/merch/butter-boy-tote.jpg",
    alt: "Multiple views of the cream and red MELT Butter Boy canvas tote",
    color: "Natural canvas with MELT red trim",
    details: "Heavy canvas · Interior pocket · Bottle sleeve",
    description: "A sturdy market tote built for the important stuff: bread, flowers, snacks, and one very special squeeze bottle in its own side pocket."
  }
};

const productDialog = document.querySelector("[data-product-dialog]");
const dialogClose = document.querySelector("[data-dialog-close]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogPrice = document.querySelector("[data-dialog-price]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogColor = document.querySelector("[data-dialog-color]");
const dialogDetails = document.querySelector("[data-dialog-details]");
const dialogCta = document.querySelector("[data-dialog-cta]");

document.querySelectorAll("[data-product]").forEach((card) => {
  card.addEventListener("click", () => {
    const product = products[card.dataset.product];
    if (!product || !productDialog) return;

    dialogImage.src = product.image;
    dialogImage.alt = product.alt;
    dialogTitle.textContent = product.title;
    dialogPrice.textContent = product.price;
    dialogDescription.textContent = product.description;
    dialogColor.textContent = product.color;
    dialogDetails.textContent = product.details;
    productDialog.showModal();
  });
});

dialogClose?.addEventListener("click", () => productDialog.close());
dialogCta?.addEventListener("click", () => productDialog.close());
productDialog?.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
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
