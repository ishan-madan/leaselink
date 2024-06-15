import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";
// connections and listeners
const PORT = process.env.PORT || 5100;
connectToDatabase().then(() => {
    app.listen(PORT, () => console.log("Server Open and connected to DB"));
}).catch((err) => console.log(err));
//# sourceMappingURL=index.js.map