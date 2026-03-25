import { useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import s from './DropDownMenu.module.scss';

type OptionType = {
  label: string;
  value: string | number;
};

interface DropDownMenuProps<T extends OptionType> {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: T;
  options: T[];
  handleSelect: (option: T) => void;
}

export default function DropDownMenu<T extends OptionType>({
    isOpen,
    setIsOpen,
    selected,
    options,
    handleSelect,
  }: DropDownMenuProps<T>) {
    const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    openTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 0); 
  };

  const handleMouseLeave = () => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }

    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100); 
  };

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);


  return (
    <div
      className={s.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button type="button" className={s.trigger}>
        {selected.label}
        <KeyboardArrowDownIcon />
      </button>

      {isOpen && (
        <ul className={s.menu}>
          {options.map((option) => (
            <li key={option.value} className={s.item}>
              <button
                type="button"
                className={s.option}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}