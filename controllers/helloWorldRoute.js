const tryCatch = require("../middleware/tryCatch");

/** get all billing list   ⩢ */
exports.helloWorld = tryCatch(async (req, res, next) => {
  res.status(200).json({ success: true, message: "hello bangladesh" });
});
