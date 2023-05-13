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

  return (
    <div className="flex flex-row" >
      {Array.from({ length }).map((_, i) => {
        const boxValue = value[i] ?? "";
        console.log('boxValue: ', boxValue)
        return (
          <div key={i} className="flex w-20 h-20 bg-white">
            <input
              className="flex-1 w-20 h-20 text-black text-center"
              type={secretMode ? "password" : "text"}
              maxLength={1}
              value={boxValue}
              onChange={handleInputChange}
              ref={(input) => {
                inputRefs.current[i] = input as HTMLInputElement;
              }}
            />
          </div>
        )
      })}
    </div>
  );
};

export default PinInput;
