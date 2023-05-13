"use client"

import { useState, useRef, useEffect } from "react";

interface PinInputProps {
  length?: number; // allows changing the number of input boxes
  secretMode?: boolean; // allows turning on/off secret mode
  regex?: string; // allows passing a regex for box input validation
  defaultValue?: string; // allows setting a default value
  onChange?: (value: string) => void; // invokes a method after each box is filled
  onComplete?: (value: string) => void; // invokes a method after all boxes are filled
}

const PinInput = ({
  length = 5,
  secretMode = false,
  regex = '^[0-9]*$',
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

    console.log('inputValue: ' + inputValue)

    if (!inputValue.match(new RegExp(regex))) {
      console.log('Not match regex!')
      return;
    }

    const newValue = value.slice(0, inputIndex) + inputValue + value.slice(inputIndex + 1);
    console.log('value.slice(0, inputIndex): ' + value.slice(0, inputIndex))
    console.log('inputValue: ' + inputValue)
    console.log('value.slice(inputIndex + 1): ' + value.slice(inputIndex + 1))
    console.log('handleInputChange newValue: ' + newValue)

    setValue(newValue);

    if (inputIndex < length - 1 && inputValue !== "") {
      inputRefs.current[inputIndex + 1].focus();
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

    // console.log('handleInputKeyDown inputIndex = ', inputIndex)

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
        const newValue = value.slice(0, inputIndex - 1) + prevValue + value.slice(inputIndex, value.length - 1)
        // console.log('handleInputKeyDown newValue: ', newValue)
        setValue(newValue);
      }
    } else {
      // setValue(event.currentTarget.value)
    }
  };

  const onBoxFocus = () => {
    inputRefs.current[value.length].focus()
  }

  return (
    <div className="flex flex-col p-20 bg-white" onClick={onBoxFocus}>
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
              onClick={onBoxFocus}
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
