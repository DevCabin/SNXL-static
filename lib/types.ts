export type GalleryImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type VariantCombo = {
  sku: string;
  originalPrice: number;
  size: string;
  color: string;
  imageUrl: string | null;
};

export type Product = {
  handle: string;
  title: string;
  urlPath: string;
  tags: string[];
  descriptionHtmlSafe: string;
  gallery: GalleryImage[];
  primaryImage: GalleryImage | null;
  knownCombos: VariantCombo[];
  unknownVariantCount: number;
  colorsKnown: string[];
  sizesKnown: string[];
  selectionMode: "strict" | "preference";
  fromPrice: number;
  standardPrices: Record<string, number>;
  gelatoProductId: string | null;
};

export type Catalog = {
  generatedAt: string;
  supportedSizes: string[];
  standardPrices: Record<string, number>;
  fromPrice: number;
  products: Product[];
};
