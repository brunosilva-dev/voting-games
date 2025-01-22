// "use client";

// import React, { useState } from "react";
// import styles from "./page.module.css";
// import Image from "next/image";

// const Page: React.FC = () => {
//   const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
//   const [isVoting, setIsVoting] = useState(false); // Para desativar o botão enquanto vota
//   const [votes, setVotes] = useState<number[]>(new Array(10).fill(0));

// const photos = [
//   { id: 1, src: "/assets/cold-war.jpeg", alt: "Call Of Duty Cold War" },
//   { id: 2, src: "/assets/dredge.jpeg", alt: "Dredge" },
//   {
//     id: 3,
//     src: "/assets/kingdom-come-deliverance.jpeg",
//     alt: "Kingdom Come Deliverance",
//   },
//   { id: 4, src: "/assets/little-nightmare.jpg", alt: "Little Nightmare" },
//   { id: 5, src: "/assets/mafia-2.jpg", alt: "Mafia 2" },
//   {
//     id: 6,
//     src: "/assets/murdered-soul-suspect.jpeg",
//     alt: "Murdered Soul Suspect",
//   },
//   { id: 7, src: "/assets/sinking-city.jpeg", alt: "The Sinking City" },
//   { id: 8, src: "/assets/the last of us.jpg", alt: "The Last Of Us" },
//   { id: 9, src: "/assets/the-witcher-3.jpeg", alt: "The Witcher 3" },
//   { id: 10, src: "/assets/twin-mirror.jpg", alt: "The Mirror" },
// ];

//   const handleVote = async () => {
//     if (selectedPhoto === null) {
//       alert("Por favor, selecione uma foto antes de votar!");
//       return;
//     }

//     setIsVoting(true); // Desativa o botão enquanto processa

//     try {
//       const response = await fetch("/api/vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           photoId: photos[selectedPhoto - 1].id,
//           photoAlt: photos[selectedPhoto - 1].alt,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Erro ao salvar o voto.");
//       }

//       // Atualiza localmente os votos
//       const newVotes = [...votes];
//       newVotes[selectedPhoto - 1] += 1;
//       setVotes(newVotes);

//       alert(`Você votou no jogo - ${photos[selectedPhoto - 1].alt}`);
//     } catch (error) {
//       console.error(error);
//       alert("Erro ao registrar o voto. Tente novamente.");
//     } finally {
//       setIsVoting(false); // Reativa o botão
//     }
//   };

//   const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

//   return (
//     <div className={styles.app}>
//       <header className={styles.header}>
//         <h1>Qual jogo gostaria de ver em live?</h1>
//         <p>Você tem 1 voto disponível</p>
//       </header>
//       <main className={styles.gallery}>
//         {photos.map((photo, index) => {
//           const votePercentage =
//             totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0;
//           return (
//             <div
//               key={photo.id}
//               className={`${styles.photo} ${
//                 selectedPhoto === photo.id ? styles.selected : ""
//               }`}
//               onClick={() => setSelectedPhoto(photo.id)}
//             >
//               <Image
//                 src={photo.src}
//                 alt={photo.alt}
//                 width={150}
//                 height={150}
//                 className="photo"
//               />
//               <div className={styles.photoTextContainer}>
//                 <p>{photo.alt}</p>
//               </div>
//               <p className={styles.percentual}>
//                 {Math.round(votePercentage)}% - {votes[index]} votos
//               </p>
//               <div className={styles.voteBarContainer}>
//                 <div
//                   className={styles.voteBar}
//                   style={{ width: `${votePercentage}%` }}
//                 ></div>
//               </div>
//             </div>
//           );
//         })}
//       </main>
//       <footer className={styles.footer}>
//         <button
//           onClick={handleVote}
//           className={styles.voteButton}
//           disabled={isVoting}
//         >
//           {isVoting ? "Enviando..." : "Vote"}
//         </button>
//       </footer>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

const Page: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [votes, setVotes] = useState<number[]>(new Array(10).fill(0));
  const [hasVoted, setHasVoted] = useState(false); // Controle do estado de voto

  const photos = [
    { id: 1, src: "/assets/cold-war.jpeg", alt: "Call Of Duty Cold War" },
    { id: 2, src: "/assets/dredge.jpeg", alt: "Dredge" },
    {
      id: 3,
      src: "/assets/kingdom-come-deliverance.jpeg",
      alt: "Kingdom Come Deliverance",
    },
    { id: 4, src: "/assets/little-nightmare.jpg", alt: "Little Nightmare" },
    { id: 5, src: "/assets/mafia-2.jpg", alt: "Mafia 2" },
    {
      id: 6,
      src: "/assets/murdered-soul-suspect.jpeg",
      alt: "Murdered Soul Suspect",
    },
    { id: 7, src: "/assets/sinking-city.jpeg", alt: "The Sinking City" },
    { id: 8, src: "/assets/the last of us.jpg", alt: "The Last Of Us" },
    { id: 9, src: "/assets/the-witcher-3.jpeg", alt: "The Witcher 3" },
    { id: 10, src: "/assets/twin-mirror.jpg", alt: "The Mirror" },
  ];

  const handleVote = async () => {
    if (selectedPhoto === null) {
      alert("Por favor, selecione uma foto antes de votar!");
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoId: photos[selectedPhoto - 1].id,
          photoAlt: photos[selectedPhoto - 1].alt,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao registrar o voto.");
      }

      if (result.message.includes("já votou")) {
        alert(result.message);
      } else {
        setHasVoted(true);
        const newVotes = [...votes];
        newVotes[selectedPhoto - 1] += 1;
        setVotes(newVotes);
        alert(`Você votou no jogo - ${photos[selectedPhoto - 1].alt}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar o voto. Tente novamente.");
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Qual jogo gostaria de ver em live?</h1>
        <p>
          {hasVoted
            ? "Você já votou! Não é mais possível votar novamente."
            : "Você tem 1 voto disponível"}
        </p>
      </header>
      <main className={styles.gallery}>
        {photos.map((photo, index) => {
          const votePercentage =
            totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0;
          return (
            <div
              key={photo.id}
              className={`${styles.photo} ${
                selectedPhoto === photo.id ? styles.selected : ""
              }`}
              onClick={() => setSelectedPhoto(photo.id)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={150}
                height={150}
                className="photo"
              />
              <div className={styles.photoTextContainer}>
                <p>{photo.alt}</p>
              </div>
              <p className={styles.percentual}>
                {Math.round(votePercentage)}% - {votes[index]} votos
              </p>
              <div className={styles.voteBarContainer}>
                <div
                  className={styles.voteBar}
                  style={{ width: `${votePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </main>
      <footer className={styles.footer}>
        <button
          onClick={handleVote}
          className={styles.voteButton}
          disabled={isVoting || hasVoted}
        >
          {isVoting ? "Enviando..." : "Vote"}
        </button>
      </footer>
    </div>
  );
};

export default Page;
