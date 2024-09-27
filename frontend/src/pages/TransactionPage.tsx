import TransactionForm from "@/components/forms/TransactionForm";

const TransactionPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-3">
      <TransactionForm formType="Update"></TransactionForm>
    </div>
  );
};

export default TransactionPage;
