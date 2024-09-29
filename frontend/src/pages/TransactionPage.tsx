import TransactionForm from "@/components/forms/TransactionForm";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import DashboardButton from "@/components/DashboardButton";

const TransactionPage = () => {
  const { transactionId } = useParams(); // Extract transactionId from the URL
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) {
    return <Loader />;
  }

  if (!data.authUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="w-full h-full max-w-7xl mx-auto py-5 flex flex-col-reverse lg:flex-row items-center justify-center">
      <div className="w-full">
        <div className="md:h-[400px] p-2 hidden lg:block">
          <img
            src="/management-img.webp"
            className="w-full h-full object-contain rounded-lg"
            alt=""
          />
        </div>
        <DashboardButton></DashboardButton>
      </div>
      <div className="w-full">
        <TransactionForm
          formType="Update"
          transactionId={transactionId}
        ></TransactionForm>
      </div>
    </div>
  );
};

export default TransactionPage;

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full px-5 py-10">
      <Card className="w-full max-w-xl h-full grid grid-rows-[auto_1fr_auto]">
        <CardHeader className="flex items-start mb-8">
          <Skeleton className="h-6 w-40 rounded-lg" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="w-full flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
        <CardFooter>
          <Button disabled className="w-full bg-muted">
            Update Transaction
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
