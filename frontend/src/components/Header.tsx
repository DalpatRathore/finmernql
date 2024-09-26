import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="w-full flex gap-4 items-center justify-between">
          <Link to={"/"} className="flex items-center justify-center gap-2">
            <img src="/logo.svg" className="w-10 h-10" />
            <h1 className="text-2xl font-bold sm:text-3xl">MERN GQL</h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link to={"/login"}>
              <Button size={"lg"}>
                Login
                <SquareArrowOutUpRight className="w-4 h-4 ml-2"></SquareArrowOutUpRight>
              </Button>
            </Link>

            <Button type="button" variant={"outline"} size={"lg"}>
              Create Post
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
