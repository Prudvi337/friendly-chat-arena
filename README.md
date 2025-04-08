# Friendly Chat Arena

## Project Description

Friendly Chat Arena is a real-time chat application designed to provide users with an interactive and seamless chat experience. Users can join chat rooms, exchange messages in real-time, and enjoy a smooth, responsive interface. This project focuses on creating a secure, user-friendly platform with essential chat features and room management capabilities.

## Technologies Used

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

### User Interface
- Intuitive and visually appealing design using HTML and CSS.
- Chat room interface includes:
  - A list of available chat rooms.
  - A message display area.
  - An input field for sending messages.
- Responsive design to support various screen sizes.

### Real-Time Communication
- Real-time messaging powered by JavaScript and WebSockets.
- Users can:
  - Select and join chat rooms.
  - Exchange messages with other users in real-time without refreshing the page.

### User Authentication
- Users must choose a unique username before joining a chat room.
- Prevents impersonation and duplicate usernames.

### Chat Features
- Send and receive text messages in chat rooms.
- Display sender information and timestamps for each message.
- Support for basic text formatting (e.g., bold, italics, links).

### Room Management
- Users can create new chat rooms or join existing ones.
- A list of available chat rooms is displayed for easy selection.

### User Experience
- Smooth scrolling for messages and notifications for new messages.
- Handles edge cases like empty messages and room selection errors.

### Security
- Focus on secure user authentication and data validation.
- Handles user disconnection and reconnection scenarios gracefully.

## How to Run the Application

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```
Start chatting by selecting or creating a chat room and entering a username.

## Additional Notes

- Ensure you have a stable internet connection to enable real-time communication via WebSockets.
- Test the application thoroughly to explore all features and edge cases.



**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.