/* eslint-disable no-plusplus */
import type { Dispatch, SetStateAction } from 'react';

const getAllValues = (obj: Record<string, any>): any[] => {
  const values: any[] = [];

  function recurse(current: Record<string, any>): void {
    for (const key of Object.keys(current)) {
      if (typeof current[key] === 'object' && current[key] !== null) {
        // If the value is an object, recurse into it
        recurse(current[key]);
      } else {
        // If it's a value, push it to the values array
        values.push(current[key]);
      }
    }
  }

  recurse(obj);
  return values;
};

const nestedObjectSetter = (
  setState: Dispatch<SetStateAction<any>>,
  keyPath: string,
  newValue: string,
) => {
  const keys = keyPath.split('.'); // Split the key path into an array

  setState((prevState: any) => {
    const updatedState = { ...prevState };
    let current = updatedState;

    // Traverse the object to the second last key
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]!];
    }

    // Update the value at the specified key
    current[keys[keys.length - 1]!] = newValue;

    return updatedState;
  });
};

export { getAllValues, nestedObjectSetter };
