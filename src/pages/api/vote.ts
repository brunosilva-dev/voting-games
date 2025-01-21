import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // A URL do banco de dados deve estar no arquivo .env
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { photoId, photoAlt } = req.body;

    if (!photoId || !photoAlt) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    try {
      await pool.query(
        `INSERT INTO votes (photo_id, photo_alt, votes, created_at) VALUES ($1, $2, $3, NOW())`,
        [photoId, photoAlt, 1]
      );
      res.status(200).json({ message: "Voto registrado com sucesso!" });
    } catch (error) {
      console.error("Erro ao registrar voto:", error);
      res.status(500).json({ message: "Erro ao registrar o voto." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
