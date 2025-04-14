# Personal-Painter

## Overview

Personal Painter is a web application that allows users to create unique artwork inspired by their experiences and emotions. By discussing their thoughts and feelings with an AI, users can generate personalized painting prompts and visualize their inner world through AI-generated art.

## Features

-   **AI-Powered Conversations:** Engage in conversations with an AI to explore your emotions and ideas for personalized paintings.
-   **AI-Generated Art Prompts:** Receive detailed and evocative art prompts based on your conversations.
-   **AI-Generated Artwork:** Generate unique digital paintings based on the generated prompts.
-   **Customizable Style:** Experiment with different art styles, moods, and color palettes to create the perfect representation of your vision.
-   **Downloadable Artwork:** Download your generated artwork for personal use.

## Technologies Used

-   [TypeScript](https://www.typescriptlang.org/): Primary programming language.
-   [Node.js](https://nodejs.org/): Runtime environment.
-   [Express](https://expressjs.com/): Web framework.
-   [Groq API](https://groq.com/): AI model for text generation and image prompt creation.
-   [ModelsLab API](https://modelslab.com/): AI model for image generation.
-   [Google Gemini API](https://ai.google.dev/): (Optional) AI model for enhanced text generation and image understanding.
-   [Git](https://git-scm.com/): Version control.
-   [npm](https://www.npmjs.com/): Package manager.
-   [dotenv](https://www.npmjs.com/package/dotenv): Zero-dependency module that loads environment variables from a .env file

## Setup Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/adityasingh0912/Personal-Painter.git
    ```

2.  **Install dependencies:**

    ```bash
    cd Personal-Painter
    npm install
    ```

3.  **Create a `.env` file:**

    Create a `.env` file in the root directory of the project and add the following environment variables:

    ```
    GROQ_API_KEY=YOUR_GROQ_API_KEY
    STABILITY_API_KEY=YOUR_MODELS_LAB_API_KEY
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY (optional)
    ```

    Replace `YOUR_GROQ_API_KEY`, `YOUR_MODELS_LAB_API_KEY`, and `YOUR_GEMINI_API_KEY` with your actual API keys.

4.  **Run the application:**

    ```bash
    npm run dev
    ```

5.  **Access the application:**

    Open your web browser and navigate to `http://localhost:5000`.

## Usage

1.  Start a conversation with the AI in the chat interface.
2.  Describe your emotions, experiences, or ideas for a personalized painting.
3.  The AI will generate art prompts based on your conversation.
4.  Click the "Generate Paintings" button to create AI-generated artwork based on the prompts.
5.  Browse the generated artwork and download your favorites.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes.
4.  Submit a pull request.

## License

[MIT](LICENSE)
