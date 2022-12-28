import fs from "fs";

type StringList = Array<string>;

const RING_LETTERS: StringList = [
  "OFLRXAMHZD",
  "ODJPVEKRWB",
  "ODJPVEKRWB",
  "OCIQYDJPUA",
  "OCIQYDJPUA",
];

export function* listPermutations<T>(
  remaining: Array<T>,
  sequence: Array<T> = []
) {
  if (remaining.length === 1) {
    // end of branch return a list containing a single permutation list
    yield [...sequence, ...remaining.values()];
  } else {
    // aggregate the permutations
    yield* remaining.flatMap((chosenItem) => {
      return listPermutations(
        remaining.filter((item) => item !== chosenItem),
        [...sequence, chosenItem]
      );
    });
  }
}

function printMatchingLines() {
  // load the dictionary from file
  const dictionaryLines = fs
    .readFileSync("/usr/share/dict/words")
    .toString()
    .split("\n");

  // create a RegExp pattern for every ring combination
  for (const ringNumberPermutation of listPermutations([0, 1, 2, 3, 4])) {
    let pattern = "^";
    for (const ringNumber of ringNumberPermutation) {
      const ringLetters = RING_LETTERS[ringNumber];
      pattern += `[${ringLetters}]`;
    }
    pattern += "$";

    const regexpPattern = new RegExp(pattern, "i");
    for (const dictionaryLine of dictionaryLines) {
      if (regexpPattern.test(dictionaryLine)) {
        console.log(`${dictionaryLine} from ${pattern}`);
      }
    }
  }
}

printMatchingLines();
