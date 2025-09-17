import styled from "styled-components";

const StyledLabel = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

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
