"use client";
import Image from "next/image";
import "./styles.scss";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [isPokemonShowing, setPokemonShowing] = useState(false);
  const [isWrongPokemon, setIsWrongPokemon] = useState(false);
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonSprite, setPokemonSprite] = useState("");
  const [officialName, setOfficialName] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [height, setHeight] = useState({ feet: 0, inches: 0 });
  const [ranking, setRanking] = useState("");
  const [weight, setWeight] = useState("");
  const [pokemonAudio, setPokemonAudio] = useState("");
  const [fetchStatus, setFetchStatus] = useState<"idle" | "valid" | "invalid">(
    "idle",
  );

  const findNewHeight = (tall: { height: number }) => {
    const feet = Math.floor(tall.height / 12);
    const inches = tall.height % 12;

    return { feet, inches };
  };

  async function fetchData() {
    setFetchStatus("idle"); // Reset first
    try {
      const newName = pokemonName.toLowerCase();
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${newName}`,
      );
      if (pokemonName.length > 0) {
        if (!response.ok) {
          setPokemonShowing(false);
          setIsWrongPokemon(true);
          setFetchStatus("invalid");
          throw new Error("Could not fetch. Pokemon doesn't seem to be valid");
        }

        setPokemonShowing(true);
        setIsWrongPokemon(false);
        setFetchStatus("valid");
        const data = await response.json();

        const newHeight = findNewHeight(data);

        setPokemonSprite(data.sprites.front_default ?? "");
        setOfficialName(data.name ?? "");
        setExperienceLevel(data.base_experience ?? "");
        setHeight(newHeight);
        setRanking(data.order ?? "");
        setWeight(data.weight ?? "");
        setPokemonAudio(data.cries?.latest ?? "");
      } else {
        setPokemonShowing(false);
        setIsWrongPokemon(false);
        setFetchStatus("invalid");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const playClickSound = () => {
    if (!pokemonAudio) return;

    const audio = new Audio(pokemonAudio);
    audio.volume = 0.5;
    void audio
      .play()
      .catch((err) => console.error("Could not play Pokemon cry", err));
  };
  // A reusable function that changes directions based on the 'direction' multiplier
  // Pass -1 to slide UP, and 1 to slide DOWN
  const getAnimationSettings = (direction: -1 | 1) => {
    const targetDistance = 150 * direction; // -50 for up, 50 for down
    const invalidDistance = 50 * direction; // -50 for up, 50 for down

    const animate =
      fetchStatus === "valid"
        ? { y: targetDistance }
        : fetchStatus === "invalid"
          ? { y: [null, invalidDistance, invalidDistance, 0] }
          : { y: 0 };

    const transition =
      fetchStatus === "invalid"
        ? { duration: 2.5, times: [0, 0.3, 0.6, 1], ease: "easeInOut" }
        : { duration: 0.4, ease: "easeOut" };

    return { animate, transition };
  };
  useEffect(() => {
    if (pokemonName.length === 0) {
      fetchData();
    }
  }, [pokemonName]);
  return (
    <main className="container">
      <div className="d-flex gap-4">
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          className="border p-2 rounded text-black"
          placeholder="Enter Pokemon name"
        />
        <button className="" onClick={fetchData}>
          Fetch Pokemon
        </button>
      </div>
      <section className="pokeball-section pokeball-section__section d-flex flex-column">
        <p className="pokeball-section__title">
          <strong><span className="wavy-color-text">{pokemonName}</span> I CHOOSE
          YOU!!</strong>
        </p>
        <div className="pokeball">
          <motion.div {...getAnimationSettings(-1)} className="pokeball__top">
            <div className="circle"></div>
          </motion.div>

          {pokemonSprite && isPokemonShowing ? (
            <div className="d-flex pokeball-section__ball justify-content-center align-items-center">
              <div className="pokeball-section__pokemon pokemon">
                <Image
                  src={pokemonSprite}
                  alt={`Sprite image of Pokemon ${pokemonName}`}
                  width={250}
                  height={250}
                  className="pokemon__image"
                />
              </div>
              <aside className="pokemon__stats">
                <ul>
                  <li>
                    <strong>Name: </strong>&quot;{officialName}&quot;
                  </li>
                  <li>
                    <strong>Experience Level:</strong> {experienceLevel}
                  </li>
                  <li>
                    <strong>Height:</strong>{" "}
                    {`${height.feet}' ${height.inches}"`}
                  </li>
                  <li>
                    <strong>Current Ranking:</strong> {ranking}
                  </li>
                  <li>
                    <strong>weight:</strong> {weight}lbs
                  </li>
                  <li>
                    <button
                      onClick={playClickSound}
                      className="p-2 border rounded"
                      disabled={!pokemonAudio}
                    >
                      Battle Cry
                    </button>
                  </li>
                </ul>
              </aside>
            </div>
          ) : (
            <div className="d-flex pokeball-section__ball text-align-center justify-content-center w-100">
              <h2 className="pokeball__warning text-center">
                {!isWrongPokemon
                  ? `No Pokemon Selected`
                  : `Please Enter a Valid Pokemon Name!`}
              </h2>
            </div>
          )}
          <motion.div {...getAnimationSettings(1)} className="pokeball__bottom">
            <div className="circle"></div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
