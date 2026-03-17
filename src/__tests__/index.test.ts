import { describe, expect, it } from "vitest";
import { isTitleAllowed, parseAllowedPrefixes } from "../lib.js";

describe("parseAllowedPrefixes", () => {
    it("splits comma-separated values", () => {
        expect(parseAllowedPrefixes("feat,fix,chore")).toEqual(["feat", "fix", "chore"]);
    });

    it("splits newline-separated values and trims", () => {
        expect(parseAllowedPrefixes("feat:\nfix:\n\n chore: ")).toEqual([
            "feat:",
            "fix:",
            "chore:",
        ]);
    });
});

describe("isTitleAllowed", () => {
    it("returns true for matching prefix", () => {
        expect(isTitleAllowed("feat: add linting", ["feat:", "fix:"])).toBe(true);
    });

    it("returns false when no prefix matches", () => {
        expect(isTitleAllowed("docs: update readme", ["feat:", "fix:"])).toBe(false);
    });
});
