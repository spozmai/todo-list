function TextInputWithLabel({ elementId, label, value, onChange }) {
  return (
    <>
      <label htmlFor={elementId}>{label}</label>
      <input
        type="text"
        id={elementId}
        value={value}
        onChange={onChange}
      />
    </>
  );
}

export default TextInputWithLabel;
