import { useState, useEffect, useRef } from "react";
import { VscChevronDown } from "react-icons/vsc";

export interface DropdownOptions {
  /** value/id/key of an option, should be unique */
  value: string;
  /** display text of an option */
  label?: string;
}
export interface DropdownProps {
  /** options to display in the dropdown */
  options?: DropdownOptions[];
  /** currently selected value (.value of an option entry) */
  value?: string;
  /** called when the selected value changes, given the value of the newly selected item */
  onSelect?: (value: string) => void;
  /** width of the dropdown. default 240px */
  width?: number;
}

export default function Dropdown({ options, value, onSelect, width = 240 }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [divBox, setDivBox] = useState<DOMRect | undefined>(undefined);
  const thisRef = useRef<HTMLDivElement>(null);

  // add document listener to close box if click outside of it
  useEffect(() => {
    if (isOpen) {
      const closeListener = (ev: MouseEvent) => {
        if (!(thisRef.current && thisRef.current.contains(ev.target as Element))) {
          setIsOpen(false);
        }
      };
      document.addEventListener("click", closeListener);
      return () => {
        document.removeEventListener("click", closeListener);
      };
    }
  }, [isOpen]);

  if (!options || options.length < 1) {
    return null;
  }
  let currentText = "";
  const currentOption = options.find((option) => option.value === value);
  if (currentOption) {
    currentText = currentOption.label || currentOption.value;
  }

  const toggleOpen = () => {
    const next = !isOpen;
    if (thisRef.current) {
      setDivBox(thisRef.current.getBoundingClientRect());
    }
    setIsOpen(next);
  };

  return (
    <div
      ref={thisRef}
      role="listbox"
      tabIndex={0}
      className="relative cursor-pointer border border-gray-300 bg-white px-4 pb-1 pt-2 text-black dark:border-gray-600 dark:bg-slate-700 dark:text-neutral-50"
      style={{ width: width }}
      onClick={toggleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleOpen();
        }
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <div>{currentText}</div>
        <VscChevronDown />
      </div>
      {isOpen && (
        <div
          className={`${
            divBox ? "fixed" : "absolute"
          } fixed z-50 bg-white shadow-lg dark:bg-slate-700`}
          style={{
            top: divBox ? divBox.y + divBox.height : "2.25rem",
            left: divBox ? divBox.x : 0,
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              tabIndex={0}
              role="option"
              aria-selected={option.value === value}
              className={`z-50 cursor-pointer border border-gray-300 px-4 pb-1 pt-2 hover:bg-slate-200 dark:border-gray-600 dark:hover:bg-slate-900 ${
                option.value === value ? "bg-slate-200 dark:bg-slate-900" : ""
              }`}
              style={{ width: width }}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                if (typeof onSelect === "function") {
                  onSelect(option.value);
                }
                setIsOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (typeof onSelect === "function") {
                    onSelect(option.value);
                  }
                  setIsOpen(false);
                }
              }}
            >
              {option.label || option.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
