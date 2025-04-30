import { User } from "../models/userModel.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json({ data: users, message: "Fetched all users successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// BLOCK a user
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const blockedUser = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

    if (!blockedUser) return res.status(404).json({ message: "User not found" });

    res.json({ data: blockedUser, message: "User blocked" });
  } catch (error) {
    res.status(500).json({ message: "Blocking failed" });
  }
};

// UNBLOCK a user
export const unblockUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const unblockedUser = await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });

    if (!unblockedUser) return res.status(404).json({ message: "User not found" });

    res.json({ data: unblockedUser, message: "User unblocked" });
  } catch (error) {
    res.status(500).json({ message: "Unblocking failed" });
  }
};

// DELETE a user
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
