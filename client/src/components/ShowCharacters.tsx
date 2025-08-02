import { useEffect, useState } from "react";
import SuperHeroCard from "./CharacterCard";
import CreateCharForm from "./CreateCharForm";
export type Character = {
  id: number;
  name: string;
  realName: string;
  universe: string;
};

const ShowCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateCharacter, setShowCreateCharacter] = useState(false);
  const handleShowCreateCharacter = () => {
    setShowCreateCharacter(!showCreateCharacter);
  };

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
  }, [characters]);
  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-9/12 p-8 space-y-5">
      <div className="flex justify-end-safe">
        <button
          className="bg-neutral-900 text-gray-200 px-4 py-2 rounded hover:bg-gray-200 hover:text-neutral-900 transition-colors cursor-pointer"
          onClick={handleShowCreateCharacter}
        >
          Add +
        </button>
      </div>
      {showCreateCharacter && (
        <div className="w-screen h-screen bg-black/80 fixed top-0 left-0 z-50">
          <CreateCharForm
            onClose={handleShowCreateCharacter}
            setCharacterList={setCharacters}
          />
        </div>
      )}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-5">
        {characters.map((el: Character) => {
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
    </div>
  );
};

export default ShowCharacters;
