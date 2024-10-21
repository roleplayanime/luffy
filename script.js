document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    let chatHistory = []; // Store the chat history  
    const maxHistoryLength = 20; // Limit the history to last 20 messages

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(); 
        }
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessageToChat('user', message);
            userInput.value = '';
            fetchResponse(message);
        }
    }

    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

        // Create an image element for the profile picture
        const img = document.createElement('img');
        img.src = sender === 'user' ? 'hi.jpg' : 'profie.jpg'; // Add your image paths
        img.alt = sender === 'user' ? 'You' : 'Bot';
 
        // Append the image and message text
        messageElement.appendChild(img);
        messageElement.appendChild(document.createTextNode(message));
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Add the message to the chat history
        chatHistory.push({ sender, message });
        if (chatHistory.length > maxHistoryLength) {
            chatHistory.shift(); // Remove the oldest message if history exceeds 20 messages
        }
    }

    async function fetchResponse(message) {
        try {
            // Include the chat history in the request to remember context
            const historyText = chatHistory.map(chat => `${chat.sender}: ${chat.message}`).join('\n');
            const fullMessage = `${historyText}\nYou: ${message}\nLuffy:`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDfK7jvOdXqc40MUbhUV2DRDXGseMVw17U`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Act like Monkey D. Luffy from One Piece. Respond with high energy and enthusiasm, keeping answers short and simple. Prioritize friends and adventure, and add emojis to express excitement or determination. Be straightforward, always ready for action, and make your love for freedom clear. Use emojis like 😄, 💪, or 🏴‍☠️ to capture Luffy’s playful and adventurous spirit and respond to the following conversation:\n${fullMessage}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const botMessage = data.candidates[0].content.parts[0].text; // Adjust based on actual response structure
            addMessageToChat('bot', botMessage);
        } catch (error) {
            console.error('Error:', error);
            addMessageToChat('bot', 'Sorry, I encountered an error while processing your request.');
        }
    }
});
