import { useEffect, useState } from "react";
import SuperHeroCard from "./SuperHeroCard";
export type SuperHero = {
  id: number;
  name: string;
  realName: string;
  universe: string;
};

const ShowSuperHero = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/characters");
        if (!response) {
          throw new Error("Could not fetch characters");
        }
        const data = await response.json();
        setCharacters(data.characters);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  console.log(characters);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div>
        {characters.map((el: SuperHero) => {
          return (
            <SuperHeroCard
              key={el.id}
              name={el.name}
              realName={el.realName}
              universe={el.universe}
              id={el.id}
            />
          );
        })}
      </div>
    </>
  );
};

export default ShowSuperHero;
