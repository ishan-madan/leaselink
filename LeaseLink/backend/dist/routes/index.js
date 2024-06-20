import { Router } from "express";
import userRoutes from "./user-routes.js";
import chatRoutes from "./chat-routes.js";
import propertyRoutes from "./property-routes.js";
import vendorRoutes from "./vendor-routes.js";
import incidentRoutes from "./incident-routes.js";
const appRouter = Router();
appRouter.use("/user", userRoutes); //domain/api/v1/user
appRouter.use("/chat", chatRoutes); //domain/api/v1/chat
appRouter.use("/property", propertyRoutes); //domain/api/v1/property
appRouter.use("/vendor", vendorRoutes); //domain/api/v1/vendor
appRouter.use("/incident", incidentRoutes); //domain/api/v1/incident
export default appRouter;
//# sourceMappingURL=index.js.map