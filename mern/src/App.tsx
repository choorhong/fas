import { useEffect, useReducer, useRef, useState } from "react";
import Modal from "./components/Modal";
import ListItem from "./components/ListItem";

type ReducerActionType = {
  type: "SET-ERRORS" | "CLEAR-ERROR";
  error:
    | {
        name: string;
        message?: string | null;
      }
    | { [x: string]: string };
};

const initialErrorState = { name: null, date: null };

const requiredInputFields = ["name", "date"];

const debounce = (cb: (...params: any) => void) => {
  let timeoutId: number | undefined;

  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, 500);
  };
};

const reducer = (state: Record<string, any>, action: ReducerActionType) => {
  switch (action.type) {
    case "SET-ERRORS":
      return { ...state, ...action.error };
    case "CLEAR-ERROR":
      return { ...state, [action.error.name]: null };

    default:
      return state;
  }
};

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const inputRef = useRef<Record<string, any>>({});

  const [inputStates, setInputState] = useState();
  const [errorState, dispatch] = useReducer(reducer, initialErrorState);

  const [state, setState] = useState<Record<string, any>[]>([]);

  const debouncedSearch = debounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (!value) return;

      // search through current state array or "fictitiously search through cache".
      const feFilteredItems = state?.filter((item) => {
        return (item.name as string)
          .toLowerCase()
          .includes(value.toLowerCase());
      });

      if (feFilteredItems?.length) {
        setState(feFilteredItems);
        return;
      }

      // else reach to the server to retrieve more data
      try {
        const response = await fetch("http://localhost/search-schedules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchText: value }),
        });

        const resBody = await response.json();
        setState(resBody.result);
      } catch (error) {
        console.error("error", (error as unknown as Error).message);
      }
    }
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost/schedules", {
          method: "GET",
        });

        const resBody = await response.json();
        setState(resBody.result);
      } catch (error) {
        console.error("error", (error as unknown as Error).message);
      }
    })();
  }, []);

  const toggleModal = () => {
    setIsModalVisible((prevState) => !prevState);
  };

  // Write a function that validates user input for a MERN stack application and returns an error message if the input is invalid.
  const handleValidation = () => {
    const inputRefKeys = Object.keys(inputRef.current);

    const errMap = new Map();
    inputRefKeys.forEach((key) => {
      if (!inputRef.current[key].value && requiredInputFields.includes(key)) {
        errMap.set(key, "Required");
      }
    });

    const errObj = Object.fromEntries(errMap);
    if (Object.keys(errObj).length) {
      dispatch({
        type: "SET-ERRORS",
        error: errObj,
      });
      return false;
    }

    return true;
  };

  const onHandleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: "CLEAR-ERROR",
      error: { name: e.target.name },
    });
  };

  const handleEdit = () => {
    // inputRef.current.getValues();
    inputRef.current = { name: "hello" };
    console.log("ref values", inputRef.current.getValues());
  };

  const handleSubmit = async () => {
    const isValidated = handleValidation();

    if (!isValidated) return;

    const bodyObj = new Map();

    Object.entries(inputRef.current).forEach((item) => {
      bodyObj.set(item[0], item[1].value);
    });

    const postBody = Object.fromEntries(bodyObj);
    try {
      const response = await fetch("http://localhost/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postBody),
      });

      if (!response.ok) return;
      setState((prevState) => [...prevState, postBody]);
      toggleModal();
    } catch (error) {
      console.error("error", (error as unknown as Error).message);
    }
  };

  return (
    <div>
      <input
        style={{ backgroundColor: "white", marginBottom: "1rem" }}
        onChange={debouncedSearch}
        placeholder="Search by keyword"
      />
      <ListItem
        data={state}
        onToggleModal={toggleModal}
        onHandleEdit={handleEdit}
        ref={inputRef}
      />
      <button onClick={toggleModal} className="modal-btn">
        Add Schedule
      </button>
      <Modal
        isOpen={isModalVisible}
        onClose={toggleModal}
        onHandleSubmit={handleSubmit}
      >
        <form>
          <label>Event Name</label>
          <input
            className={`${errorState.name ? "error-input" : ""}`}
            name="name"
            type="text"
            ref={(el) => (inputRef.current["name"] = el)}
            onFocus={onHandleFocus}
          />
          <p
            style={{ fontSize: "0.8rem", margin: 0 }}
            className={`${errorState.date ? "error" : ""}`}
          >
            {errorState.name}
          </p>

          <label>Date</label>
          <input
            className={`${errorState.date ? "error-input" : ""}`}
            name="date"
            id="date"
            type="datetime-local"
            ref={(el) => (inputRef.current["date"] = el)}
            onFocus={onHandleFocus}
          />
          <p
            style={{ fontSize: "0.8rem", margin: 0 }}
            className={`${errorState.date ? "error" : ""}`}
          >
            {errorState.date}
          </p>

          <label>Description</label>
          <textarea
            className={`${errorState.description ? "error-input" : ""}`}
            name="description"
            id="description"
            rows={6}
            ref={(el) => (inputRef.current["description"] = el)}
            onFocus={onHandleFocus}
          />
          <p
            style={{ fontSize: "0.8rem", margin: 0 }}
            className={`${errorState.description ? "error" : ""}`}
          >
            {errorState.description}
          </p>
        </form>
      </Modal>
    </div>
  );
};

export default App;
