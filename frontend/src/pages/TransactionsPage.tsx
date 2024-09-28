import Loader from "@/components/Loader";
import TransactionHistory from "@/components/TransactionHistory";
import { Button } from "@/components/ui/button";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Link, Navigate } from "react-router-dom";

const TransactionsPage = () => {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) {
    return <Loader />;
  }

  if (!data.authUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-full h-full max-w-7xl mx-auto py-3 space-y-8 flex flex-col items-center justify-center">
      <TransactionHistory></TransactionHistory>
      <div className="flex items-center justify-center">
        <Button size={"lg"} variant={"outline"}>
          <Link to={"/"}>Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default TransactionsPage;
