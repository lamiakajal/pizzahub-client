// Hero photos live in public/images/hero. Reorder this list to change the first slide.
export type HeroSlide = {
  src: string;
  alt: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/images/hero/hero-2.jpg",
    alt: "Wood-fired pizza with melted mozzarella pouring over the top",
  },
  {
    src: "/images/hero/hero-1.jpg",
    alt: "Pepperoni pizza with a slice lifting away on stretchy cheese",
  },
  {
    src: "/images/hero/hero-3.jpg",
    alt: "Margherita pizza with fresh basil on a wooden board",
  },
  {
    src: "/images/hero/hero-4.jpg",
    alt: "Pepperoni pizza slice pulling away with melted cheese",
  },
  {
    src: "/images/hero/hero-5.jpg",
    alt: "Loaded pizza with peppers and sausage on a dark board",
  },
  {
    src: "/images/hero/hero-6.jpg",
    alt: "Veggie pizza topped with arugula, mushrooms and cherry tomatoes",
  },
  {
    src: "/images/hero/hero-7.jpg",
    alt: "Margherita pizza with basil as melted cheese pours from above",
  },
];
