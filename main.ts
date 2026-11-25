// Real-Life Patch Notes v2: The Comedy Changelog
// Writes one patch-note line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// No network, no input files, no secrets: the text lives here.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a single-line patch note for a bug in human biology.
// An earworm: a 3-second song clip stuck on loop for hours, with no way
// to stop it. A runaway process with a missing stop button.
const ENTRY =
  "v4.2.0: fixed a bug where a 3-second song clip looped for 6 hours with no stop button.";

function fail(message: string): never {
  console.error(`entry error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate checks, mirroring the competition gate: UTF-8 text of
  // 1 to 160 characters, not only white space.
  const chars = [...ENTRY];
  if (chars.length < 1 || chars.length > 160) {
    fail(`entry is ${chars.length} characters, must be 1 to 160`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry is only white space");
  }
  // The judge brief wants one line: no newline or carriage return
  // may hide inside the text.
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }
  // Plain ASCII on purpose: no em-dash, no emoji, no curly quotes.
  // A stray non-ASCII character means the text was edited by mistake,
  // so fail loudly instead of shipping it.
  if (/[^\x20-\x7E]/.test(ENTRY)) {
    fail("entry must be plain ASCII (no em-dash, emoji, or curly quotes)");
  }
  // The gate counts characters; make sure the text round-trips as UTF-8
  // and carries no leading or trailing padding.
  const roundTrip = Buffer.from(ENTRY, "utf8").toString("utf8");
  if (roundTrip !== ENTRY) {
    fail("entry is not clean UTF-8 text");
  }
  if (ENTRY !== ENTRY.trim()) {
    fail("entry must not have leading or trailing whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read the file back: a partial or altered write must fail loudly
  // instead of shipping a wrong entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    fail("written file does not match the entry text");
  }
  console.log(`wrote ${outPath} (${chars.length} characters)`);
}

main();
