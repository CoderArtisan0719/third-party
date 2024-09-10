type SingleCardProps = {
  id: string;
  content: string;
  choice: string;
  setChoice: any;
  children?: React.ReactNode;
  className?: string;
};

const SingleCard = (props: SingleCardProps) => {
  return (
    <div className="grid">
      <div
        className={`my-2 flex cursor-pointer items-center justify-between rounded-lg border border-primary-deepBlue p-8 text-start hover:bg-gray-300 ${
          props.className && props.className
        }`}
        onClick={() =>
          props.id === 'turnaroundTime'
            ? props.setChoice('turnaroundTime', props.content)
            : props.setChoice(props.content)
        }
      >
        <span className="pr-16 text-xl">{props.content}</span>

        <div className="flex size-8 items-center justify-center rounded-full border-4 border-primary-deepBlue p-1">
          {props.choice === props.content ? (
            <div className="size-4 rounded-full bg-primary-azureBlue"></div>
          ) : null}
        </div>
      </div>

      {props.children}
    </div>
  );
};

export default SingleCard;
