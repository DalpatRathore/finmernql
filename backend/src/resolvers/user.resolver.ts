import { users } from "../constants/dummy-data"
interface MyContext {
    // Add any properties you need in your context
    user?: { id: string; name: string }; // Example property
}
const userResovler ={
    Query: {
        users: (_: unknown, __: unknown, context: MyContext) => {
            // Here, you can access context.user if needed
            return users;
        },
    },
    Mutation:{
        
    }
}

export default userResovler