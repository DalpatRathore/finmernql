import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const DashboardButton = () => {
  return (
    <div className="mt-10 flex items-center justify-center">
      <Button variant={"outline"} className="">
        <Link to={"/"}>Back to Dashboard</Link>
      </Button>
    </div>
  );
};

export default DashboardButton;
