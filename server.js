import app from "./src/app";
import connectDB from "./src/config/db";


const PORT = process.env.PORT || 8000;
app.listen(PORT , ()=> {
    console.log(`server is running on ${PORT}`)
});
