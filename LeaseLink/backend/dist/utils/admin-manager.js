import User from "../models/NewUser.js";
// middleware to verify admin status
// currently needs: email
export const verifyAdmin = async (req, res, next) => {
    try {
        // get user
        const user = await User.findById(res.locals.jwtData.id);
        console.log(res.locals.jwtData.id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist of token malfunctioned" });
        }
        // user is being used to verify that this is an admin user. only admin users should be allowed to add vendors, normal people should not
        const adminStatus = user.admin;
        console.log(`Account: ${user.email}, Admin: ${user.admin}`);
        if (adminStatus) {
            return next();
        }
        else {
            return res.status(403).json({ message: `Admin status required. "${user.email}" is not an admin account` });
        }
    }
    catch (error) {
        console.error('Error in getUserProperty:', error);
        return { error: error.message };
    }
};
//# sourceMappingURL=admin-manager.js.map