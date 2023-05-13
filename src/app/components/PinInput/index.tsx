"use client"

import { useState, useRef, useEffect } from "react";

interface PinInputProps {
  length?: number; // allows changing the number of input boxes
  secretMode?: boolean; // allows turning on/off secret mode
  regex?: RegExp; // allows passing a regex for box input validation
  defaultValue?: string; // allows setting a default value
  onChange?: (value: string) => void; // invokes a method after each box is filled
  onComplete?: (value: string) => void; // invokes a method after all boxes are filled
}

const PinInput = ({
  length = 5,
  secretMode = false,
  regex = /^\d$/,
  defaultValue = "",
  onChange,
  onComplete,
}: PinInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    console.log('value: ', value)
  }, [value])

  useEffect(() => {
    inputRefs.current[0]?.focus(); // autofocus on first box
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const inputIndex = inputRefs.current.indexOf(event.target);

    if (!regex.test(inputValue)) {
      return;
    }

    const newValue = value.slice(0, inputIndex) + inputValue + value.slice(inputIndex + 1);
    setValue(newValue);

    if (inputIndex < length - 1 && inputValue !== "") {
      inputRefs.current[inputIndex + 1].focus(); // move focus to next box
    }

    if (onChange) {
      onChange(newValue);
    }

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };


  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputIndex = inputRefs.current.indexOf(event.target as HTMLInputElement);

    if (event.key === "Backspace" && inputIndex > 0) {
      event.preventDefault();
      const prevInput = inputRefs.current[inputIndex - 1];

      if (!prevInput.value) {
        prevInput.focus();
      } else {
        const currInput = inputRefs.current[inputIndex];
        const prevValue = prevInput.value;
        prevInput.value = "";
        prevInput.focus();
        currInput.value = prevValue;
        setValue(
          value.slice(0, inputIndex - 1) + prevValue + value.slice(inputIndex, value.length - 1)
        );
      }
    }
  };

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const inputIndex = inputRefs.current.indexOf(event.target as HTMLInputElement);
    inputRefs.current[inputIndex].focus();
  };

  return (
    <div className="flex flex-col p-20 bg-white" >
      <div className="flex flex-row space-x-4" >
      {Array.from({ length }).map((_, i) => {
        const boxValue = value[i] ?? "";
        return (
          <div key={i} className="flex w-20 h-20 bg-white">
            <input
              className="w-20 h-20 text-black text-center border border-black"
              type={secretMode ? "password" : "text"}
              maxLength={1}
              value={boxValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onClick={handleInputClick}
              ref={(input) => {
                inputRefs.current[i] = input as HTMLInputElement;
              }}
            />
          </div>
        )
      })}
    </div>
    </div>
  );
};

export default PinInput;
