import express from "express";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../data");
mkdirSync(dataDir, { recursive: true });
const db = new Database(resolve(dataDir, "boards.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('blank','pdf')),
  pdf_data BLOB,
  state_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);

const app = express();
app.use(express.json({ limit: "100mb" }));
const summary = row => ({ id:row.id, name:row.name, kind:row.kind, createdAt:row.created_at, updatedAt:row.updated_at });
app.get("/api/boards", (_req,res) => res.json(db.prepare("SELECT id,name,kind,created_at,updated_at FROM boards ORDER BY updated_at DESC").all().map(summary)));
app.get("/api/boards/:id", (req,res) => { const row=db.prepare("SELECT * FROM boards WHERE id=?").get(req.params.id); if(!row)return res.status(404).json({error:"Not found"}); res.json({...summary(row),state:JSON.parse(row.state_json),pdfBase64:row.pdf_data?row.pdf_data.toString("base64"):null}); });
app.post("/api/boards", (req,res) => { const {name="Untitled board",kind="blank",state={},pdfBase64=null}=req.body; const result=db.prepare("INSERT INTO boards(name,kind,pdf_data,state_json) VALUES(?,?,?,?)").run(name,kind,pdfBase64?Buffer.from(pdfBase64,"base64"):null,JSON.stringify(state)); res.status(201).json({id:Number(result.lastInsertRowid)}); });
app.put("/api/boards/:id", (req,res) => { const {name,state}=req.body; const result=db.prepare("UPDATE boards SET name=COALESCE(?,name),state_json=COALESCE(?,state_json),updated_at=CURRENT_TIMESTAMP WHERE id=?").run(name??null,state?JSON.stringify(state):null,req.params.id); result.changes?res.json({ok:true}):res.status(404).json({error:"Not found"}); });
app.delete("/api/boards/:id", (req,res) => { db.prepare("DELETE FROM boards WHERE id=?").run(req.params.id); res.status(204).end(); });
app.listen(3001,"127.0.0.1",()=>console.log("SQLite API ready at http://127.0.0.1:3001"));
