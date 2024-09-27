import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

const ErrorBoundary = () => {
  return (
    <div className="flex items-center justify-center h-full w-full px-5">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center">
          <CardTitle>Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
