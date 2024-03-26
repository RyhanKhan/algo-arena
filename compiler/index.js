import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const port = 80;

app.use(cors());
app.use(express.json());

const API_URL = "https://glot.io/api/run/python/latest";
const API_TOKEN = "1073bd45-12b4-4ced-84af-b5d26bd497db";

app.post("/python", async (req, res) => {
  try {
    const { pythonCode } = req.body;

    // Prepare the request body for the API
    const requestBody = {
      files: [
        {
          name: "app.py",
          content: pythonCode,
        },
      ],
    };

    // Make the POST request to the API
    const apiResponse = await axios.post(API_URL, requestBody, {
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-type": "application/json",
      },
    });

    // Send the output received from the API as response
    res.json(apiResponse.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`AlgoArena listening on ${port}`);
});
