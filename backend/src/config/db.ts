import mongoose from "mongoose";

export const connectDB = async(): Promise<void>=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`✅ Database connected successfully`);
        
    } catch (error) {
        console.error("❌ Error connecting to the database:", error);
        if (error instanceof Error) {
            console.error(`Detailed error: ${error.message}`);
          }
        process.exit(1)
        
    }
}






