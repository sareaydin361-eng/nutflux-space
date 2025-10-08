// file: /pages/api/get-order/[orderId].js
import { connectDB } from "../../../lib/db";// your MongoDB connection helper
import Order from "../../../models/order"; // your Mongoose model
import crypto from "crypto";

export default async function handler(req, res) {
  const { orderId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB(); // ensure DB connection

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Hash the fields using SHA256
    const hash = (str) =>
        crypto.createHash("sha256").update(str).digest("hex");
  
      res.status(200).json({
        orderId: order.orderId,
        amount: order.amount,
        hashedName: hash(order.name.trim().toLowerCase()),
        hashedEmail: hash(order.email.trim().toLowerCase()),
        hashedPhone: hash(order.phone.replace(/\D/g, "")),
        hashedAddress: hash(order.address.trim()),
        orderItems: order.orderItems,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
    });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
