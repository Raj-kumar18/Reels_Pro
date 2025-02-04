import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!; //mongodb connection string comming from .env

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local" //if not defined throw error
    );
}
let cached = global.mongoose; //check if mongoose is already initialized

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }; //if not initialized, initialize it
}

//export function to connect to database
export async function connectToDatabase() {
    if (cached.conn) { //if already connected, return connection
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, //Agar application me startup ke time pe queries fail hone ki possibility zyada hai aur aap isko avoid karna chahte hain, to bufferCommands: true rakhna better rahega. 🚀
            maxPoolSize: 10 //connection pool size
        }


        cached.promise = mongoose //if not connected, connect to database
            .connect(MONGODB_URI, opts) //connect to database
            .then(() => mongoose.connection) //return connection

    }
    //catch error
    try {
        cached.conn = await cached.promise; //if connected, return connection
    } catch (error) {
        cached.promise = null; //if error, set promise to null
        throw error //throw error
    }

    return cached.conn //return connection
}