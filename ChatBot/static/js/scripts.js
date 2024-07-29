document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    const numberOfImages = 10; // Number of images to display
    const images = [
        '/static/images/meme1.png',
        '/static/images/meme2.png',
        '/static/images/meme3.png',
        '/static/images/meme4.png',
        '/static/images/meme5.png',
        '/static/images/meme6.png'
        // Add more paths to your meme images
    ];

    for (let i = 0; i < numberOfImages; i++) {
        const img = document.createElement('img');
        // Check if images array is not empty
        if (images.length > 0) {
            // Select a random image from the array
            const randomImage = images[Math.floor(Math.random() * images.length)];
            img.src = randomImage;
        } else {
            console.error('No images found in the array.');
            continue;
        }
        
        img.className = 'meme';
        img.style.top = `${Math.random() * 100}vh`;
        img.style.left = `${Math.random() * 100}vw`;
        img.style.width = `${Math.random() * 150 + 50}px`; // Random width between 50px and 200px

        // Debug output
        console.log(`Adding image: ${img.src}`);

        document.body.appendChild(img);
    
    }
    // Function to handle sending the message
    function sendMessage() {
        const message = messageInput.value;
        if (message.trim() === '') return; // Do not send empty messages

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            const messagesDiv = document.getElementById('messages');
            const messageElement = document.createElement('div');
            messageElement.className = 'message user'; // Add class for user message
            messageElement.textContent = "Me: " + message;
            messagesDiv.appendChild(messageElement);

            const botResponseElement = document.createElement('div');
            botResponseElement.className = 'message bot'; // Add class for bot response
            botResponseElement.textContent = "Chatbot: " + data.response;
            messagesDiv.appendChild(botResponseElement);

            // Scroll to the bottom of the messages div
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            // Clear the input field
            messageInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Attach click event to the send button
    sendButton.addEventListener('click', sendMessage);

    // Attach keypress event to the message input
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
            sendMessage(); // Trigger send message function
        }
    });
});
