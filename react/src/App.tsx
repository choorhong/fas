import ListItem from "./components/ListItem";
import "./App.css";
import Form from "./components/Form";
import { generateRandomNumber } from "./helpers";

const App = () => {
  // Write a React function that takes a number as input and returns a list of that length, with each item consisting of a random number between 1 and 100.
  const randomNumberList = (listLength: string | number) => {
    const num = Number(listLength);
    if (!num || isNaN(num)) {
      return "Fail...";
    }

    // Generate an array of random numbers
    const randomNumbers = Array.from({ length: num }, () =>
      generateRandomNumber(100)
    );
    return randomNumbers;
  };

  return (
    <>
      <ListItem onItemClick={randomNumberList} />
      <fieldset>
        <legend>Form</legend>
        <Form />
      </fieldset>
    </>
  );
};

export default App;
