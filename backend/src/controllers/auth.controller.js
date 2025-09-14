import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const userData = JSON.parse(fs.readFileSync("./user.json", "utf-8"));
console.log(userData);
console.log(ACCESS_TOKEN_SECRET);
export async function login(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({ message: "Missing username or password" });
  }
  const { username, password } = req.body;
  try {
    if (username !== userData.username) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const valid = await bcrypt.compare(password, userData.hashedPassword);
    if (!valid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
      res.cookie("token", token, {
    httpOnly: true,
    secure: false, // Set to true in production (HTTPS)
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
    res.json({
      message: "you are successfully logged in, "
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
    });
    res.json({ message: "you are successfully logged out" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUser(req, res) {
 try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message});
  }
}