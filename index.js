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
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages")
const multer = require("multer")
const cors = require("cors")
const path = require("path");
const { cloudinary } = require('./cloudinary/cloudinary');
dotenv.config();

// app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(
    cors({
        origin: "http://localhost:3000"
    })
)
app.use(express.json({ limit: '50mb' }));
app.use(helmet())
app.use(morgan("common"))
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/images");
//     },
//     filename: (req, file, cb) => {
//         cb(null, req.body.name);
//     },
// });

// const upload = multer({storage});
// app.post("/api/upload", upload.single("file"), (req, res) => {
//     try {
//         return res.status(200).json("File uploaded successfully");
//     } catch (err) {
//         console.log(err)
//     }
// })

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)


app.use(express.static(path.join(__dirname, "/socialgen/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'socialgen', 'build', 'index.html'));
});


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