import express from "express";
import {
  getStageEmail,
  postStageAddress,
  postStageEmail,
  postStagePayment,
} from "../controllers/BlinkController.js";

const router = express.Router();

router.get(
  "/newOrder/:merchantUserName/:productUUID/stageEmail",
  getStageEmail
);
router.post("/newOrder/stageEmail", postStageEmail);
router.post("/newOrder/stageAddress", postStageAddress);
router.post("/newOrder/stagePayment", postStagePayment);

export default router;
