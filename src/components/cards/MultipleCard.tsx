import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

type MultipleCardProps = {
  content: string;
  choices: string[];
  setChoices: Dispatch<SetStateAction<string[]>>;
  children?: React.ReactNode;
};

const MultipleCard = (props: MultipleCardProps) => {
  const handleClick = () => {
    // Function to update choices
    props.setChoices((prevChoices) => {
      if (prevChoices.includes(props.content)) {
        // Remove choice if it already exists
        return prevChoices.filter((choice) => choice !== props.content);
      }
      // Add choice if it doesn't exist
      return [...prevChoices, props.content];
    });
  };

  return (
    <div className="grid">
      <div
        className="my-2 flex cursor-pointer items-center justify-between rounded-lg border border-primary-deepBlue p-8 text-start hover:bg-gray-300"
        onClick={handleClick}
      >
        <span className="pr-16 text-xl">{props.content}</span>

        <div className="flex size-8 items-center justify-center border-4 border-primary-deepBlue p-1">
          {props.choices.includes(props.content) && (
            <div className="size-4 bg-primary-azureBlue"></div>
          )}
        </div>
      </div>

      {props.children}
    </div>
  );
};

export default MultipleCard;
