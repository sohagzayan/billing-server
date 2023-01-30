const express = require("express");
const {
  getBillingList,
  addBilling,
  updateBilling,
  deleteBilling,
  billingDetails,
} = require("../controllers/billingController");
const { isAuthenticatedUser } = require("../middleware/authenticatedUser");

const router = express.Router();

router.route("/billing-list").get(isAuthenticatedUser, getBillingList);
router.route("/billing-details/:id").get(billingDetails);
router.route("/add-billing").post(isAuthenticatedUser, addBilling);
router.route("/update-billing/:id").put(updateBilling);
router.route("/delete-billing/:id").delete(isAuthenticatedUser, deleteBilling);

module.exports = router;
