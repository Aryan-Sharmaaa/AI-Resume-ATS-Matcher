# AI Resume ATS Matcher

An AI-powered Resume ATS (Applicant Tracking System) Matcher that analyzes a candidate's resume against a job description and provides a detailed compatibility score, skill analysis, and recommendations to improve the resume.

The application helps job seekers understand how well their resume aligns with a specific job role before applying.

## Features

* Upload and analyze resumes
* Compare resumes against job descriptions
* Generate an ATS compatibility score
* Identify matching skills
* Detect missing skills and keywords
* Provide AI-powered resume improvement suggestions
* Display detailed match analysis
* Modern and responsive user interface
* Support for PDF resume uploads

## Tech Stack

### Frontend

* React.js
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Python
* FastAPI
* Uvicorn
* AI/LLM integration for resume analysis
* PDF text extraction

## Project Structure

```text
AI-Resume-ATS-Matcher/
│
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   └── ...
│
├── public/                 # Static frontend assets
│
├── backend/                # Backend application
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── ...
│
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
└── README.md
```

> Note: The exact project structure may vary depending on the current version of the repository.

## Getting Started

Follow these steps to run the project locally on your computer.

### Prerequisites

Make sure you have the following installed:

* Git
* Node.js (18 or newer recommended)
* npm
* Python 3.10 or newer
* pip

You may also need an API key for the AI model used by the backend.

## 1. Clone the Repository

Open Terminal or Command Prompt and run:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd AI-Resume-ATS-Matcher
```

## 2. Frontend Setup

Install the required Node.js packages:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The terminal will display a local URL, typically:

```text
http://localhost:5173
```

Open this address in your browser.

## 3. Backend Setup

Open another terminal window and navigate to the backend directory:

```bash
cd backend
```

Create a Python virtual environment.

### macOS/Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

## 4. Environment Variables

Create a `.env` file inside the backend directory if the project requires API keys.

Example:

```env
AI_API_KEY=your_api_key_here
```

Replace the variable name and value with the API key required by the AI service used in the project.

Never commit your `.env` file or API keys to GitHub.

Add the following to `.gitignore`:

```text
.env
.venv/
node_modules/
```

## 5. Start the Backend

With the virtual environment activated, run:

```bash
uvicorn main:app --reload
```

By default, the backend should be available at:

```text
http://localhost:8000
```

FastAPI API documentation can typically be accessed at:

```text
http://localhost:8000/docs
```

## 6. Connect Frontend and Backend

Make sure the frontend is configured to communicate with the backend.

For local development, the backend API URL will typically be:

```text
http://localhost:8000
```

For example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

After changing frontend environment variables, restart the frontend:

```bash
npm run dev
```

## Running the Complete Application

You need two terminals running simultaneously.

### Terminal 1 — Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

On Windows:

```bash
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2 — Frontend

```bash
npm install
npm run dev
```

Then open the frontend URL shown by Vite in your browser.

The application should now be ready to use.

## How It Works

1. The user uploads their resume.
2. The user enters or pastes a job description.
3. The frontend sends the resume and job description to the backend.
4. The backend extracts and processes the resume content.
5. The AI analyzes the resume against the job requirements.
6. The system calculates an ATS compatibility score.
7. The application displays matching skills, missing skills, and improvement suggestions.
8. The user can use the recommendations to optimize their resume for the target role.

## Troubleshooting

### `npm` command not found

Install Node.js and restart your terminal.

### Python command not found

Install Python and verify it using:

```bash
python --version
```

or:

```bash
python3 --version
```

### Port already in use

Run the backend on another port:

```bash
uvicorn main:app --reload --port 8001
```

Make sure to update the frontend API URL accordingly.

### Frontend cannot connect to backend

Check that:

* The backend server is running.
* The frontend is using the correct backend URL.
* CORS is correctly configured in FastAPI.
* Environment variables are correctly configured.

## Future Improvements

* User authentication and account management
* Resume analysis history
* Multiple resume comparison
* AI-powered resume rewriting
* Job-specific resume optimization
* Resume keyword recommendations
* Cover letter generation
* Resume scoring history and analytics
* Cloud deployment

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push your branch.
6. Create a Pull Request.

## Author

**Aryan Sharma**

Software Developer | AI/ML Enthusiast

## License

This project is intended for educational and portfolio purposes.
