// import { mergeResolvers } from "@graphql-tools/merge";
// import userResovler from "./user.resolver";
// import transactionsResolver from "./transaction.resolver";

//  const mergedResolvers = mergeResolvers([userResovler,transactionsResolver]);

//  export default mergedResolvers

import { IResolvers } from '@graphql-tools/utils'; // or from 'apollo-server-express'
import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver";
import transactionsResolver from "./transaction.resolver";


// Typing the merged resolvers with the custom context
const mergedResolvers: IResolvers<any> = mergeResolvers([
  userResolver,
  transactionsResolver,
]);

export default mergedResolvers;
