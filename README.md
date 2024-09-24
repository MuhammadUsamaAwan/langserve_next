This repository integrates LangServe and llama.cpp with a NextJS client, enabling LLM inference via REST APIs and a modern frontend.

**Setup**

1. Create a Python virtual environment:

   ```bash
   python -m venv .venv
   ```

2. Activate the virtual environment:

   ```
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Run the FastAPI application:

   ```
   python app.py
   ```

5. Install dependencies in the NextJS project:

   ```
   cd web
   pnpm install
   ```

6. Start the NextJS development server:
   ```
   pnpm run dev
   ```
