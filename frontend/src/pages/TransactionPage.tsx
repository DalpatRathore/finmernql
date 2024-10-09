import TransactionForm from "@/components/forms/TransactionForm";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Navigate, useParams } from "react-router-dom";
import DashboardButton from "@/components/DashboardButton";
import SpinnerSvg from "@/components/SpinnerSvg";

const TransactionPage = () => {
  const { transactionId } = useParams(); // Extract transactionId from the URL
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
    <div className="w-full h-full px-5 py-5 md:py-10 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-center">
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
