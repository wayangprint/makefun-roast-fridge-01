// Entry program for the "One Line, One Laugh: Roast Your Fridge"
// make.fun bounty.
//
// The deliverable is a single fixed roast line. Nothing here is
// random, time-dependent, or fetched over the network, so every
// invocation produces the exact same bytes on stdout and in the
// entry file.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast itself: one sentence about a fridge that drones on
// a single pitch through the night.
const roastLine =
  "My fridge hums a single note all night, like a bee that failed music school and still landed the kitchen gig.";

// Competition bounds for the entry file: at least one character,
// at most two hundred. Count code points, not UTF-16 units.
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const lineLength = Array.from(roastLine).length;
if (lineLength < MIN_CHARS || lineLength > MAX_CHARS) {
  throw new Error(
    `roast line is ${lineLength} characters; the allowed range is ${MIN_CHARS}-${MAX_CHARS}`,
  );
}

// Where the graded entry file goes. A local verifier can redirect
// it with MAKEFUN_OUTPUT_DIR; the harness default is /output.
function publish(line: string): void {
  const destDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(destDir, { recursive: true });
  const destPath = join(destDir, "entry.txt");
  writeFileSync(destPath, line, "utf8");

  // Guard against a torn write: the bytes on disk must be exactly
  // the line we intend to submit before anything is printed.
  const onDisk = readFileSync(destPath, "utf8");
  if (onDisk !== line) {
    throw new Error("entry.txt contents differ from the roast line");
  }
}

publish(roastLine);

process.stdout.write(`${roastLine}\n`);
