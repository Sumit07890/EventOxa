import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const CSV_FILE = path.join(__dirname, 'vendors.csv');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create CSV with headers if it doesn't exist
if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, 'Full Name,Email,Phone,Category,Submitted At\n');
}

app.post('/submit', (req, res) => {
  const { name, email, phone, category } = req.body;

  if (!name || !email || !phone || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const row = `"${name}","${email}","${phone}","${category}","${new Date().toISOString()}"\n`;
  fs.appendFileSync(CSV_FILE, row);

  res.json({ success: true });
});

app.listen(3001, () => {
  console.log('EventOxa server running at http://localhost:3001');
});
