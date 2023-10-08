import "../../App.css";

type TextInputProps = {
  children?: React.ReactNode;
  label: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Record<string, any>[];
  name: string;
};

const RadioInput = (props: TextInputProps) => {
  const { label, disabled = false, options, name } = props;

  return (
    <div>
      <label>{label}</label>
      {options.map((item) => (
        <div key={item.value}>
          <input
            type="radio"
            name={name}
            disabled={disabled}
            value={item.value}
          />
          <p className="radio-label">{item.label}</p>
        </div>
      ))}
    </div>
  );
};

export default RadioInput;
