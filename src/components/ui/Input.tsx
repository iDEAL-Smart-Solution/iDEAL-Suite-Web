interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const Input = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: InputProps) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <small className="error">{error}</small>}
    </div>
  );
};

export default Input;
