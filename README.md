# Amazon Scraper Challenge 🚀

**[➡️ View Live Demo]()**

## 📖 About The Project

This project is a full-stack technical challenge designed to scrape product listings from Amazon. It consists of a backend that fetches the data via a custom API and a frontend that consumes this API to display the results to the user.

---

## 🛠️ Tech Stack

**Backend:**
* **Node.js:** JavaScript runtime environment.
* **Playwright:** For robust web scraping of dynamic, JavaScript-rendered pages.
* **Express:** Framework for building the server and the REST API.
* **CORS:** Middleware to enable cross-origin requests between the frontend and backend.

**Frontend:**
* **Vite:** Modern frontend build tool for fast development.
* **HTML5:** For structuring the web page.
* **CSS3:** For custom styling and layout.
* **Vanilla JavaScript:** For DOM manipulation and API requests.

---

### 🤔 A Note on the Tech Stack (Bun vs. Node.js)

This project was initially developed using **Bun** as the JavaScript runtime, per the challenge's technical specification.

During development, a critical compatibility issue was identified between the Bun runtime (v1.x) and the **Playwright** library on the Windows operating system. Specifically, Playwright's browser instance failed to launch, resulting in consistent `launch: Timeout` errors that could not be resolved through standard debugging (e.g., running in headful mode).

After isolating the issue to the runtime environment, a pragmatic engineering decision was made to pivot the backend's execution environment to **Node.js**. This immediately resolved the incompatibility and allowed for the successful implementation of all required features.

The project retains its `bun.lockb` file as evidence of the initial development path. This journey showcases a practical approach to problem-solving and adapting the tech stack to overcome roadblocks and ensure a stable, functional, and complete project delivery.

---

## 📂 Project Structure

This project is organized as a monorepo with two primary directories:

* `/backend`: Contains all the server-side code, including the scraping logic and the API.
* `/frontend`: Contains all the client-side code for the user interface.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (LTS version recommended)
* A modern web browser (Chrome, Firefox, etc.)

### Installation & Execution

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[Guilherme-LTS]/amazon-scraper-challenge.git
    cd amazon-scraper-challenge
    ```

2.  **Set up the Backend:**
    * Navigate to the backend directory and install the dependencies:
        ```bash
        cd backend
        npm install
        ```
    * Install the necessary Playwright browsers:
        ```bash
        npx playwright install
        ```
    * Start the backend server:
        ```bash
        node src/index.js
        ```
    * The server will be running on `http://localhost:3000`.

3.  **Set up the Frontend:**
    * Open a **new terminal**.
    * Navigate to the frontend directory and install the dependencies:
        ```bash
        cd frontend
        npm install
        ```
    * Start the frontend development server:
        ```bash
        npm run dev
        ```
    * The application will be available at `http://localhost:5173` (or the port shown in the terminal).

4.  **Access the application** in your browser using the frontend URL and start scraping!

---