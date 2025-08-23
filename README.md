# AAGATE: Agentic AI Governance Assurance & Trust Engine

AAGATE is a flagship project under the [OWASP AI Vulnerability and Security Framework (AIVSS)](https://aivss.owasp.org/), dedicated to providing a robust framework for the governance, assurance, and security of Agentic AI systems.

## Abstract

The proliferation of sophisticated AI agents and Large Language Models (LLMs) introduces novel security and governance challenges. Traditional security paradigms are often insufficient to address the unique vulnerabilities inherent in agentic systems, such as complex attack surfaces, unpredictable behavior, and the potential for emergent, unintended capabilities. AAGATE (Agentic AI Governance Assurance & Trust Engine) presents a comprehensive, open-source solution designed to provide continuous monitoring, policy enforcement, and risk management for these advanced AI systems. By integrating real-time anomaly detection, behavioral policy enforcement, and configuration drift analysis, AAGATE offers a centralized platform for security teams to ensure that AI agents operate safely, ethically, and in alignment with organizational policies and standards like the NIST AI Risk Management Framework.

## Architecture

This project is built on a modern, scalable web stack, designed for performance and maintainability.

-   **Frontend**: Built with **Next.js** and **React** using the App Router. Components are crafted with **ShadCN UI** and styled using **Tailwind CSS**. The frontend leverages Server Components for performance and Server Actions for data mutations, providing a seamless user experience.
-   **AI/Backend**: AI capabilities are powered by **Google's Genkit**, which orchestrates interactions with generative models like Gemini. Genkit flows are defined in the `src/ai/flows/` directory and are exposed to the frontend via Next.js Server Actions.
-   **Data**: The current version uses mock data located in `src/lib/mock-data.ts` to simulate a real-world environment with multiple AI agents and policies.

## Features

AAGATE provides a suite of tools to monitor and govern your AI agents. The dashboard is organized into several key sections:

### 1. Overview
The main dashboard provides a high-level summary of all registered AI agents. You can quickly see each agent's status (Online, Offline, Warning), its current risk score, and a platform-wide risk trend chart that averages the risk scores across all agents over time.

### 2. Anomaly Detection
This page leverages a Genkit AI flow to analyze security signals and behavioral data from an agent. By providing logs or other signals, the AI can determine if the agent's behavior is anomalous, assign a risk score, and suggest potential remediation steps.

### 3. Policy Management
Here, you can view and manage the security policies that govern your agents. These policies are written in Rego, the language used by the Open Policy Agent (OPA), and are mapped to controls from security frameworks like the NIST AI RMF.

### 4. Shadow Monitor
This crucial feature helps prevent security vulnerabilities arising from configuration drift. It provides a side-by-side comparison of an agent's production configuration against a "shadow" version, highlighting any unauthorized or risky changes in permissions, parameters, or models before they are deployed.

### 5. Violation Analysis
When a policy violation occurs, this tool provides an AI-powered analysis. By inputting the violation details and relevant security logs, the system uses Genkit to classify the violation, provide contextual insights based on frameworks like MAESTRO and AIVSS, and recommend specific remediation actions.

## Getting Started

To run this project locally, follow these steps:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set up Environment Variables**:
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

3.  **Run the Development Server**:
    The application and the Genkit development server run concurrently.
    
    In one terminal, run the Next.js development server:
    ```bash
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

    In another terminal, run the Genkit development server:
    ```bash
    npm run genkit:watch
    ```
    This starts the Genkit flows and provides a development UI, typically on `http://localhost:4000`.

4.  **Open the Application**:
    Navigate to `http://localhost:9002` in your browser to see the application.

## How to Contribute

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1.  Fork the repository on GitHub.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your branch to your forked repository.
5.  Open a pull request to the main repository, detailing the changes you've made.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 OWASP Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
