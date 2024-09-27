import ChartCard from "@/components/ChartCard";
import { AddTransactionForm } from "@/components/forms/AddTransactionForm";
import TransactionHistory from "@/components/TransactionHistory";
// import HeroSection from "../components/HeroSection";

const HomePage = () => {
  return (
    <div className="h-full space-y-10 px-5 py-5 md:py-10 max-w-7xl mx-auto">
      {/* <HeroSection></HeroSection> */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-5">
        <div className="w-full">
          <ChartCard></ChartCard>
        </div>
        <div className="w-full">
          <AddTransactionForm></AddTransactionForm>
        </div>
      </div>

      <TransactionHistory></TransactionHistory>
    </div>
  );
};

export default HomePage;
