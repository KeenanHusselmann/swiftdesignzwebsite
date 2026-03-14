import { describe, it, expect } from "vitest";
import {
  buildPlan,
  escapeHtml,
  getPackageLabel,
  SERVICE_LABELS,
  PACKAGES_LABELS,
  PROPOSED_PLANS,
  VALID_SERVICES,
  EMAIL_REGEX,
} from "../quoteUtils";

// ─── SERVICE_LABELS ────────────────────────────────────────────────────────────

describe("SERVICE_LABELS", () => {
  it("contains exactly 5 services", () => {
    expect(Object.keys(SERVICE_LABELS)).toHaveLength(5);
  });

  it("contains all expected service IDs", () => {
    const expected = ["website", "ecommerce", "app", "ai-training", "pm-training"];
    expected.forEach((id) => expect(SERVICE_LABELS).toHaveProperty(id));
  });

  it("values are non-empty strings", () => {
    Object.values(SERVICE_LABELS).forEach((label) => {
      expect(typeof label).toBe("string");
      expect(label.length).toBeGreaterThan(0);
    });
  });
});

// ─── VALID_SERVICES ────────────────────────────────────────────────────────────

describe("VALID_SERVICES", () => {
  it("matches the keys of SERVICE_LABELS", () => {
    expect(VALID_SERVICES.sort()).toEqual(Object.keys(SERVICE_LABELS).sort());
  });
});

// ─── PACKAGES_LABELS ──────────────────────────────────────────────────────────

describe("PACKAGES_LABELS", () => {
  it("has an entry for every service in SERVICE_LABELS", () => {
    Object.keys(SERVICE_LABELS).forEach((id) => {
      expect(PACKAGES_LABELS).toHaveProperty(id);
    });
  });

  it("website packages include starter, professional, premium and not-sure", () => {
    const pkgs = Object.keys(PACKAGES_LABELS.website);
    expect(pkgs).toContain("starter");
    expect(pkgs).toContain("professional");
    expect(pkgs).toContain("premium");
    expect(pkgs).toContain("not-sure");
  });

  it("ecommerce packages include starter, business, enterprise and not-sure", () => {
    const pkgs = Object.keys(PACKAGES_LABELS.ecommerce);
    expect(pkgs).toContain("starter");
    expect(pkgs).toContain("business");
    expect(pkgs).toContain("enterprise");
    expect(pkgs).toContain("not-sure");
  });

  it("app packages include mvp, standard, full-scale and not-sure", () => {
    const pkgs = Object.keys(PACKAGES_LABELS.app);
    expect(pkgs).toContain("mvp");
    expect(pkgs).toContain("standard");
    expect(pkgs).toContain("full-scale");
    expect(pkgs).toContain("not-sure");
  });

  it("training packages include individual, team, workshop and not-sure", () => {
    (["ai-training", "pm-training"] as const).forEach((svc) => {
      const pkgs = Object.keys(PACKAGES_LABELS[svc]);
      expect(pkgs).toContain("individual");
      expect(pkgs).toContain("team");
      expect(pkgs).toContain("workshop");
      expect(pkgs).toContain("not-sure");
    });
  });
});

// ─── buildPlan ────────────────────────────────────────────────────────────────

/** Every valid service/package combo that has plan phases. */
const ALL_COMBOS: [string, string, number][] = [
  ["website",      "starter",      5],
  ["website",      "professional", 6],
  ["website",      "premium",      7],
  ["ecommerce",    "starter",      5],
  ["ecommerce",    "business",     6],
  ["ecommerce",    "enterprise",   7],
  ["app",          "mvp",          5],
  ["app",          "standard",     6],
  ["app",          "full-scale",   8],
  ["ai-training",  "individual",   4],
  ["ai-training",  "team",         5],
  ["ai-training",  "workshop",     5],
  ["pm-training",  "individual",   4],
  ["pm-training",  "team",         4],
  ["pm-training",  "workshop",     5],
];

describe("buildPlan — coverage", () => {
  it.each(ALL_COMBOS)(
    "%s / %s returns exactly %i phases",
    (service, pkg, expectedCount) => {
      const phases = buildPlan(service, pkg);
      expect(phases).toHaveLength(expectedCount);
    },
  );

  it("returns [] for an unknown service", () => {
    expect(buildPlan("unknown-service", "starter")).toHaveLength(0);
  });

  it("returns [] for an unknown package", () => {
    expect(buildPlan("website", "unknown-pkg")).toHaveLength(0);
  });

  it("returns [] for both args empty", () => {
    expect(buildPlan("", "")).toHaveLength(0);
  });

  it("normalises uppercase package input to lowercase", () => {
    expect(buildPlan("website", "Starter").length).toBeGreaterThan(0);
  });

  it("normalises whitespace in package input", () => {
    expect(buildPlan("app", "full scale").length).toBeGreaterThan(0);
  });
});

describe("buildPlan — phase data integrity", () => {
  it.each(ALL_COMBOS)(
    "%s / %s — every phase has all 4 required fields",
    (service, pkg) => {
      const phases = buildPlan(service, pkg);
      phases.forEach((ph) => {
        expect(typeof ph.title).toBe("string");
        expect(ph.title.length).toBeGreaterThan(0);
        expect(typeof ph.desc).toBe("string");
        expect(ph.desc.length).toBeGreaterThan(0);
        expect(typeof ph.duration).toBe("string");
        expect(ph.duration.length).toBeGreaterThan(0);
        expect(typeof ph.deliverable).toBe("string");
        expect(ph.deliverable.length).toBeGreaterThan(0);
      });
    },
  );
});

describe("buildPlan — PROPOSED_PLANS completeness", () => {
  it("PROPOSED_PLANS covers all non-not-sure packages for every service", () => {
    Object.entries(PACKAGES_LABELS).forEach(([service, pkgs]) => {
      const realPkgs = Object.keys(pkgs).filter((k) => k !== "not-sure");
      realPkgs.forEach((pkg) => {
        const phases = PROPOSED_PLANS[service]?.[pkg];
        expect(phases, `${service}/${pkg} should have plan phases`).toBeDefined();
        expect(phases!.length, `${service}/${pkg} should have at least 1 phase`).toBeGreaterThan(0);
      });
    });
  });
});

// ─── escapeHtml ────────────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes &", () => expect(escapeHtml("a & b")).toBe("a &amp; b"));
  it("escapes <", () => expect(escapeHtml("<script>")).toBe("&lt;script&gt;"));
  it("escapes >", () => expect(escapeHtml("1 > 0")).toBe("1 &gt; 0"));
  it('escapes "', () => expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;"));
  it("escapes '", () => expect(escapeHtml("it's")).toBe("it&#039;s"));
  it("leaves clean text unchanged", () => expect(escapeHtml("Hello World 123")).toBe("Hello World 123"));
  it("handles empty string", () => expect(escapeHtml("")).toBe(""));
  it("escapes multiple special chars in one string", () => {
    expect(escapeHtml('<a href="x">O\'Reilly & Sons</a>')).toBe(
      "&lt;a href=&quot;x&quot;&gt;O&#039;Reilly &amp; Sons&lt;/a&gt;",
    );
  });
});

// ─── EMAIL_REGEX ──────────────────────────────────────────────────────────────

describe("EMAIL_REGEX", () => {
  const valid = [
    "user@example.com",
    "user.name+tag@domain.co.za",
    "x@y.io",
    "info@swiftdesignz.co.za",
  ];
  const invalid = [
    "plainaddress",
    "@missinglocal.com",
    "missing@domain",
    "two@@at.com",
    "spaces in@email.com",
    "",
  ];

  it.each(valid)("accepts valid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(true);
  });

  it.each(invalid)("rejects invalid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(false);
  });
});

// ─── getPackageLabel ──────────────────────────────────────────────────────────

describe("getPackageLabel", () => {
  it("returns the label for website/starter", () => {
    expect(getPackageLabel("website", "starter")).toBe("Starter (from R2,500)");
  });

  it("returns the label for app/full-scale", () => {
    expect(getPackageLabel("app", "full-scale")).toBe("Full-Scale (from R25,000)");
  });

  it("returns the label for ecommerce/enterprise", () => {
    expect(getPackageLabel("ecommerce", "enterprise")).toBe("Enterprise (from R15,000)");
  });

  it("returns 'Not sure yet' for not-sure package", () => {
    expect(getPackageLabel("website", "not-sure")).toBe("Not sure yet");
  });

  it("returns the raw pkg value as fallback for unknown service", () => {
    expect(getPackageLabel("unknown-svc", "some-pkg")).toBe("some-pkg");
  });

  it("returns — for unknown service + empty/undefined pkg", () => {
    expect(getPackageLabel("unknown-svc", "")).toBe("—");
  });
});
