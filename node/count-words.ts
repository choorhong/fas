import promptSync from "prompt-sync";
const prompt = promptSync();

// Write a Node.js function that takes a string as input and returns the number of words in the string.
const countWords = (inputString: string) => {
  // Remove leading and trailing white spaces and then split the string by spaces
  const wordsArray = inputString.trim().split(/\s+/);

  // Return the number of words in the array
  return wordsArray.length;
};

const numberOfWords = prompt("Please input: ");
const wordCount = countWords(numberOfWords);
console.log(`Number of words: ${wordCount}`);
