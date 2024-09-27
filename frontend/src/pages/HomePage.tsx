import { AddTransactionForm } from "@/components/forms/AddTransactionForm";
import TransactionHistory from "@/components/TransactionHistory";
// import HeroSection from "../components/HeroSection";

const HomePage = () => {
  return (
    <div className="h-full space-y-10 py-10 md:py-20">
      {/* <HeroSection></HeroSection> */}

      <AddTransactionForm></AddTransactionForm>
      <TransactionHistory></TransactionHistory>
    </div>
  );
};

export default HomePage;
