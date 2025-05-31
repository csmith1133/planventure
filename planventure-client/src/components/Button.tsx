/**
 * Primary button component
 * @param {Object} props - Component props
 * @param {string} props.label - Button text
 * @param {() => void} props.onClick - Click handler
 * @example
 * <Button label="Click me" onClick={() => console.log('clicked')} />
 */
export const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return (
    <button onClick={onClick} className="button">
      {label}
    </button>
  );
};
