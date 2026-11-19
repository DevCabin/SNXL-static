export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://shirtnerdxl.com";

export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoedlbzy";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Funny", href: "/designs?tag=funny" },
  { label: "Sci Fi", href: "/designs?tag=sci-fi" },
  { label: "Gamer", href: "/designs?tag=gamer" },
  { label: "Random", href: "/designs?tag=random" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = [
  { label: "About", href: "/about" },
  { label: "How Ordering Works", href: "/how-ordering-works" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
];

export const FEATURED_HANDLES = [
  "id-rather-die-than-drink-decaf",
  "embrace-the-chaos-kitty-branded-tee-up-to-5xl",
  "support-squad-orange-controller-gamer-tee",
  "sunset-stroll-mechanical-marvels-graphic-tee-for-big-guys-up-to-5xl",
  "slow-down-im-from-the-1900s-funny-graphic-tee-up-to-5xl",
  "fairly-introverted-but-willing-to-talk-about-my-jeep",
  "keyboard-warrior-tee-battle-ready-comfort",
  "nope-rope-danger-noodle",
  "watch-out-for-snakes",
  "gamera-is-the-friend-of-all-children",
  "listen-to-more-weezer",
  "pluto-never-forget-funny-and-nerdy-mens-graphic-tees-up-to-5xl",
];

export const REQUEST_COPY = {
  intro:
    "Interested in this design? Choose your size and color and send us a request. We'll contact you to confirm availability, shipping and payment details. No payment is collected today.",
  button: "Request This Shirt",
  success:
    "Thanks! Your shirt request has been sent. We'll reach out by email with the next steps.",
  preferenceLabel: "Request preference — not confirmed availability",
};
