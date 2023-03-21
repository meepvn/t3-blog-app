import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

type Props = {
  warningText: string;
  callback: () => void;
  cancel: () => void;
};

export default function WarningModal({ cancel, callback, warningText }: Props) {
  return (
    <div className="absolute z-10 flex h-full w-full items-center justify-center bg-gray-400 bg-opacity-30">
      <div className="relative flex h-1/5 w-1/5 flex-col items-center justify-center rounded-xl border border-black bg-white text-black">
        <span className="text-3xl uppercase text-red-400">Warning</span>
        <span className="absolute top-5 right-5 cursor-pointer">
          <FontAwesomeIcon
            icon={faClose}
            className="text-gray-400"
            onClick={() => void cancel()}
          />
        </span>
        <p className="text-xl">{warningText}</p>
        <div className="flex w-full justify-around text-white">
          <button
            className="px- rounded-md border border-green-400 bg-green-400 px-10 py-3"
            onClick={() => void callback()}
          >
            Yes
          </button>
          <button
            className="rounded-md border border-red-500 bg-red-500 py-3 lg:px-10"
            onClick={() => void cancel()}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
