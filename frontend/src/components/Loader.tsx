import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full px-5">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex items-center">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
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

export default Loader;
