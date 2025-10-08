// file: /pages/api/get-order/[orderId].js
import { connectDB } from "../../lib/db";// your MongoDB connection helper
import Order from "@/models/Order"; // your Mongoose model
import CryptoJS from "crypto-js";

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
    const hashedName = CryptoJS.SHA256(order.name.trim().toLowerCase()).toString(CryptoJS.enc.Hex);
    const hashedEmail = CryptoJS.SHA256(order.email.trim().toLowerCase()).toString(CryptoJS.enc.Hex);
    const hashedPhone = CryptoJS.SHA256(order.phone.replace(/\D/g, "")).toString(CryptoJS.enc.Hex);
    const hashedAddress = CryptoJS.SHA256(order.address.trim()).toString(CryptoJS.enc.Hex);

    res.status(200).json({
      orderId: order.orderId,
      amount: order.amount,
      hashedName,
      hashedEmail,
      hashedPhone,
      hashedAddress,
      orderItems: order.orderItems,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    });
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
