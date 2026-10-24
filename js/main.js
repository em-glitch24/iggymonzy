/* ==========================================================
   IGGYMONZY Consumer Goods Trading
   ========================================================== */

/* ---------------------------------------------------------
   1. YOUR LIST OF GOODS
   Edit this array only. Everything on the page (filters,
   cards, search, counts) is built from it automatically.
   Categories come from the company flyer. Item names are drafts, confirm them.
   --------------------------------------------------------- */
const SUPPLIES = [
  {
    category: "Food & Beverages",
    blurb: "Everyday food and drink for stores, eateries and households.",
    items: [
      "Snacks & chips",
      "Nuts & dried goods",
      "Soy sauce & vinegar",
      "Condiments & sauces",
      "Canned goods",
      "Beverages",
    ],
  },
  {
    category: "Personal Care",
    blurb: "Hygiene and grooming essentials.",
    items: [
      "Shampoo & conditioner",
      "Body wash & bath soap",
      "Lotions & creams",
      "Oral care",
      "Hair care products",
    ],
  },
  {
    category: "Household Essentials",
    blurb: "Cleaning and home care goods that sell steadily.",
    items: [
      "Laundry detergent",
      "Fabric conditioner",
      "Dishwashing liquid",
      "Bleach & disinfectants",
      "Multi-surface cleaners",
      "Spray cleaners",
    ],
  },
  {
    category: "Non-Edible Goods",
    blurb: "A mix of non-food consumer products.",
    items: [
      "Soap bars",
      "Plastic containers",
      "Tin & metal containers",
      "Air fresheners",
      "Cleaning supplies",
    ],
  },
  {
    category: "Bulk Trading Supplies",
    blurb: "Goods and packaging in carton and pallet quantities.",
    items: [
      "Carton & pallet lots",
      "Plastic wrap & rolls",
      "Aluminum trays",
      "Food packaging",
      "Packaging materials",
    ],
  },
];

/* ---------------------------------------------------------
   2. SUPPLIES: fade cards in as they scroll into view
   --------------------------------------------------------- */
document.documentElement.classList.add("js");

const spItems = document.querySelectorAll(".sp-item");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  spItems.forEach((el) => io.observe(el));
} else {
  spItems.forEach((el) => el.classList.add("in"));
}

/* ---------------------------------------------------------
   3. HEADER: solid background on scroll + mobile menu
   --------------------------------------------------------- */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function setMenu(open) {
  nav.classList.toggle("open", open);
  header.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () =>
  setMenu(!nav.classList.contains("open")),
);
nav.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

/* ---------------------------------------------------------
   4. Footer year
   --------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   5. QUOTE MODAL + EMAILJS
   Fill in the three values below (see the setup steps)
   --------------------------------------------------------- */
const EMAILJS = {
  publicKey: "4Q5hwHzdQjtlNOJ-G",
  serviceId: "service_rckkq2x",
  templateId: "template_m7r5vs9",
};

(function () {
  const dialog = document.getElementById("quote-modal");
  if (!dialog) return;

  const form = document.getElementById("quote-form");
  const done = document.getElementById("quote-done");
  const statusEl = document.getElementById("quote-status");
  const submitBtn = form.querySelector('[type="submit"]');
  const submitLabel = submitBtn.querySelector("span");
  const interestInput = document.getElementById("q-interest");

  function openModal(topic) {
    form.hidden = false;
    done.hidden = true;
    statusEl.textContent = "";
    statusEl.classList.remove("is-error");
    if (topic) interestInput.value = topic;
    if (typeof setMenu === "function") setMenu(false);
    dialog.showModal();
    form.elements.from_name.focus();
  }

  // Cards, header "Contact us", the bottom bar button, and anything with data-open-quote
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(
      ".sp-card, .nav-cta, .sp-cta .btn, [data-open-quote]",
    );
    if (!trigger) return;
    e.preventDefault();
    const card = trigger.closest(".sp-card");
    openModal(card ? card.querySelector("h3").textContent.trim() : "");
  });

  // Close: backdrop click, X button, Close button (Esc works automatically)
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog
    .querySelectorAll("[data-close-quote]")
    .forEach((btn) => btn.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("close", () => {
    form.reset();
    interestInput.value = "";
  });

  function showError(msg) {
    statusEl.textContent = msg;
    statusEl.classList.add("is-error");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.elements.website.value) return; // spam trap field was filled

    if (EMAILJS.publicKey.startsWith("YOUR_")) {
      showError("Email isn't set up yet. Please call 0917 153 4030 instead.");
      return;
    }

    statusEl.textContent = "";
    statusEl.classList.remove("is-error");
    submitBtn.disabled = true;
    submitLabel.textContent = "Sending…";

    try {
      await emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form, {
        publicKey: EMAILJS.publicKey,
      });
      form.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      console.error("EmailJS error:", err);
      showError(
        "Your message didn't send. Please try again, or call 0917 153 4030.",
      );
    } finally {
      submitBtn.disabled = false;
      submitLabel.textContent = "Send message";
    }
  });
})();
