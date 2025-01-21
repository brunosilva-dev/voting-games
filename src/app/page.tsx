"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";

const Page: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

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

  const [votes, setVotes] = useState<number[]>(
    new Array(photos.length).fill(0)
  ); // Contador de votos por foto

  const handleVote = () => {
    if (selectedPhoto !== null) {
      // Atualiza o contador de votos
      const newVotes = [...votes];
      newVotes[selectedPhoto - 1] += 1; // Adiciona 1 voto à foto selecionada
      setVotes(newVotes);

      alert(`Você votou no jogo: ${photos[selectedPhoto - 1].alt}`);
    } else {
      alert("Por favor, selecione uma foto antes de votar!");
    }
  };

  // Calcular a porcentagem de votos para cada foto
  const totalVotes = votes.reduce((acc, vote) => acc + vote, 0);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Qual jogo gostaria de ver em live?</h1>
        <p>Você tem 1 voto disponível</p>
      </header>
      <main className={styles.gallery}>
        {photos.map((photo, index) => {
          const votePercentage =
            totalVotes > 0 ? (votes[index] / totalVotes) * 100 : 0; // Calcula a porcentagem de votos
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
        <button onClick={handleVote} className={styles.voteButton}>
          Vote
        </button>
      </footer>
    </div>
  );
};

export default Page;
