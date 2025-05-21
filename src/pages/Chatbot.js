import React, { useState } from "react";
import Sentiment from "sentiment";
import "./Chatbot.css"; // Import CSS styles

const sentiment = new Sentiment();

const responses = {
  positive: [
    "That’s great! Keep up the positivity! 😊",
    "You're doing amazing! 🌟",
    "Stay optimistic! 🎉",
    "Happiness looks great on you! Keep smiling. 😃",
    "Tell me about something wonderful that happened recently!",
    "Life’s too short not to enjoy the little moments. 🌼",
    "You radiate good vibes. What’s inspiring you today?",
    "You’re thriving! What’s keeping your energy up?",
    "The world needs more positivity—keep spreading it!",
    "Let’s celebrate your victories, big or small! 🎊"
  ],
  neutral: [
    "I'm here to listen. Tell me more.",
    "Would you like to talk about anything specific?",
    "You can share anything—I'm here with you.",
    "I’m all ears. What’s been on your mind?",
    "Sometimes, just talking things out helps. Go ahead!",
    "No pressure—take your time. I’m here.",
    "How’s your day going so far?",
    "Thinking about something deep? Let’s explore it.",
    "Your thoughts matter. Share anything you'd like.",
    "Some days feel slower, and that’s okay. What would make today better?"
  ],
  negative: [
    "I'm sorry you're feeling this way. You're not alone. 💙",
    "Deep breaths. Want a relaxation tip?",
    "It's okay to feel this way. You're valued.",
    "Your feelings are completely valid. I’m here for you.",
    "You are stronger than you think. Take things one step at a time.",
    "When life feels overwhelming, remember: you’re never alone.",
    "Would grounding exercises help? I can share a few!",
    "Self-care is important. Would you like a few ideas?",
    "Even tough days pass. I promise brighter moments ahead. 🌈",
    "What’s one thing that brings you comfort? Let's focus on that."
  ]
};

// Diet Adviser & Meal Planner
const dietResponses = {
  "weight loss": [
    "For healthy weight loss, try eating balanced meals with lean proteins, vegetables, and whole grains.",
    "Avoid processed sugars and prioritize nutrient-dense foods like nuts, avocados, and greens."
  ],
  "muscle gain": [
    "Focus on high-protein meals, including lean meats, eggs, tofu, and legumes.",
    "Don’t forget complex carbohydrates like quinoa and sweet potatoes for sustained energy."
  ],
  "balanced diet": [
    "A well-rounded diet includes proteins, healthy fats, fiber-rich veggies, and whole grains.",
    "Drink enough water and maintain portion control for better digestion and energy."
  ]
};

const mealPlanner = {
  "breakfast": ["Oatmeal with nuts & berries", "Scrambled eggs with spinach", "Greek yogurt with honey & flaxseeds"],
  "lunch": ["Grilled chicken with quinoa & steamed veggies", "Lentil soup with whole-grain toast", "Avocado & hummus wrap"],
  "dinner": ["Salmon with roasted sweet potatoes & asparagus", "Veggie stir-fry with tofu & brown rice", "Chickpea salad with tahini dressing"]
};

const getDietAdvice = (message) => {
  const keywords = Object.keys(dietResponses);
  for (let keyword of keywords) {
    if (message.toLowerCase().includes(keyword)) {
      return dietResponses[keyword][Math.floor(Math.random() * dietResponses[keyword].length)];
    }
  }
  return null;
};

const getMealSuggestion = (message) => {
  const keywords = Object.keys(mealPlanner);
  for (let keyword of keywords) {
    if (message.toLowerCase().includes(keyword)) {
      return `How about trying this: ${mealPlanner[keyword][Math.floor(Math.random() * mealPlanner[keyword].length)]}`;
    }
  }
  return null;
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    const updatedMessages = [...messages, userMessage];

    const analysis = sentiment.analyze(input);
    const mood = analysis.score > 0 ? "positive" :
                 analysis.score < 0 ? "negative" : "neutral";

    const botResponse = responses[mood][Math.floor(Math.random() * responses[mood].length)];
    const dietAdvice = getDietAdvice(input);
    const mealSuggestion = getMealSuggestion(input);

    const finalBotMessage = dietAdvice ? dietAdvice :
                            mealSuggestion ? mealSuggestion :
                            botResponse;

    const botMessage = { text: finalBotMessage, sender: "bot" };
    setMessages([...updatedMessages, botMessage]);

    setInput("");
  };

  return (
    <div className="chatbot">
      <h2 className="chatbot-title">Mental Health & Diet Support Chatbot</h2>
      <p className="chatbot-subtitle">Your personal space for well-being, emotional support, and nutrition guidance 💙</p>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your feelings or ask about nutrition..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

