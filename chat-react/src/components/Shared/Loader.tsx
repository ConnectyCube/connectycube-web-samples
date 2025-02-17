import { cn } from "@/lib/utils";
import { FaSpinner } from "react-icons/fa";

export interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <FaSpinner
      className={cn(
        "animate-spin text-2xl text-black mx-auto",
        className || ""
      )}
    />
  );
};

export default Loader;
