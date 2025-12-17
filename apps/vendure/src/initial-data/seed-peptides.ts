/**
 * PEPTIDE Seed Script
 *
 * Creates research peptide products for the pharma-store / PEPTIDES brand.
 * - Idempotent: Upserts by slug/sku (NO deletes)
 * - Channel-scoped: All writes to 'peptide' channel only
 * - Manual only: NOT called from init-vendure.ts
 *
 * Run with: pnpm --filter @shofar/vendure run seed:peptides
 *
 * Phase 3 – peptide seed data; mocks to be retired once this is verified in dev.
 */

// Production guard - NEVER run in production
if (process.env.NODE_ENV === "production") {
  throw new Error("Do not run seed scripts in production!");
}

import { bootstrap } from "@vendure/core";
import { config } from "../vendure-config";
import {
  ChannelService,
  RequestContext,
  ProductService,
  ProductVariantService,
  FacetService,
  FacetValueService,
  LanguageCode,
  Channel,
  Facet,
  FacetValue,
  Product,
  ID,
} from "@vendure/core";

// ============================================================================
// PEPTIDE DATA (mirrors mock-peptides.ts from pharma-store)
// ============================================================================

interface PeptideVariantData {
  name: string;
  sku: string;
  size: string;
  price: number; // cents
  stock: number;
  purity: string;
  storage: string;
  administrationRoute: string;
  form: string;
}

interface PeptideProductData {
  name: string;
  slug: string;
  shortName: string;
  description: string;
  category: string; // Research goal
  casNumber: string;
  molecularWeight: string;
  molecularFormula?: string;
  sequence?: string;
  variants: PeptideVariantData[];
  featured?: boolean;
  popularity?: number;
}

const PEPTIDE_PRODUCTS: PeptideProductData[] = [
  // RECOVERY PEPTIDES
  {
    name: "BPC-157 (Body Protection Compound)",
    slug: "bpc-157",
    shortName: "BPC-157",
    description:
      "BPC-157 is a synthetic peptide derived from a protein found in human gastric juice. This 15-amino acid peptide chain has been extensively studied in research settings for its potential applications in tissue repair and regeneration studies.",
    category: "Recovery",
    casNumber: "137525-51-0",
    molecularWeight: "1419.53 g/mol",
    molecularFormula: "C62H98N16O22",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    variants: [
      {
        name: "5mg Vial",
        sku: "BPC157-5MG",
        size: "5mg",
        price: 3999,
        stock: 100,
        purity: "≥99%",
        storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
      {
        name: "10mg Vial",
        sku: "BPC157-10MG",
        size: "10mg",
        price: 6999,
        stock: 75,
        purity: "≥99%",
        storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    featured: true,
    popularity: 100,
  },
  {
    name: "TB-500 (Thymosin Beta-4 Fragment)",
    slug: "tb-500",
    shortName: "TB-500",
    description:
      "TB-500 is a synthetic fraction of the protein Thymosin Beta-4, a naturally occurring 43-amino acid peptide. Research has focused on its role in cellular migration and tissue repair mechanisms.",
    category: "Recovery",
    casNumber: "77591-33-4",
    molecularWeight: "4963.44 g/mol",
    molecularFormula: "C212H350N56O78S",
    sequence: "Ac-SDKPDMAEIEKFDKSKLKKTETQEKNPLPSKETIEQEKQAGES",
    variants: [
      {
        name: "2mg Vial",
        sku: "TB500-2MG",
        size: "2mg",
        price: 2999,
        stock: 100,
        purity: "≥98%",
        storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous or intramuscular injection",
        form: "Lyophilized powder",
      },
      {
        name: "5mg Vial",
        sku: "TB500-5MG",
        size: "5mg",
        price: 5999,
        stock: 80,
        purity: "≥98%",
        storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous or intramuscular injection",
        form: "Lyophilized powder",
      },
      {
        name: "10mg Vial",
        sku: "TB500-10MG",
        size: "10mg",
        price: 9999,
        stock: 0,
        purity: "≥98%",
        storage: "Store lyophilized at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous or intramuscular injection",
        form: "Lyophilized powder",
      },
    ],
    featured: true,
    popularity: 95,
  },
  {
    name: "DSIP (Delta Sleep-Inducing Peptide)",
    slug: "dsip",
    shortName: "DSIP",
    description:
      "DSIP is a neuropeptide that was first isolated from rabbit brain tissue. Research has examined its effects on sleep architecture and stress response in various experimental models.",
    category: "Recovery",
    casNumber: "62568-57-4",
    molecularWeight: "848.82 g/mol",
    molecularFormula: "C35H48N10O15",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    variants: [
      {
        name: "5mg Vial",
        sku: "DSIP-5MG",
        size: "5mg",
        price: 4499,
        stock: 60,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    popularity: 70,
  },

  // METABOLIC PEPTIDES
  {
    name: "CJC-1295 (without DAC)",
    slug: "cjc-1295-no-dac",
    shortName: "CJC-1295",
    description:
      "CJC-1295 is a synthetic analog of growth hormone-releasing hormone (GHRH). The version without Drug Affinity Complex (DAC) has a shorter half-life, making it useful for controlled research applications.",
    category: "Metabolic",
    casNumber: "863288-34-0",
    molecularWeight: "3367.97 g/mol",
    molecularFormula: "C152H252N44O42",
    variants: [
      {
        name: "2mg Vial",
        sku: "CJC1295-2MG",
        size: "2mg",
        price: 2499,
        stock: 100,
        purity: "≥99%",
        storage: "Store at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
      {
        name: "5mg Vial",
        sku: "CJC1295-5MG",
        size: "5mg",
        price: 4999,
        stock: 70,
        purity: "≥99%",
        storage: "Store at -20°C. Reconstituted: 2-8°C.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    featured: true,
    popularity: 90,
  },
  {
    name: "Ipamorelin",
    slug: "ipamorelin",
    shortName: "Ipamorelin",
    description:
      "Ipamorelin is a synthetic pentapeptide that acts as a selective growth hormone secretagogue. It is known for its high selectivity and minimal effects on cortisol and prolactin in research settings.",
    category: "Metabolic",
    casNumber: "170851-70-4",
    molecularWeight: "711.85 g/mol",
    molecularFormula: "C38H49N9O5",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2",
    variants: [
      {
        name: "2mg Vial",
        sku: "IPAM-2MG",
        size: "2mg",
        price: 1999,
        stock: 120,
        purity: "≥99%",
        storage: "Store at -20°C",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
      {
        name: "5mg Vial",
        sku: "IPAM-5MG",
        size: "5mg",
        price: 3999,
        stock: 90,
        purity: "≥99%",
        storage: "Store at -20°C",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    popularity: 88,
  },
  {
    name: "AOD-9604 (Anti-Obesity Drug Fragment)",
    slug: "aod-9604",
    shortName: "AOD-9604",
    description:
      "AOD-9604 is a modified form of amino acids 176-191 of the human growth hormone polypeptide. Research has focused on its potential effects on lipid metabolism without affecting blood sugar or tissue growth.",
    category: "Metabolic",
    casNumber: "221231-10-3",
    molecularWeight: "1815.08 g/mol",
    molecularFormula: "C78H125N23O23S2",
    variants: [
      {
        name: "5mg Vial",
        sku: "AOD9604-5MG",
        size: "5mg",
        price: 4499,
        stock: 50,
        purity: "≥98%",
        storage: "Store at -20°C",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    popularity: 75,
  },

  // LONGEVITY PEPTIDES
  {
    name: "Epithalon (Epitalon)",
    slug: "epithalon",
    shortName: "Epithalon",
    description:
      "Epithalon is a synthetic tetrapeptide based on the natural peptide epithalamin, produced by the pineal gland. Research has examined its effects on telomerase activity and cellular aging markers.",
    category: "Longevity",
    casNumber: "307297-39-8",
    molecularWeight: "390.35 g/mol",
    molecularFormula: "C14H22N4O9",
    sequence: "Ala-Glu-Asp-Gly",
    variants: [
      {
        name: "10mg Vial",
        sku: "EPITH-10MG",
        size: "10mg",
        price: 2999,
        stock: 80,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
      {
        name: "50mg Vial",
        sku: "EPITH-50MG",
        size: "50mg",
        price: 11999,
        stock: 30,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    featured: true,
    popularity: 85,
  },
  {
    name: "Thymosin Alpha-1",
    slug: "thymosin-alpha-1",
    shortName: "Tα1",
    description:
      "Thymosin Alpha-1 is a 28-amino acid peptide originally isolated from thymic tissue. It has been the subject of extensive research regarding immune system modulation and T-cell function.",
    category: "Research",
    casNumber: "62304-98-7",
    molecularWeight: "3108.29 g/mol",
    molecularFormula: "C129H215N33O55",
    variants: [
      {
        name: "5mg Vial",
        sku: "TA1-5MG",
        size: "5mg",
        price: 5999,
        stock: 40,
        purity: "≥98%",
        storage: "Store at -20°C",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    popularity: 72,
  },

  // COGNITIVE PEPTIDES
  {
    name: "Selank",
    slug: "selank",
    shortName: "Selank",
    description:
      "Selank is a synthetic analog of the immunomodulatory peptide tuftsin. Developed in Russia, it has been studied for its potential effects on cognitive function and anxiety-related behaviors in animal models.",
    category: "Cognitive",
    casNumber: "129954-34-3",
    molecularWeight: "751.87 g/mol",
    molecularFormula: "C33H57N11O9",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro",
    variants: [
      {
        name: "5mg Vial",
        sku: "SELANK-5MG",
        size: "5mg",
        price: 3499,
        stock: 60,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Intranasal or subcutaneous",
        form: "Lyophilized powder",
      },
    ],
    popularity: 78,
  },
  {
    name: "Semax",
    slug: "semax",
    shortName: "Semax",
    description:
      "Semax is a synthetic peptide derived from a fragment of adrenocorticotropic hormone (ACTH). It has been extensively researched in Russia for its potential nootropic and neuroprotective properties.",
    category: "Cognitive",
    casNumber: "80714-61-0",
    molecularWeight: "813.93 g/mol",
    molecularFormula: "C37H51N9O10S",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    variants: [
      {
        name: "30mg Vial",
        sku: "SEMAX-30MG",
        size: "30mg",
        price: 4999,
        stock: 50,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Intranasal or subcutaneous",
        form: "Lyophilized powder",
      },
    ],
    popularity: 80,
  },

  // COSMETIC PEPTIDES
  {
    name: "GHK-Cu (Copper Peptide)",
    slug: "ghk-cu",
    shortName: "GHK-Cu",
    description:
      "GHK-Cu is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. Research has focused on its potential role in wound healing, collagen synthesis, and skin remodeling.",
    category: "Cosmetic",
    casNumber: "49557-75-7",
    molecularWeight: "403.93 g/mol",
    molecularFormula: "C14H23CuN6O4",
    sequence: "Gly-His-Lys:Cu",
    variants: [
      {
        name: "50mg Vial",
        sku: "GHKCU-50MG",
        size: "50mg",
        price: 2999,
        stock: 70,
        purity: "≥98%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Topical or subcutaneous injection",
        form: "Lyophilized powder (blue)",
      },
      {
        name: "200mg Vial",
        sku: "GHKCU-200MG",
        size: "200mg",
        price: 8999,
        stock: 25,
        purity: "≥98%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Topical or subcutaneous injection",
        form: "Lyophilized powder (blue)",
      },
    ],
    popularity: 82,
  },

  // RESEARCH PEPTIDES
  {
    name: "PT-141 (Bremelanotide)",
    slug: "pt-141",
    shortName: "PT-141",
    description:
      "PT-141, also known as Bremelanotide, is a synthetic peptide analog of alpha-melanocyte-stimulating hormone. It acts on the melanocortin receptors and has been studied for various research applications.",
    category: "Research",
    casNumber: "32780-32-8",
    molecularWeight: "1025.21 g/mol",
    molecularFormula: "C50H68N14O10",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    variants: [
      {
        name: "10mg Vial",
        sku: "PT141-10MG",
        size: "10mg",
        price: 4499,
        stock: 0,
        purity: "≥99%",
        storage: "Store at -20°C. Protect from light.",
        administrationRoute: "Subcutaneous injection",
        form: "Lyophilized powder",
      },
    ],
    popularity: 77,
  },
];

// Research Goal facet
const RESEARCH_GOAL_FACET = {
  code: "research-goal",
  name: "Research Goal",
  values: [
    { code: "recovery", name: "Recovery" },
    { code: "metabolic", name: "Metabolic" },
    { code: "longevity", name: "Longevity" },
    { code: "cognitive", name: "Cognitive" },
    { code: "cosmetic", name: "Cosmetic" },
    { code: "research", name: "Research" },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function getOrCreateFacet(
  ctx: RequestContext,
  facetService: FacetService,
  code: string,
  name: string,
): Promise<Facet> {
  const existing = await facetService.findByCode(ctx, code, LanguageCode.en);
  if (existing) {
    console.log(`  Found existing facet: ${code}`);
    return existing;
  }

  console.log(`  Creating facet: ${code}`);
  return facetService.create(ctx, {
    code,
    isPrivate: false,
    translations: [{ languageCode: LanguageCode.en, name }],
    values: [],
  });
}

async function getOrCreateFacetValue(
  ctx: RequestContext,
  facetService: FacetService,
  facetValueService: FacetValueService,
  facet: Facet,
  code: string,
  name: string,
): Promise<FacetValue> {
  const updatedFacet = await facetService.findByCode(
    ctx,
    facet.code,
    LanguageCode.en,
  );
  const existing = updatedFacet?.values?.find(
    (v: FacetValue) => v.code === code,
  );
  if (existing) {
    console.log(`    Found existing facet value: ${code}`);
    return existing;
  }

  console.log(`    Creating facet value: ${code}`);
  return facetValueService.create(ctx, facet, {
    code,
    translations: [{ languageCode: LanguageCode.en, name }],
  });
}

async function findProductBySlug(
  ctx: RequestContext,
  productService: ProductService,
  slug: string,
): Promise<Product | undefined> {
  const result = await productService.findAll(ctx, {
    filter: { slug: { eq: slug } },
    take: 1,
  });
  return result.items[0];
}

async function findVariantBySku(
  ctx: RequestContext,
  variantService: ProductVariantService,
  sku: string,
) {
  const result = await variantService.findAll(ctx, {
    filter: { sku: { eq: sku } },
    take: 1,
  });
  return result.items[0];
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function seedPeptides() {
  console.log("\n========================================");
  console.log("PEPTIDE Seed Script");
  console.log("========================================\n");

  const app = await bootstrap(config);

  const channelService = app.get(ChannelService);
  const productService = app.get(ProductService);
  const variantService = app.get(ProductVariantService);
  const facetService = app.get(FacetService);
  const facetValueService = app.get(FacetValueService);

  try {
    // ========================================================================
    // 1. Get peptide channel
    // ========================================================================
    console.log("1. Finding peptide channel...");

    const defaultChannel = await channelService.getDefaultChannel();
    const initialCtx = new RequestContext({
      channel: defaultChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: "admin",
    });

    const channels = await channelService.findAll(initialCtx);
    const peptideChannel = channels.items.find(
      (c: Channel) => c.code === "peptide",
    );

    if (!peptideChannel) {
      throw new Error(
        "peptide channel not found! Run setup first: pnpm --filter @shofar/vendure run setup",
      );
    }

    const ctx = new RequestContext({
      channel: peptideChannel,
      languageCode: LanguageCode.en,
      isAuthorized: true,
      authorizedAsOwnerOnly: false,
      apiType: "admin",
    });

    console.log(
      `   Channel: ${peptideChannel.code} (ID: ${peptideChannel.id})`,
    );

    // ========================================================================
    // 2. Create/update Research Goal facet
    // ========================================================================
    console.log("\n2. Setting up Research Goal facet...");

    const researchGoalFacet = await getOrCreateFacet(
      ctx,
      facetService,
      RESEARCH_GOAL_FACET.code,
      RESEARCH_GOAL_FACET.name,
    );
    const goalValues: Record<string, FacetValue> = {};
    for (const val of RESEARCH_GOAL_FACET.values) {
      goalValues[val.code] = await getOrCreateFacetValue(
        ctx,
        facetService,
        facetValueService,
        researchGoalFacet,
        val.code,
        val.name,
      );
    }

    console.log("   Research Goal facet ready with 6 values");

    // ========================================================================
    // 3. Upsert peptide products
    // ========================================================================
    console.log("\n3. Upserting peptide products...");

    let productCount = 0;
    let variantCount = 0;

    for (const peptideData of PEPTIDE_PRODUCTS) {
      console.log(`\n   Processing: ${peptideData.shortName}`);

      // Find goal facet value
      const goalCode = peptideData.category.toLowerCase();
      const goalFacetValue = goalValues[goalCode];
      const facetValueIds: ID[] = goalFacetValue?.id ? [goalFacetValue.id] : [];

      // Check if product exists
      let peptideProduct = await findProductBySlug(
        ctx,
        productService,
        peptideData.slug,
      );

      // Prepare custom fields
      const productCustomFields = {
        casNumber: peptideData.casNumber,
        sequence: peptideData.sequence || null,
        family: null, // Could be added later
        researchGoals: [peptideData.category],
        molecularWeight: peptideData.molecularWeight,
        molecularFormula: peptideData.molecularFormula || null,
        sdsUrl: null,
        coaUrl: null,
        featured: peptideData.featured || false,
        popularity: peptideData.popularity || 0,
      };

      if (peptideProduct) {
        console.log(`     Found existing product (ID: ${peptideProduct.id})`);
        await productService.update(ctx, {
          id: peptideProduct.id,
          enabled: true,
          facetValueIds,
          customFields: productCustomFields,
        });
      } else {
        console.log(`     Creating new product...`);
        peptideProduct = await productService.create(ctx, {
          enabled: true,
          translations: [
            {
              languageCode: LanguageCode.en,
              name: peptideData.name,
              slug: peptideData.slug,
              description: peptideData.description,
            },
          ],
          facetValueIds,
          customFields: productCustomFields,
        });
        console.log(`     Created product (ID: ${peptideProduct.id})`);
      }
      productCount++;

      // ========================================================================
      // 4. Upsert variants for this product
      // ========================================================================
      for (const variantData of peptideData.variants) {
        const existingVariant = await findVariantBySku(
          ctx,
          variantService,
          variantData.sku,
        );

        // Variant custom fields
        const variantCustomFields = {
          purityPercent: variantData.purity,
          sizeMg: variantData.size,
          storage: variantData.storage,
          administrationRoute: variantData.administrationRoute,
          form: variantData.form,
        };

        if (existingVariant) {
          console.log(`     Updating variant: ${variantData.sku}`);
          await variantService.update(ctx, [
            {
              id: existingVariant.id,
              price: variantData.price,
              stockOnHand: variantData.stock,
              translations: [
                { languageCode: LanguageCode.en, name: variantData.name },
              ],
              customFields: variantCustomFields,
            },
          ]);
        } else {
          try {
            console.log(`     Creating variant: ${variantData.sku}`);
            await variantService.create(ctx, [
              {
                productId: peptideProduct.id,
                sku: variantData.sku,
                price: variantData.price,
                stockOnHand: variantData.stock,
                trackInventory: true as any,
                translations: [
                  { languageCode: LanguageCode.en, name: variantData.name },
                ],
                customFields: variantCustomFields,
              },
            ]);
          } catch (err: any) {
            if (
              err?.message?.includes("already-exists") ||
              err?.code === "USER_INPUT_ERROR"
            ) {
              console.log(
                `     ⚠️ Variant ${variantData.sku} already exists (skipping)`,
              );
            } else {
              throw err;
            }
          }
        }
        variantCount++;
      }
    }

    // ========================================================================
    // Summary
    // ========================================================================
    console.log("\n========================================");
    console.log("PEPTIDE SEED COMPLETE");
    console.log("========================================");
    console.log(`Channel: peptide`);
    console.log(`Products: ${productCount}`);
    console.log(`Variants: ${variantCount}`);
    console.log(`Research Goals: ${RESEARCH_GOAL_FACET.values.length}`);
    console.log("========================================\n");
  } catch (error: any) {
    console.error("\nSEED ERROR:", error?.message || error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed
seedPeptides()
  .then(() => {
    console.log("Peptide seed script completed successfully.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Peptide seed script failed:", error);
    process.exit(1);
  });
