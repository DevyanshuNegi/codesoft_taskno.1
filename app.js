import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import expressEjsLayouts from "express-ejs-layouts";
// for express layouts

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded // for decoding url
    ({ extended: true }, { limit: "16kb" }) // optional
)
app.use(express.static("public")) // for images and ...

app.use(cookieParser()) // for storing and reading safe cookies


// Use EJS as the view engine
app.set('view engine', 'ejs');

// Other middleware and route handlers...

// import userRouter from "./routes/user.routes.js"

// app.use("/api/v1/users", userRouter)




app.get("/home", (req, res) => {
    // res.send("HEllo world")
    res.render("pages/home.ejs")
})


export default app;
export {app};



