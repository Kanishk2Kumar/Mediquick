const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config();
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Func: Session Management
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set secure to false for local development
}));

const classificationPrompt = process.env.CLASSIFICATION_PROMPT;
const systemPrompt = process.env.SYSTEM_PROMPT;

// Function: Classify User Prompts
async function classifyQuery(query) {
  try {
    const classificationResponse = await model.generateContent(classificationPrompt.replace('{query}', query));
    if (classificationResponse && classificationResponse.response) {
      const classificationResult = await classificationResponse.response.text();
      return classificationResult.trim().toLowerCase();
    } else {
      throw new Error('Invalid classification response structure');
    }
  } catch (error) {
    console.error('Error classifying query:', error);
    throw new Error('Error classifying query');
  }
}

// Route: Home
app.get('/', (req, res) => {
  try {
    // Func: Reset Session on Refresh
    req.session.context = [];
    res.render('index');
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route: Chat
app.post('/chat', async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const classificationResult = await classifyQuery(prompt);
    let userContext = req.session.context || [];

    if (classificationResult === 'related') {
      // Memory Update
      userContext.push({ role: 'user', content: prompt });

      // Prompt Chain
      const contextPrompt = userContext.map(entry => `${entry.role}: ${entry.content}`).join('\n');
      const fullPrompt = `${systemPrompt}\n\nUser Context:\n${contextPrompt}\n\nUser Query: ${prompt}`;

      try {
        const response = await model.generateContent(fullPrompt);
        if (response && response.response) {
          const text = await response.response.text();

          // Rebuild Memory
          userContext.push({ role: 'bot', content: text });
          req.session.context = userContext;

          res.json({ text });
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response, Try Again🙏' });
      }
    } else if (classificationResult === 'off-topic') {
      res.json({ text: "Sorry! I can only help you regarding medical or clinical assistant." });
    } else {
      console.error('Unexpected classification result:', classificationResult);
      res.status(500).json({ error: 'Unexpected classification result👾' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Error processing request, Try Again🙏' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://0.0.0.0:${port}`);
});
