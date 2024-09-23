import { ApolloServer } from "@apollo/server";

import {startStandaloneServer} from '@apollo/server/standalone'
import mergedTypeDefs from "./typeDefs";
import mergedResolvers from "./resolvers";


// Define your context type
interface MyContext {
    // Add any properties you need in your context
    user?: { id: string; name: string }; // Example property
}
const server = new ApolloServer<MyContext>({
    typeDefs:mergedTypeDefs,
    resolvers:mergedResolvers
});

const startServer = async ()=>{

    const {url} = await startStandaloneServer(server);
    console.log(`✅ Server ready at ${url}`)
}

startServer()


