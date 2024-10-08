import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LayoutDashboardIcon } from "lucide-react";

const DashboardButton = () => {
  return (
    <div className="mt-10 flex items-center justify-center">
      <Button variant={"outline"} asChild>
        <Link to={"/"}>
          Back to Dashboard
          <LayoutDashboardIcon className="w-4 h-4 ml-2 animate-pulse"></LayoutDashboardIcon>
        </Link>
      </Button>
    </div>
  );
};

export default DashboardButton;
