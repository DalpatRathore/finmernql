import DashboardButton from "@/components/DashboardButton";
import SpinnerSvg from "@/components/SpinnerSvg";
import TransactionHistory from "@/components/TransactionHistory";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";

const TransactionsPage = () => {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full px-5">
        <SpinnerSvg></SpinnerSvg>
      </div>
    );
  }

  if (!data.authUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-full h-full  max-w-7xl mx-auto px-1 py-5 md:py-10 space-y-8 flex flex-col items-center justify-center">
      <TransactionHistory></TransactionHistory>
      <DashboardButton></DashboardButton>
    </div>
  );
};

export default TransactionsPage;
