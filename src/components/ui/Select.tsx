interface SelectProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}

const Select = ({ label, value, onChange, options, error }: SelectProps) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        <option value="">Select State</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <small className="error">{error}</small>}
    </div>
  );
};

export default Select;
