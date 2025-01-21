// import dotenv from "dotenv";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Pool } from "pg";
// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // A URL do banco de dados deve estar no arquivo .env
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false,
// });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { photoId, photoAlt } = req.body;

//     if (!photoId || !photoAlt) {
//       return res.status(400).json({ message: "Parâmetros inválidos." });
//     }

//     try {
//       await pool.query(
//         `INSERT INTO public.votes (photo_id, photo_alt, votes, created_at) VALUES ($1, $2, $3, NOW())`,
//         [photoId, photoAlt, 1]
//       );
//       res.status(200).json({ message: "Voto registrado com sucesso!" });
//     } catch (error) {
//       console.error("Erro ao registrar voto:", error);
//       res.status(500).json({ message: "Erro ao registrar o voto." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ message: `Método ${req.method} não permitido.` });
//   }
//
// }

import dotenv from "dotenv";
import { IncomingMessage } from "http";
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

// Função para pegar o IP do usuário, tratando diferentes cabeçalhos
const getUserIp = (req: IncomingMessage): string => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0]; // Retorna o primeiro IP caso seja um proxy
  }
  return req.connection.remoteAddress || ""; // Caso contrário, pega o endereço direto
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { photoId, photoAlt } = req.body;

    if (!photoId || !photoAlt) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    const userIp = getUserIp(req); // Captura o IP do usuário

    try {
      // Verifica se o IP já votou
      const result = await pool.query(
        `SELECT * FROM public.votes WHERE user_ip = $1`,
        [userIp]
      );

      if (result.rows.length > 0) {
        return res.status(400).json({ message: "Você já votou!" });
      }

      // Registra o voto junto com o IP do usuário
      await pool.query(
        `INSERT INTO public.votes (photo_id, photo_alt, votes, user_ip, created_at) VALUES ($1, $2, $3, $4, NOW())`,
        [photoId, photoAlt, 1, userIp]
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
