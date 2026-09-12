import families from '@/data/families.json';
import {catalog, type Product} from '@/lib/catalog';

export type Feature = {lead: string | null; text: string};
export type CharacteristicTable = {title: string; rows: string[][]};

/** Engineering content shared by every part in a product family. */
export type FamilyContent = {
  key: string;
  title: string;
  modelLine: string;
  description: string;
  compliance: string[];
  features: Feature[];
  applications: string[];
  sideTable: CharacteristicTable | null;
  specsTitle: string;
  specs: string[][];
  mechanical: CharacteristicTable | null;
  electrical: CharacteristicTable | null;
  variantHeader: string;
  parts: {partNumber: string; description: string; variant: string}[];
  /** YYYY-MM the content was last imported; printed on the sheet. */
  revision: string;
};

export const familyContent = families as FamilyContent[];

const byPart = new Map<string, FamilyContent>();
for (const family of familyContent) {
  for (const part of family.parts) byPart.set(part.partNumber, family);
}

/** The datasheet content for a part, or null if none has been authored. */
export function contentFor(partNumber: string) {
  return byPart.get(partNumber) ?? null;
}

/** Catalogue products in a content family, in ordering-table order. */
export function productsInFamily(family: FamilyContent): Product[] {
  return family.parts
    .map((part) => catalog.find((product) => product.partNumber === part.partNumber))
    .filter((product): product is Product => Boolean(product));
}

/** Every product that has a datasheet page, grouped by content family. */
export function datasheetIndex() {
  return familyContent
    .map((family) => ({family, products: productsInFamily(family)}))
    .filter((group) => group.products.length > 0);
}
