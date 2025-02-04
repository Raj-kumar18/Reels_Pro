import { Connection } from "mongoose"
declare global { // This is a module augmentation
    var mongoose: { // mongoose is a global variable
        conn: Connection | null // mongoose connection
        promise: Promise<Connection> | null // mongoose connection promise
}
}

export {};