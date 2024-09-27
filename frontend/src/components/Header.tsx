import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { LogOut, SquareArrowOutUpRight, User2 } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import { LOGOUT } from "@/graphql/mutations/user.mutation";

const Header = () => {
  const { data } = useQuery(GET_AUTHENTICATED_USER);

  const [logout] = useMutation(LOGOUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successfully");
    } catch (error) {
      console.log(error);
      console.log("Something went wrong!");
    }
  };

  return (
    <header className="border-b border-gray-200">
      <div className="mx-auto max-w-screen-xl px-4 py-8">
        <div className="w-full flex gap-4 items-center justify-between">
          <Link to={"/"} className="flex items-center justify-center gap-2">
            <img src="/logo.svg" className="w-10 h-10" />
            <h1 className="text-2xl font-bold sm:text-3xl">MERN GQL</h1>
          </Link>

          <div className="flex items-center gap-4">
            {data?.authUser ? (
              <>
                <User2></User2>
                <Button variant={"outline"} onClick={handleLogout}>
                  <LogOut></LogOut>
                </Button>
              </>
            ) : (
              <>
                <Link to={"/login"}>
                  <Button size={"lg"} variant={"outline"}>
                    Login
                    <SquareArrowOutUpRight className="w-4 h-4 ml-2"></SquareArrowOutUpRight>
                  </Button>
                </Link>
              </>
            )}
            <ThemeToggle></ThemeToggle>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
