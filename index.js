const express= require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const connectDB = require('./db/connect')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require("./routes/posts")
const cors = require("cors")
const path = require("path");
dotenv.config();

// middleware
app.use(
    cors({
        origin: "http://localhost:3000"
    })
)
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)



// app.use(express.static(path.join(__dirname, "/socialgen/build")));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'socialgen', 'build', 'index.html'));
// });


const port = process.env.PORT || 8800

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, console.log(`Server is listening on port ${port}`))
        
    } catch (error) {
        console.log(error)
    }
}

start()