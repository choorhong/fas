import "../../App.css";
import RadioInput from "../Input/RadioInput";
import TextInput from "../Input/TextInput";

type TextFieldInputType = {
  type: "text";
  label: string;
  name: string;
};

type RadioFieldInputType = {
  type: "radio";
  label: string;
  name: string;
  options: {
    value: string | number;
    label: string;
  }[];
};
type FormInputType = TextFieldInputType | RadioFieldInputType;
const formInput: FormInputType[] = [
  {
    type: "text",
    label: "Name",
    name: "name",
  },
  {
    type: "text",
    label: "Email",
    name: "email",
  },
  {
    type: "text",
    label: "Phone number",
    name: "phoneNumber",
  },
  {
    type: "radio",
    label: "Gender",
    name: "gender",
    options: [
      { value: "MALE", label: "Male" },
      { value: "FEMALE", label: "Female" },
    ],
  },
];

// Create a React component that is a widget which is like a contact form (Name, Email, Phone)
const Form = () => {
  return (
    <form>
      <div className="grid">
        {formInput.map((item) => {
          switch (item.type) {
            case "text": {
              return (
                <TextInput
                  key={item.name}
                  label={item.label}
                  name={item.name}
                />
              );
            }

            case "radio": {
              return (
                <RadioInput
                  key={item.name}
                  label={item.label}
                  options={item.options}
                  name={item.name}
                />
              );
            }

            default: {
              return null;
            }
          }
        })}
      </div>
    </form>
  );
};

export default Form;
