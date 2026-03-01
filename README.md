# AIZONET - AI Tools Directory

A comprehensive directory of AI tools built with React, Vite, Tailwind CSS, and Supabase.

## 🚀 Deployment on Vercel

This project is optimized for Vercel deployment.

### 1. Environment Variables

You must set the following environment variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key |
| `GEMINI_API_KEY` | Your Google Gemini API Key |

### 2. Deployment Steps

1.  Push this code to your GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect the Vite framework.
4.  Add the environment variables listed above.
5.  Click **Deploy**.

### 3. SEO Optimization

The project now uses `BrowserRouter` and includes a `vercel.json` file to handle Single Page Application (SPA) routing. This ensures that your programmatic SEO pages (e.g., `/compare/chatgpt-vs-gemini`) are correctly indexed by search engines.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
