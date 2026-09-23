import express from "express";
import { SenderController } from "../controller/sender.controller.js";
const senderRoute = express.Router();
senderRoute.post("/sender-details", SenderController);
export default senderRoute;
