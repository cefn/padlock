import fs from "fs";

const RING_LETTERS = [
  "OFLRXAMHZD",
  "ODJPVEKRWB",
  "ODJPVEKRWB",
  "OCIQYDJPUA",
  "OCIQYDJPUA",
];

export function* listPermutations<T>(
  available: Array<T>,
  currentSequence: Array<T> = []
) {
  if (available.length === 1) {
    // only one permutation remains in this branch
    yield [...currentSequence, ...available];
  } else {
    // aggregate permutations for all descendant branches
    for (const nextChoice of available) {
      const nextSequence = [...currentSequence, nextChoice];
      const stillAvailable = available.filter((item) => item !== nextChoice);
      yield* listPermutations(stillAvailable, nextSequence);
    }
  }
}

function printMatchingLines() {
  // load dictionary lines
  const dictionaryLines = fs
    .readFileSync("/usr/share/dict/words")
    .toString()
    .split("\n");

  for (const ringNumberPermutation of listPermutations([0, 1, 2, 3, 4])) {
    // create RegExp for words matching each ring sequence, like...
    // ^[OFLRXAMHZD][ODJPVEKRWB][OCIQYDJPUA][OCIQYDJPUA][ODJPVEKRWB]$
    let pattern = "^";
    for (const ringNumber of ringNumberPermutation) {
      const ringLetters = RING_LETTERS[ringNumber];
      pattern += `[${ringLetters}]`;
    }
    pattern += "$";
    const regexpPattern = new RegExp(pattern, "i");

    // try the pattern against every line from the dictionary and print matches
    for (const dictionaryLine of dictionaryLines) {
      if (regexpPattern.test(dictionaryLine)) {
        console.log(`${dictionaryLine} from ${pattern}`);
      }
    }
  }
}

printMatchingLines();
