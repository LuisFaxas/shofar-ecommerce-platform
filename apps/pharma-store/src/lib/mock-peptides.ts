/**
 * Mock Peptide Data
 *
 * This file now serves TWO purposes:
 *
 * 1. TYPE DEFINITIONS (PeptideProduct, PeptideVariant, ResearchGoal)
 *    - Used everywhere in pharma-store for type safety
 *    - These types mirror Vendure custom fields schema
 *
 * 2. MOCK DATA FALLBACK
 *    - ONLY used when NEXT_PUBLIC_PEPTIDES_USE_MOCKS=true
 *    - Useful for development without running Vendure
 *    - Used as automatic fallback when Vendure queries fail
 *
 * Vendure is now the SINGLE SOURCE OF TRUTH for product data.
 * See docs/peptide/VENDURE_INTEGRATION.md for setup instructions.
 *
 * Data schema matches Vendure custom fields for consistency.
 * Research sources: Peptide Sciences, Core Peptides, industry specifications.
 */

// ============================================================================
// TYPES - Future Vendure Custom Fields Schema
// ============================================================================

/**
 * Research goal categories for peptide classification
 */
export type ResearchGoal =
  | "Recovery"
  | "Longevity"
  | "Metabolic"
  | "Cognitive"
  | "Cosmetic"
  | "Research";

/**
 * Peptide variant (size/pricing option)
 * Maps to Vendure ProductVariant
 */
export interface PeptideVariant {
  id: string;
  name: string; // e.g. "5mg Vial"
  sku: string;
  size: string; // e.g. "5mg"
  price: number; // in cents (USD)
  compareAtPrice?: number; // original price if on sale
  inStock: boolean;
}

/**
 * Full peptide product
 * Maps to Vendure Product with custom fields
 */
export interface PeptideProduct {
  id: string;
  slug: string;
  name: string;
  shortName?: string; // Abbreviated name for compact display
  description: string;
  // Research classification
  category: ResearchGoal;
  researchApplications: string[]; // Brief research use descriptions
  // Chemical specifications
  casNumber: string;
  purity: string; // e.g. "≥99%"
  molecularWeight: string; // e.g. "1419.53 g/mol"
  molecularFormula?: string; // e.g. "C62H98N16O22"
  sequence?: string; // Amino acid sequence
  // Handling & storage
  form: string; // e.g. "Lyophilized powder"
  storage: string; // e.g. "Store at -20°C"
  stability?: string; // e.g. "2 years when stored properly"
  reconstitution?: string; // e.g. "Bacteriostatic water"
  administrationRoute: string; // e.g. "Subcutaneous injection"
  // Variants (sizes/pricing)
  variants: PeptideVariant[];
  // Assets
  featuredImage?: string;
  images?: string[];
  // Documents (URLs)
  coaUrl?: string; // Certificate of Analysis
  sdsUrl?: string; // Safety Data Sheet
  hplcUrl?: string; // HPLC chromatogram
  msUrl?: string; // Mass spectrometry data
  // Metadata
  featured?: boolean;
  new?: boolean;
  popularity?: number; // For sorting
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the lowest price from all variants
 */
export function getLowestPrice(product: PeptideProduct): number {
  return Math.min(...product.variants.map((v) => v.price));
}

/**
 * Get price range string if multiple variants
 */
export function getPriceRange(product: PeptideProduct): string {
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  const formatPrice = (cents: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);

  if (min === max) {
    return formatPrice(min);
  }
  return `${formatPrice(min)} - ${formatPrice(max)}`;
}

/**
 * Check if any variant is in stock
 */
export function isInStock(product: PeptideProduct): boolean {
  return product.variants.some((v) => v.inStock);
}

/**
 * Get the default (first in-stock) variant
 */
export function getDefaultVariant(product: PeptideProduct): PeptideVariant {
  return product.variants.find((v) => v.inStock) || product.variants[0];
}

// ============================================================================
// MOCK PEPTIDE DATA
// ============================================================================

export const MOCK_PEPTIDES: PeptideProduct[] = [
  // ----------------------------------------------------------------------------
  // RECOVERY PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-001",
    slug: "bpc-157",
    name: "BPC-157 (Body Protection Compound)",
    shortName: "BPC-157",
    description:
      "BPC-157 is a synthetic peptide derived from a protein found in human gastric juice. This 15-amino acid peptide chain has been extensively studied in research settings for its potential applications in tissue repair and regeneration studies.",
    category: "Recovery",
    researchApplications: [
      "Tissue regeneration studies",
      "Gastrointestinal research",
      "Wound healing models",
    ],
    casNumber: "137525-51-0",
    purity: "≥99%",
    molecularWeight: "1419.53 g/mol",
    molecularFormula: "C62H98N16O22",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    form: "Lyophilized powder",
    storage:
      "Store lyophilized at -20°C. Reconstituted: 2-8°C for up to 4 weeks.",
    stability: "2 years when stored properly",
    reconstitution: "Bacteriostatic water or sterile saline",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "bpc-5mg",
        name: "5mg Vial",
        sku: "BPC157-5MG",
        size: "5mg",
        price: 3999,
        inStock: true,
      },
      {
        id: "bpc-10mg",
        name: "10mg Vial",
        sku: "BPC157-10MG",
        size: "10mg",
        price: 6999,
        inStock: true,
      },
    ],
    featured: true,
    popularity: 100,
  },
  {
    id: "pep-002",
    slug: "tb-500",
    name: "TB-500 (Thymosin Beta-4 Fragment)",
    shortName: "TB-500",
    description:
      "TB-500 is a synthetic fraction of the protein Thymosin Beta-4, a naturally occurring 43-amino acid peptide. Research has focused on its role in cellular migration and tissue repair mechanisms.",
    category: "Recovery",
    researchApplications: [
      "Cellular migration studies",
      "Angiogenesis research",
      "Inflammation models",
    ],
    casNumber: "77591-33-4",
    purity: "≥98%",
    molecularWeight: "4963.44 g/mol",
    molecularFormula: "C212H350N56O78S",
    sequence: "Ac-SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
    form: "Lyophilized powder",
    storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
    stability: "2 years when stored properly",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Subcutaneous or intramuscular injection",
    variants: [
      {
        id: "tb-2mg",
        name: "2mg Vial",
        sku: "TB500-2MG",
        size: "2mg",
        price: 2999,
        inStock: true,
      },
      {
        id: "tb-5mg",
        name: "5mg Vial",
        sku: "TB500-5MG",
        size: "5mg",
        price: 5999,
        inStock: true,
      },
      {
        id: "tb-10mg",
        name: "10mg Vial",
        sku: "TB500-10MG",
        size: "10mg",
        price: 9999,
        inStock: false,
      },
    ],
    featured: true,
    popularity: 95,
  },
  {
    id: "pep-003",
    slug: "dsip",
    name: "DSIP (Delta Sleep-Inducing Peptide)",
    shortName: "DSIP",
    description:
      "DSIP is a neuropeptide that was first isolated from rabbit brain tissue. Research has examined its effects on sleep architecture and stress response in various experimental models.",
    category: "Recovery",
    researchApplications: [
      "Sleep cycle research",
      "Stress response studies",
      "Circadian rhythm models",
    ],
    casNumber: "62568-57-4",
    purity: "≥99%",
    molecularWeight: "848.82 g/mol",
    molecularFormula: "C35H48N10O15",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light.",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "dsip-5mg",
        name: "5mg Vial",
        sku: "DSIP-5MG",
        size: "5mg",
        price: 4499,
        inStock: true,
      },
    ],
    popularity: 70,
  },

  // ----------------------------------------------------------------------------
  // METABOLIC PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-004",
    slug: "cjc-1295-no-dac",
    name: "CJC-1295 (without DAC)",
    shortName: "CJC-1295",
    description:
      "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH). The version without Drug Affinity Complex (DAC) has a shorter half-life, making it useful for controlled research applications.",
    category: "Metabolic",
    researchApplications: [
      "Growth hormone axis studies",
      "Metabolic research",
      "Pituitary function models",
    ],
    casNumber: "863288-34-0",
    purity: "≥99%",
    molecularWeight: "3367.97 g/mol",
    molecularFormula: "C152H252N44O42",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Reconstituted: 2-8°C.",
    stability: "2 years when stored properly",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "cjc-2mg",
        name: "2mg Vial",
        sku: "CJC1295-2MG",
        size: "2mg",
        price: 2499,
        inStock: true,
      },
      {
        id: "cjc-5mg",
        name: "5mg Vial",
        sku: "CJC1295-5MG",
        size: "5mg",
        price: 4999,
        inStock: true,
      },
    ],
    featured: true,
    popularity: 90,
  },
  {
    id: "pep-005",
    slug: "ipamorelin",
    name: "Ipamorelin",
    shortName: "Ipamorelin",
    description:
      "Ipamorelin is a synthetic pentapeptide that acts as a selective growth hormone secretagogue. It is known for its high selectivity and minimal effects on cortisol and prolactin in research settings.",
    category: "Metabolic",
    researchApplications: [
      "GH secretagogue research",
      "Ghrelin receptor studies",
      "Metabolic pathway analysis",
    ],
    casNumber: "170851-70-4",
    purity: "≥99%",
    molecularWeight: "711.85 g/mol",
    molecularFormula: "C38H49N9O5",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
    form: "Lyophilized powder",
    storage: "Store at -20°C",
    reconstitution: "Bacteriostatic water or sterile saline",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "ipa-2mg",
        name: "2mg Vial",
        sku: "IPAM-2MG",
        size: "2mg",
        price: 1999,
        inStock: true,
      },
      {
        id: "ipa-5mg",
        name: "5mg Vial",
        sku: "IPAM-5MG",
        size: "5mg",
        price: 3999,
        inStock: true,
      },
    ],
    popularity: 88,
  },
  {
    id: "pep-006",
    slug: "aod-9604",
    name: "AOD-9604 (Anti-Obesity Drug Fragment)",
    shortName: "AOD-9604",
    description:
      "AOD-9604 is a modified form of amino acids 176-191 of the human growth hormone polypeptide. Research has focused on its potential effects on lipid metabolism without affecting blood sugar or tissue growth.",
    category: "Metabolic",
    researchApplications: [
      "Lipid metabolism studies",
      "Adipose tissue research",
      "Metabolic syndrome models",
    ],
    casNumber: "221231-10-3",
    purity: "≥98%",
    molecularWeight: "1815.08 g/mol",
    molecularFormula: "C78H125N23O23S2",
    form: "Lyophilized powder",
    storage: "Store at -20°C",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "aod-5mg",
        name: "5mg Vial",
        sku: "AOD9604-5MG",
        size: "5mg",
        price: 4499,
        inStock: true,
      },
    ],
    popularity: 75,
  },

  // ----------------------------------------------------------------------------
  // LONGEVITY PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-007",
    slug: "epithalon",
    name: "Epithalon (Epitalon)",
    shortName: "Epithalon",
    description:
      "Epithalon is a synthetic tetrapeptide based on the natural peptide epithalamin, produced by the pineal gland. Research has examined its effects on telomerase activity and cellular aging markers.",
    category: "Longevity",
    researchApplications: [
      "Telomerase activation studies",
      "Cellular senescence research",
      "Pineal gland function models",
    ],
    casNumber: "307297-39-8",
    purity: "≥99%",
    molecularWeight: "390.35 g/mol",
    molecularFormula: "C14H22N4O9",
    sequence: "Ala-Glu-Asp-Gly",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light.",
    stability: "3 years when stored properly",
    reconstitution: "Bacteriostatic water or sterile saline",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "epi-10mg",
        name: "10mg Vial",
        sku: "EPITH-10MG",
        size: "10mg",
        price: 2999,
        inStock: true,
      },
      {
        id: "epi-50mg",
        name: "50mg Vial",
        sku: "EPITH-50MG",
        size: "50mg",
        price: 11999,
        inStock: true,
      },
    ],
    featured: true,
    popularity: 85,
  },
  {
    id: "pep-008",
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    shortName: "Tα1",
    description:
      "Thymosin Alpha-1 is a 28-amino acid peptide originally isolated from thymic tissue. It has been the subject of extensive research regarding immune system modulation and T-cell function.",
    category: "Research",
    researchApplications: [
      "Immune modulation studies",
      "T-cell function research",
      "Thymic hormone models",
    ],
    casNumber: "62304-98-7",
    purity: "≥98%",
    molecularWeight: "3108.29 g/mol",
    molecularFormula: "C129H215N33O55",
    form: "Lyophilized powder",
    storage: "Store at -20°C",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "ta1-5mg",
        name: "5mg Vial",
        sku: "TA1-5MG",
        size: "5mg",
        price: 5999,
        inStock: true,
      },
    ],
    popularity: 72,
  },

  // ----------------------------------------------------------------------------
  // COGNITIVE PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-009",
    slug: "selank",
    name: "Selank",
    shortName: "Selank",
    description:
      "Selank is a synthetic analog of the immunomodulatory peptide tuftsin. Developed in Russia, it has been studied for its potential effects on cognitive function and anxiety-related behaviors in animal models.",
    category: "Cognitive",
    researchApplications: [
      "Anxiolytic research",
      "Cognitive enhancement studies",
      "Neurotransmitter modulation",
    ],
    casNumber: "129954-34-3",
    purity: "≥99%",
    molecularWeight: "751.87 g/mol",
    molecularFormula: "C33H57N11O9",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light.",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Intranasal or subcutaneous",
    variants: [
      {
        id: "sel-5mg",
        name: "5mg Vial",
        sku: "SELANK-5MG",
        size: "5mg",
        price: 3499,
        inStock: true,
      },
    ],
    popularity: 78,
  },
  {
    id: "pep-010",
    slug: "semax",
    name: "Semax",
    shortName: "Semax",
    description:
      "Semax is a synthetic peptide derived from a fragment of adrenocorticotropic hormone (ACTH). It has been extensively researched in Russia for its potential nootropic and neuroprotective properties.",
    category: "Cognitive",
    researchApplications: [
      "Neuroprotection studies",
      "Cognitive function research",
      "BDNF modulation models",
    ],
    casNumber: "80714-61-0",
    purity: "≥99%",
    molecularWeight: "813.93 g/mol",
    molecularFormula: "C37H51N9O10S",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light.",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Intranasal or subcutaneous",
    variants: [
      {
        id: "sem-30mg",
        name: "30mg Vial",
        sku: "SEMAX-30MG",
        size: "30mg",
        price: 4999,
        inStock: true,
      },
    ],
    popularity: 80,
  },

  // ----------------------------------------------------------------------------
  // COSMETIC PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-011",
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    shortName: "GHK-Cu",
    description:
      "GHK-Cu is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. Research has focused on its potential role in wound healing, collagen synthesis, and skin remodeling.",
    category: "Cosmetic",
    researchApplications: [
      "Collagen synthesis studies",
      "Wound healing research",
      "Skin regeneration models",
    ],
    casNumber: "49557-75-7",
    purity: "≥98%",
    molecularWeight: "403.93 g/mol",
    molecularFormula: "C14H23CuN6O4",
    sequence: "Gly-His-Lys:Cu",
    form: "Lyophilized powder (blue)",
    storage: "Store at -20°C. Protect from light.",
    stability: "2 years when stored properly",
    reconstitution: "Sterile water",
    administrationRoute: "Topical or subcutaneous injection",
    variants: [
      {
        id: "ghk-50mg",
        name: "50mg Vial",
        sku: "GHKCU-50MG",
        size: "50mg",
        price: 2999,
        inStock: true,
      },
      {
        id: "ghk-200mg",
        name: "200mg Vial",
        sku: "GHKCU-200MG",
        size: "200mg",
        price: 8999,
        inStock: true,
      },
    ],
    popularity: 82,
  },

  // ----------------------------------------------------------------------------
  // RESEARCH PEPTIDES
  // ----------------------------------------------------------------------------
  {
    id: "pep-012",
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    shortName: "PT-141",
    description:
      "PT-141, also known as Bremelanotide, is a synthetic peptide analog of alpha-melanocyte-stimulating hormone. It acts on the melanocortin receptors and has been studied for various research applications.",
    category: "Research",
    researchApplications: [
      "Melanocortin receptor studies",
      "CNS signaling research",
      "Behavioral pharmacology",
    ],
    casNumber: "32780-32-8",
    purity: "≥99%",
    molecularWeight: "1025.21 g/mol",
    molecularFormula: "C50H68N14O10",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    form: "Lyophilized powder",
    storage: "Store at -20°C. Protect from light.",
    stability: "2 years when stored properly",
    reconstitution: "Bacteriostatic water",
    administrationRoute: "Subcutaneous injection",
    variants: [
      {
        id: "pt141-10mg",
        name: "10mg Vial",
        sku: "PT141-10MG",
        size: "10mg",
        price: 4499,
        inStock: false,
      },
    ],
    popularity: 77,
  },
];

// ============================================================================
// UTILITY: Get products by category
// ============================================================================

export function getProductsByCategory(
  category: ResearchGoal,
): PeptideProduct[] {
  return MOCK_PEPTIDES.filter((p) => p.category === category);
}

export function getFeaturedProducts(): PeptideProduct[] {
  return MOCK_PEPTIDES.filter((p) => p.featured);
}

export function getAllCategories(): ResearchGoal[] {
  return [
    "Recovery",
    "Metabolic",
    "Longevity",
    "Cognitive",
    "Cosmetic",
    "Research",
  ];
}
