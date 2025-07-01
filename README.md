# Beginner-Friendly Guide

Welcome to this simple AI chatbot project! This repository contains a small web application that lets you talk to OpenAI's models. The goal of this guide is to help absolute beginners set up the project and understand how it works.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Setting the API Key](#setting-the-api-key)
5. [Running the Server](#running-the-server)
6. [Using the Chatbot](#using-the-chatbot)
7. [Project Structure](#project-structure)
8. [Where to Learn More](#where-to-learn-more)
9. [Contributing](#contributing)
10. [License](#license)

## Overview
This project is a minimal web-based chatbot built with **Node.js** and **Express**. It serves a small web page (located in `public/index.html`) where you can type messages. The server forwards those messages to OpenAI and returns the responses.

Even if you've never built a web application before, you can use this guide to run the project on your own computer.

## Prerequisites
1. **Install Node.js**: You need Node.js (which comes with npm) installed on your computer.
   - Visit [nodejs.org](https://nodejs.org/) and download the "LTS" version for your operating system.
   - Follow the installer instructions. Once finished, open your terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run `node --version` to make sure Node.js is installed correctly.
2. **A text editor**: Any code editor will work. Popular choices include [VS Code](https://code.visualstudio.com/), [Atom](https://atom.io/), or even a basic text editor.

## Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kevinBellai
   ```
   Replace `<repository-url>` with the URL of your fork or this repository.
2. **Install dependencies**
   ```bash
   npm install
   ```
   This command downloads the packages listed in `package.json` (mainly `express` and `openai`).

## Setting the API Key
The server expects an environment variable named `OPENAI_API_KEY`. This is a secret key that lets your server talk to OpenAI's API. **Never share this key publicly or commit it to source control.**

1. Create a file named `.env` in the project root (next to `server.js`).
2. Add the following line, replacing `YOUR_OPENAI_API_KEY` with your actual key:
   ```env
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   ```
3. Save the file. When you run the server, it will read the key from this file.

If you don't want to use a `.env` file, you can also set `OPENAI_API_KEY` directly in your terminal before starting the server:
```bash
export OPENAI_API_KEY=YOUR_OPENAI_API_KEY   # on macOS/Linux
set OPENAI_API_KEY=YOUR_OPENAI_API_KEY      # on Windows CMD
```

## Running the Server
After installing the dependencies and setting your key, start the server with:
```bash
node server.js
```
You should see a message like `Server running at http://localhost:3000`. Keep this terminal window open while you use the chatbot.

## Using the Chatbot
1. Open your web browser and navigate to `http://localhost:3000`.
2. Type a message in the text box and click **Send**.
3. The bot's reply will appear below your message. You can chat back and forth as much as you like.

If something goes wrong, check the terminal where you started the server for error messages.

## Project Structure
```
kevinBellai/
├── public/
│   └── index.html   # Web page for the chat interface
├── server.js        # Express server that talks to OpenAI
├── package.json     # Project metadata and dependencies
└── README.md        # This guide
```
Feel free to explore these files. `server.js` is a good starting point if you want to modify the chatbot's behavior.

## Where to Learn More
- [Node.js documentation](https://nodejs.org/en/docs/)
- [Express documentation](https://expressjs.com/)
- [OpenAI API reference](https://platform.openai.com/docs/api-reference)

These resources can help you deepen your understanding as you become more comfortable with coding.

## Contributing
Contributions are welcome! If you'd like to make improvements, please fork the repository and open a pull request. See `CONTRIBUTING.md` for more details.

## License
This project is licensed under the terms of the **GNU Affero General Public License v3.0**. See the `LICENSE` file for the full text.

Enjoy experimenting with your chatbot!
