// import dotenv from "dotenv";
// import { IncomingMessage } from "http";
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

// // Função para pegar o IP do usuário, tratando diferentes cabeçalhos
// const getUserIp = (req: IncomingMessage): string => {
//   const xForwardedFor = req.headers["x-forwarded-for"];
//   if (typeof xForwardedFor === "string") {
//     return xForwardedFor.split(",")[0].trim(); // Garante que o IP seja tratado corretamente
//   }
//   return req.socket.remoteAddress || "IP_DESCONHECIDO"; // Fallback para IP desconhecido
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { photoId, photoAlt } = req.body;

//     if (!photoId || !photoAlt) {
//       return res.status(400).json({ message: "Parâmetros inválidos." });
//     }

//     const userIp = getUserIp(req); // Captura o IP do usuário

//     try {
//       // Verifica se o IP já votou
//       const result = await pool.query(
//         `SELECT * FROM public.votes WHERE user_ip = $1`,
//         [userIp]
//       );

//       if (result.rows.length > 0) {
//         return res.status(400).json({ message: "Você já votou!" });
//       }

//       // Registra o voto junto com o IP do usuário
//       await pool.query(
//         `INSERT INTO public.votes (photo_id, photo_alt, votes, user_ip, created_at) VALUES ($1, $2, $3, $4, NOW())`,
//         [photoId, photoAlt, 1, userIp]
//       );
//       res.status(200).json({ message: "Voto registrado com sucesso!" });
//     } catch (error) {
//       console.error("Erro ao registrar voto: ", error);
//       res.status(500).json({ message: "Erro ao registrar o voto." });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ message: `Método ${req.method} não permitido.` });
//   }
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
    return xForwardedFor.split(",")[0].trim(); // Garante que o IP seja tratado corretamente
  }
  return req.socket.remoteAddress || "IP_DESCONHECIDO"; // Fallback para IP desconhecido
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Endpoint para registrar votos
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
      console.error("Erro ao registrar voto: ", error);
      res.status(500).json({ message: "Erro ao registrar o voto." });
    }
  }
  // Endpoint para retornar os votos
  // Endpoint para retornar os votos
  else if (req.method === "GET") {
    try {
      // Pega todos os votos por foto
      const result = await pool.query(
        `SELECT photo_id, photo_alt, COUNT(*) as votes FROM public.votes GROUP BY photo_id, photo_alt`
      );

      // Defina os cabeçalhos para desabilitar o cache
      res.setHeader("Cache-Control", "no-store"); // Impede cache no navegador
      res.setHeader("Pragma", "no-cache"); // Para compatibilidade com versões antigas do HTTP
      res.setHeader("Expires", "0"); // Define a expiração como 0, garantindo que o conteúdo seja sempre fresco

      // Retorna os resultados
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Erro ao consultar votos: ", error);
      res.status(500).json({ message: "Erro ao consultar votos." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).json({ message: `Método ${req.method} não permitido.` });
  }
}
