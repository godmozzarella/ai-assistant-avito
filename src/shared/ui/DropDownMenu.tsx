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

  return (
    <>
      <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        {selected.label}
      </button>

      {isOpen && (
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <button type="button" onClick={() => handleSelect(option)}>
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

