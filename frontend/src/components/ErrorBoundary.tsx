import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { RefreshCcwIcon } from "lucide-react";

const ErrorBoundary = () => {
  return (
    <div className="flex items-center justify-center h-full w-full px-5">
      <Card className="w-full h-72 max-w-2xl flex flex-col items-center justify-center ">
        <CardHeader className="text-center">
          <CardTitle className="capitalize">Something went wrong!</CardTitle>
          <CardDescription>Please try again later!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-3">
            <div className="loader flex items-center justify-center">
              <span className="ball ball1"></span>
              <span className="ball"></span>
              <span className="ball"></span>
              <span className="ball"></span>
              <span className="ball"></span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button
            onClick={() => window.location.reload()}
            variant={"outline"}
            size={"lg"}
          >
            {" "}
            Refresh <RefreshCcwIcon className="w-4 h-4 ml-2" />{" "}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
