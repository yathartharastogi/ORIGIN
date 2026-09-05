import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";

const startServer = async () => {
  await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
};

startServer();