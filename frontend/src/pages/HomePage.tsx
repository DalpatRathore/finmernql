import ChartCard from "@/components/ChartCard";
import { AddTransactionForm } from "@/components/forms/AddTransactionForm";
import { TextCard } from "@/components/TextCard";
import TransactionHistory from "@/components/TransactionHistory";
// import HeroSection from "../components/HeroSection";

const HomePage = () => {
  return (
    <div className="h-full space-y-10 px-5 py-5 md:py-10 max-w-7xl mx-auto">
      {/* <HeroSection></HeroSection> */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-5">
        <div className="w-full space-y-5">
          <TextCard></TextCard>
          <ChartCard></ChartCard>
        </div>
        <div className="w-full h-full">
          <AddTransactionForm></AddTransactionForm>
        </div>
      </div>

      <TransactionHistory></TransactionHistory>
    </div>
  );
};

export default HomePage;
