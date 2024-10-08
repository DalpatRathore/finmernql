import Transaction, { TransactionsDocument } from "../models/transaction.model";

// Types based on GraphQL inputs
interface CreateTransactionInput {
    description: string;
    paymentType: string;
    category: "saving" | "expense" | "investment"; 
    amount: number;
    date: string;
    location?: string; // optional
  }
  
  interface UpdateTransactionInput {
    transactionId: string;
    description?: string;
    paymentType?: string;
    category?: string;
    amount?: number;
    location?: string;
    date?: string;
  }
  
  // Mutation arguments
  interface CreateTransactionArgs {
    input: CreateTransactionInput;
  }
  
  interface UpdateTransactionArgs {
    input: UpdateTransactionInput;
  }
  
  interface DeleteTransactionArgs {
    transactionId: string;
  }
  
  // Context type (this should match the one you already use)
  interface IGraphQLContext {
    req: Request;
    res: Response;
    transactions: (user: TransactionsDocument) => Promise<void>;
    getUser: () => Promise<TransactionsDocument | null>;
  }

const transactionsResolver={
    Query:{

        transactions: async(_:unknown, __:unknown, context:IGraphQLContext)=>{
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const user = await context.getUser();
                if (!user) throw new Error("Unauthorized");
                const userId = user._id; 
                // Fetch transactions sorted by 'updatedAt' in descending order (latest first)
                const transactions = await Transaction.find({ userId })
                .lean()
                .sort({ updatedAt: -1 }); // Sort by updatedAt in descending order

                return transactions;
                
            } catch (error: any) {
                console.log("Error in fetching transactions", error);
                throw new Error(error.message || "Internal server error");
              }
        },
        transaction: async (_: unknown, { transactionId }: { transactionId: string }): Promise<TransactionsDocument | null> => {
            try {
                // const transaction = await Transaction.findById(transactionId).lean(); // Use lean() here
                // return transaction as TransactionsDocument | null;
                const transaction = await Transaction.findById(transactionId) as TransactionsDocument | null; // Explicit casting
                return transaction;
            } catch (error: any) {
              console.log("Error in fetching transaction", error);
              throw new Error(error.message || "Internal server error");
            }
          },
        categoryStatistics: async(_:unknown, __:unknown, context:IGraphQLContext) =>{

          const user = await context.getUser();
          if (!user) throw new Error("Unauthorized");
          const userId = user._id; 
          const transactions = await Transaction.find({ userId}).lean();
          const totalByCategory: { [key: string]: number } = {};
          
          transactions.forEach((transaction) => {
            if (!totalByCategory[transaction.category]) {
                totalByCategory[transaction.category] = 0; // Initialize if not present
            }
            totalByCategory[transaction.category] += transaction.amount; // Add amount to category total
        });

        const result = Object.entries(totalByCategory).map(([category, total]) => ({
            category,
            totalAmount: total,
        }));

        return result;
          
        }
        },
   Mutation: {
    createTransaction: async (
      _: unknown,
      args: CreateTransactionArgs,
      context: IGraphQLContext
    ): Promise<TransactionsDocument> => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const { input } = args;
        const newTransaction = new Transaction({
          userId: user._id,
          ...input, // spread the input fields directly
        });

        const savedTransaction = await newTransaction.save();
        return savedTransaction;
      } catch (error: any) {
        console.log("Error in creating transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    updateTransaction: async (
      _: unknown,
      args: UpdateTransactionArgs,
      context: IGraphQLContext
    ): Promise<TransactionsDocument | null> => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const { input } = args;
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          input.transactionId,
          { ...input },
          { new: true } // return the updated document
        );

        return updatedTransaction;
      } catch (error: any) {
        console.log("Error in updating transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },

    deleteTransaction: async (
      _: unknown,
      args: DeleteTransactionArgs,
      context: IGraphQLContext
    ): Promise<TransactionsDocument | null> => {
      try {
        const user = await context.getUser();
        if (!user) throw new Error("Unauthorized");

        const deletedTransaction = await Transaction.findByIdAndDelete(
          args.transactionId
        );

        return deletedTransaction;
      } catch (error: any) {
        console.log("Error in deleting transaction", error);
        throw new Error(error.message || "Internal server error");
      }
    },
  },
}

export default transactionsResolver