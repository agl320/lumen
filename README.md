# Lumen

Personal studying tool.

## Run

1. Frontend dependencies:

   ```bash
   npm install
   ```

2. Python dependencies:

   ```bash
   pip install -r server/requirements.txt
   ```

3. Optional manual DB setup (FastAPI startup also initializes automatically):

   ```bash
   python src/data/table_setup.py
   ```

4. Start backend:

   ```bash
   npm run dev:api
   ```

5. Start frontend:

   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` and backend on `http://127.0.0.1:8000`.
