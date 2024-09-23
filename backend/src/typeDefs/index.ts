import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDefs";
import transactiontypeDef from "./transaction.typeDef";

const mergedTypeDefs = mergeTypeDefs([
    userTypeDef, transactiontypeDef
])

export default mergedTypeDefs