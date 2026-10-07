const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());


// Test API
app.get("/", (req, res) => {
    res.json({
        message: "Anonymous Feedback Box API is running"
    });
});


// Get feedback
app.get("/api/feedback", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {

            return res.status(500).json({
                error: error.message
            });

        }

        res.json(data);

    } catch (error) {

        res.status(500).json({
            error: "Server error"
        });

    }

});


// Submit anonymous feedback
app.post("/api/feedback", async (req, res) => {

    try {

        const { message, category } = req.body;

        if (!message || !category) {

            return res.status(400).json({
                error: "Message and category are required"
            });

        }

        const { data, error } = await supabase
            .from("feedback")
            .insert([
                {
                    message: message.trim(),
                    category: category,
                    status: "pending"
                }
            ])
            .select()
            .single();

        if (error) {

            return res.status(500).json({
                error: error.message
            });

        }

        res.status(201).json(data);

    } catch (error) {

        res.status(500).json({
            error: "Server error"
        });

    }

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});