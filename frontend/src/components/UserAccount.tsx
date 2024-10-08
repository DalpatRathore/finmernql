import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  AtSignIcon,
  CircleUserRoundIcon,
  CogIcon,
  LogOutIcon,
  Settings2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type UserAccountProps = {
  authUser: {
    username: string;
    name: string;
    gender: string;
    profilePicture: string;
  };
  handleLogout: () => void;
};
const UserAccount = ({
  authUser: { name, username, profilePicture, gender },
  handleLogout,
}: UserAccountProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar
          className={cn(
            "border p-1  w-12 h-12 cursor-pointer",
            gender === "male" ? "border-indigo-600" : "border-pink-600"
          )}
        >
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate w-full">{name}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuShortcut>
              <CircleUserRoundIcon className="w-4 h-4 ml-2"></CircleUserRoundIcon>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-wrap">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="truncate">{username}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{username}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuShortcut>
              <AtSignIcon className="w-4 h-4 ml-2"></AtSignIcon>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          Support
          <DropdownMenuShortcut>
            <Settings2Icon className="w-4 h-4 ml-2"></Settings2Icon>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Settings
          <DropdownMenuShortcut>
            <CogIcon className="w-4 h-4 ml-2"></CogIcon>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Logout
          <DropdownMenuShortcut>
            <LogOutIcon className="w-4 h-4"></LogOutIcon>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccount;
