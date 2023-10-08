/**
 *  Generate a random number between 1 and the given max number parameter
 * @param maxNumber
 * @returns a random number between 1 and the given max number parameter
 */
export const generateRandomNumber = (maxNumber: number) => {
  return Math.floor(Math.random() * maxNumber) + 1;
};
