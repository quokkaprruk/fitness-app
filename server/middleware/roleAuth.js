const jwt = require("jsonwebtoken");
const logger = require("./logger");

// Middleware to check if user is a trainer
const checkTrainerRole = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.debug("No token provided in trainer role check");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug(
      `Token verification attempt for trainer check. User role: ${decoded.role}`,
    );

    if (decoded.role !== "trainer" && decoded.role !== "admin") {
      logger.debug(
        `Access denied: User with role ${decoded.role} attempted to access trainer route`,
      );
      return res
        .status(403)
        .json({ message: "Access denied. Trainer role required." });
    }
    req.user = decoded;
    logger.debug("Trainer role verification successful");
    next();
  } catch (error) {
    logger.debug(
      `Token verification failed in trainer check: ${error.message}`,
    );
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user is an admin
const checkAdminRole = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.debug("No token provided in admin role check");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug(
      `Token verification attempt for admin check. User role: ${decoded.role}`,
    );

    if (decoded.role !== "admin") {
      logger.debug(
        `Access denied: User with role ${decoded.role} attempted to access admin route`,
      );
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }
    req.user = decoded;
    logger.debug("Admin role verification successful");
    next();
  } catch (error) {
    logger.debug(`Token verification failed in admin check: ${error.message}`);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if user owns the resource
const checkUserOwnership = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    logger.debug("No token provided in ownership check");
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    logger.debug(
      `Ownership verification attempt - User profileId: ${decoded.profileId}`,
    );

    if (req.params.profileId) {
      logger.debug(
        `Comparing request profileId: ${req.params.profileId} with token profileId: ${decoded.profileId}`,
      );

      if (req.params.profileId !== decoded.profileId) {
        logger.debug("Profile ID mismatch in ownership check");
        return res.status(403).json({
          message: "Access denied. You can only access your own data.",
        });
      }
    }

    req.user = decoded;
    logger.debug("Ownership verification successful");
    next();
  } catch (error) {
    logger.debug(
      `Token verification failed in ownership check: ${error.message}`,
    );
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { checkAdminRole, checkTrainerRole, checkUserOwnership };
