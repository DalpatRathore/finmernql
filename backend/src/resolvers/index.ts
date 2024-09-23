import { mergeResolvers } from "@graphql-tools/merge";
import userResovler from "./user.resolver";
import transactionsResolver from "./transaction.resolver";

 const mergedResolvers = mergeResolvers([userResovler,transactionsResolver]);

 export default mergedResolvers