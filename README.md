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

### If Git isn't recognized (Windows)
If you try `git clone` and get an error like:

```PowerShell
PS C:\Users\Kevin Bell> git clone https://github.com/bell-kevin/kevinBellai
git : The term 'git' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
At line:1 char:1
+ git clone https://github.com/bell-kevin/kevinBellai
+ ~~~
    + CategoryInfo          : ObjectNotFound: (git:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

then Git isn't installed (or isn't on your PATH). To fix this:
1. Download the installer from [gitforwindows.org](https://gitforwindows.org/).
2. Run it and choose the option that adds Git to your PATH.
3. Open a new PowerShell window and check the installation:
   ```PowerShell
   git --version
   ```
   You should see the installed version number.
4. Now try cloning again:
   ```PowerShell
   git clone https://github.com/bell-kevin/kevinBellai
   ```
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
$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"   # on Windows PowerShell
```

If you're using PowerShell, you can confirm that the variable is set by running:

```PowerShell
echo $env:OPENAI_API_KEY
```

## Running the Server
After installing the dependencies and setting your key, start the server with:
```bash
node server.js
```
You should see a message like `Server running at http://localhost:3000`. Keep this terminal window open while you use the chatbot.

### Running on a Home Server (Ubuntu 24.04 LTS)
If you want the chatbot to stay online after closing your terminal, you can run it as a
`systemd` service:

1. **Create a service file** (for example, `/etc/systemd/system/chatbot.service`):
   ```ini
   [Unit]
   Description=AI Chatbot
   After=network.target

   [Service]
   WorkingDirectory=/path/to/kevinBellai
   ExecStart=/usr/bin/node /path/to/kevinBellai/server.js
   Restart=always
   Environment=OPENAI_API_KEY=YOUR_OPENAI_API_KEY

   [Install]
   WantedBy=multi-user.target
   ```
   Replace `/path/to/kevinBellai` with the directory where you cloned this repository and
   set your real API key.
2. **Reload systemd and start the service**:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now chatbot.service
   ```
   The server will now run in the background and automatically start on boot. Check its
   status with `sudo systemctl status chatbot.service`.

## Using the Chatbot
1. Open your web browser and navigate to `http://localhost:3000`.
2. Type a message in the text box and click **Send**.
3. The bot's reply will appear below your message. You can chat back and forth as much as you like.

If something goes wrong, check the terminal where you started the server for error messages.

### If `OPENAI_API_KEY` is missing
If you run `node server.js` and see an error like:
```bash
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```
it means Node can't find your API key. Create a `.env` file with:
```env
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```
or set the variable directly in your terminal, then restart the server. On Windows PowerShell, you can verify the variable with `echo $env:OPENAI_API_KEY` and set it using `$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"`.

### Example PowerShell Session
Below is an example PowerShell transcript showing the environment variable being
set, the server starting, and the resulting quota error when the API key's
usage limit has been exceeded:

```PowerShell
PS C:\Users\Kevin Bell\kevinBellai> $env:OPENAI_API_KEY="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"
PS C:\Users\Kevin Bell\kevinBellai> echo $env:OPENAI_API_KEY
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
PS C:\Users\Kevin Bell\kevinBellai> node server.js
Server running at http://localhost:3000
RateLimitError: 429 You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.
    at APIError.generate (C:\Users\Kevin Bell\kevinBellai\node_modules\openai\core\error.js:63:20)
    at OpenAI.makeStatusError (C:\Users\Kevin Bell\kevinBellai\node_modules\openai\client.js:158:32)
    at OpenAI.makeRequest (C:\Users\Kevin Bell\kevinBellai\node_modules\openai\client.js:301:30)
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async C:\Users\Kevin Bell\kevinBellai\server.js:23:24 {
  status: 429,
  headers: Headers {
    date: 'Tue, 01 Jul 2025 18:10:42 GMT',
    'content-type': 'application/json; charset=utf-8',
    'content-length': '337',
    connection: 'keep-alive',
    vary: 'Origin',
    'x-request-id': 'req_2ffdf96f6a538b2edd4cc133c5854696',
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    'cf-cache-status': 'DYNAMIC',
    'set-cookie': '__cf_bm=GHwEud4fYyI9EbCnit7xiT_FjYeEwSJGFMY8V_OGADk-1751393442-1.0.1.1-25KRGN2mGhZAgHupqFcDLkAMMVMr8nRHZE.vmlNQdV1ikwNAy6Iy5HdqXYqOTJkF0w5SivgjQw.e8IxsLoG6hyAVO29JdVgxh6s7s4hQmpU; path=/; expires=Tue, 01-Jul-25 18:40:42 GMT; domain=.api.openai.com; HttpOnly; Secure; SameSite=None, _cfuvid=UyFyppLzA0BLCxMQa_Y0.D92R8TeH2NjByi.T9wqEcA-1751393442685-0.0.1.1-604800000; path=/; domain=.api.openai.com; HttpOnly; Secure; SameSite=None',
    'x-content-type-options': 'nosniff',
    server: 'cloudflare',
    'cf-ray': '9587dc95d9cee888-SLC',
    'alt-svc': 'h3=":443"; ma=86400'
  },
  requestID: 'req_2ffdf96f6a538b2edd4cc133c5854696',
  error: {
    message: 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.',
    type: 'insufficient_quota',
    param: null,
    code: 'insufficient_quota'
  },
  code: 'insufficient_quota',
  param: null,
  type: 'insufficient_quota'
}
```

AI Chatbot

You: weather layton utah

Error: Failed to get response from OpenAI

ChatGPT said:

It seems like you are hitting the quota limit for your OpenAI API key, which is causing the RateLimitError with the message insufficient_quota. You'll need to check your plan and billing details on the OpenAI platform to resolve this issue. Here's what you can do:

Check your OpenAI account: Log in to OpenAI and go to the "Billing" section to confirm your usage and limits.

Upgrade your plan: If you’ve exceeded the free tier or your current usage limits, consider upgrading your plan to increase your quota.

Wait for the quota to reset: If you're on a limited plan, your quota may reset after a certain period (e.g., monthly).

Once your quota issue is resolved, you should be able to run your server again without hitting this error.

## Deploying to Netlify

You can host the contents of the `public/` folder on Netlify. The Express server (`server.js`) isn't deployable on Netlify without some extra steps because Netlify doesn't run long-lived Node servers. The static files are simple to deploy, but for the `/chat` endpoint you'll need to convert the logic into a **Netlify Function**. This repository now includes a function at `netlify/functions/chat.js` and a `netlify.toml` configuration so the backend can run on Netlify.

If you clone this project, deploy it with the steps below. The front-end automatically uses the Netlify function when it's not running on `localhost`.

1. **Install the Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```
   If you prefer not to install globally, run commands with `npx netlify` instead.

2. **Log in to Netlify**
   ```bash
   netlify login
   ```
   This opens a browser window for authentication.

3. **Build the project** (optional)
   ```bash
   npm run build
   ```
   The build step just prints a message because the site is served from `public/`.

4. **Deploy**
   ```bash
   netlify deploy --dir=public        # preview
   netlify deploy --dir=public --prod # production
   ```

If you get a "no such file or directory" error, make sure you're running the command from the project root and that the `public/` folder exists.


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
