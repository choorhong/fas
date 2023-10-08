import "../../App.css";

type TextInputProps = {
  children?: React.ReactNode;
  label: string;
  disabled?: boolean;
  name: string;
};

const TextInput = (props: TextInputProps) => {
  const { label, disabled = false, name } = props;
  return (
    <div>
      <label>{label}</label>
      <input name={name} disabled={disabled} />
    </div>
  );
};

export default TextInput;
