import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("Workplace");
    const [feedback, setFeedback] = useState([]);

    // Load feedback from backend
    async function loadFeedback() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/feedback"
            );

            const data = await response.json();

            if (response.ok) {
                setFeedback(data);
            }
        } catch (error) {
            console.error("Error loading feedback:", error);
        }
    }

    // Load feedback when page opens
    useEffect(() => {
        loadFeedback();
    }, []);

    // Submit feedback
    async function submitFeedback(event) {
        event.preventDefault();

        if (!message.trim()) {
            alert("Please write some feedback.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/feedback",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message,
                        category: category
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(
                    data.error ||
                    "Failed to submit feedback."
                );
                return;
            }

            alert("Feedback submitted successfully!");

            setMessage("");
            setCategory("Workplace");

            // Reload feed
            loadFeedback();

        } catch (error) {
            console.error(error);
            alert("Cannot connect to the backend.");
        }
    }

    return (
        <div className="app">

            {/* Header */}

            <h1>Your Voice. Your Space.</h1>

            <p>
                Speak freely. Share honestly. Stay completely anonymous.
            </p>


            {/* Feedback Form */}

            <form onSubmit={submitFeedback}>

                <textarea
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={(e) =>
                        setMessage(e.target.value)
                    }
                />

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >

                    <option value="Workplace">
                        Workplace
                    </option>

                    <option value="Management">
                        Management
                    </option>

                    <option value="Facilities">
                        Facilities
                    </option>

                    <option value="Culture">
                        Culture
                    </option>

                    <option value="Other">
                        Other
                    </option>

                </select>

                <button type="submit">
                    Submit Anonymously
                </button>

            </form>


            {/* Feedback Feed */}

            <div className="feed">

                <h2>Recent Feedback</h2>

                {feedback.length === 0 ? (

                    <p className="empty">
                        No feedback yet. Be the first to share.
                    </p>

                ) : (

                    feedback.map((item) => (

                        <div
                            className="feedback-card"
                            key={item.id}
                        >

                            <p className="feedback-message">
                                "{item.message}"
                            </p>

                            <div className="feedback-info">

                                <span>
                                    {item.category}
                                </span>

                                <span>
                                    {new Date(
                                        item.created_at
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default App;