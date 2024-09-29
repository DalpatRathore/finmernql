import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full px-5">
      <Loader2 className="animate-spin"></Loader2>
    </div>
  );
};

export default Loader;
