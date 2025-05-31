interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Button = ({ label, variant = 'primary', onClick }: ButtonProps) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
