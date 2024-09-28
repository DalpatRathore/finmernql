import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Loader2, LogOut, SquareArrowOutUpRight } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import ThemeToggle from "./ThemeToggle";
import toast from "react-hot-toast";
import { LOGOUT } from "@/graphql/mutations/user.mutation";
import UserAccount from "./UserAccount";

const Header = () => {
  const { data } = useQuery(GET_AUTHENTICATED_USER);

  const [logout, { loading }] = useMutation(LOGOUT, {
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
                <UserAccount authUser={data.authUser}></UserAccount>
                <Button
                  variant={"outline"}
                  onClick={handleLogout}
                  title="logout"
                  size={"icon"}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin"></Loader2>
                  ) : (
                    <LogOut className="w-4 h-4"></LogOut>
                  )}
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
