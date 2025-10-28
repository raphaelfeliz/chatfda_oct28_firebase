export interface FacetOptionConfig {
  labelMap?: { [key: string]: string };
  imageMap?: { [key: string]: string };
  sort?: string[];
  breadcrumbLabelMap?: { [key: string]: string };
  labelFromValue?: string;
  sortNumeric?: boolean;
}

export interface Facet {
  id: string;
  title: string;
  type: string;
  attribute: string;
  displayType: string;
  options: FacetOptionConfig;
  breadcrumb?: {
    hideValues?: string[];
  };
}

export interface Product {
  sku: string;
  url: string;
  image: string;
  categoria: string;
  sistema: string;
  persiana: string;
  persianaMotorizada: string | null;
  material: string;
  minLargura: number;
  maxLargura: number;
  folhasNumber: number;
  [key: string]: string | number | null;
}

export interface ProductData {
  facets: Facet[];
  productCatalog: Product[];
}

// --- FIX for 'erasableSyntaxOnly' error ---
// Replaced 'enum' with 'const as const' and a derived type
export const MessageSender = {
  USER: "user",
  BOT: "bot",
} as const;

// This creates the union type: 'user' | 'bot'
export type MessageSender = typeof MessageSender[keyof typeof MessageSender];

export interface ChatMessage {
  sender: MessageSender; // This now correctly refers to the type 'user' | 'bot'
  text: string;
}
// --- End of fix ---

export interface CurrentQuestion {
  facet: Facet;
  options: string[];
}
