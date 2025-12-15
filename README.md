# LogoMotion Designer

Design professional company logos using Gemini 3 Pro and bring them to life with Veo video generation.

## Overview

LogoMotion Designer is a web application that leverages Google's latest generative AI models to help users create unique brand identities. First, it uses **Gemini 3 Pro** (Image Generation) to design high-quality, vector-style logos based on text descriptions. Then, it uses **Veo** (Video Generation) to animate these logos into cinematic videos suitable for intros or social media.

## Features

- **Logo Design**: Generate professional logos from text descriptions using `gemini-3-pro-image-preview`.
- **Logo Animation**: Bring static logos to life with video animation using `veo-3.1-fast-generate-preview`.
- **Customization**: Select image resolution (1K, 2K, 4K) and video aspect ratio (16:9, 9:16).
- **Secure Access**: Integration with Google AI Studio for secure API key selection.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI SDK**: Google GenAI SDK (`@google/genai`)
- **Build Tooling**: ES Modules (via `importmap` in `index.html`)

## Getting Started

1.  **API Key**: This application requires a Google Cloud Project with billing enabled to use the Veo and Gemini 3 Pro models.
2.  **Launch**: Open the application. You will be prompted to select your API key via the Google AI Studio integration.
3.  **Generate**:
    *   Enter a description for your company/logo.
    *   Click "Generate Logo".
    *   Once the logo is generated, optionally provide animation instructions.
    *   Click "Generate Video" to create the animation.

## License

This project is for educational and demonstration purposes.
