import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("product list screen", () => {
  it("does not ship catalog debug controls", () => {
    const source = readFileSync(join(process.cwd(), "app", "index.tsx"), "utf8");

    expect(source).not.toContain("Test error");
    expect(source).not.toContain("Show catalog error state");
  });
});
