import axios from "axios";

// address to call the Image Generation AI API
// NEEDS TO BE CHANGED TO THE REAL ONE
const api = axios.create({
  baseURL: "https://api.openai.com/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  },
});

export async function generateImage(prompt, amount) {
  try {
    // test case must be removed
    return [
      "https://cdn.pixabay.com/photo/2024/10/08/22/46/fox-9106452_960_720.jpg",
      "https://cdn.pixabay.com/photo/2025/06/08/16/06/horse-9648183_960_720.jpg",
    ];

    const res = await api.post("images/generations", {
      prompt,
      amount,
    });
    return res.data;
  } catch (error) {
    console.error("AI API Error:", error.message);
    throw new Error("Failed to generate images");
  }
}
