import fs from "fs";

type StringList = Array<string>;
type PermutationList<T> = Array<Array<T>>;

const RING_LETTERS: StringList = [
  "OFLRXAMHZD",
  "ODJPVEKRWB",
  "ODJPVEKRWB",
  "OCIQYDJPUA",
  "OCIQYDJPUA",
];

export function listPermutations<T>(
  unpicked: Set<T>,
  picked: Array<T> = []
): PermutationList<T> {
  const permutationList: PermutationList<T> = [];
  if (unpicked.size === 1) {
    const permutation = [...picked, ...unpicked.values()];
    permutationList.push(permutation);
  } else {
    for (const pick of unpicked) {
      const stillUnpicked = new Set(unpicked);
      stillUnpicked.delete(pick);
      const chosenPermutations: PermutationList<T> = listPermutations(
        stillUnpicked,
        [...picked, pick]
      );
      permutationList.push(...chosenPermutations);
    }
  }
  return permutationList;
}

function printMatchingLines() {
  // load the dictionary from file
  const dictionaryLines = fs
    .readFileSync("/usr/share/dict/words")
    .toString()
    .split("\n");

  console.log(`Read ${dictionaryLines.length} lines`);

  // create a RegExp pattern for every ring combination
  const ringNumberPermutations = listPermutations(new Set([0, 1, 2, 3, 4]));
  for (const ringNumberPermutation of ringNumberPermutations) {
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
