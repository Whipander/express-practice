import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Character } from "./ShowCharacters";

type UpdateCharFormProps = {
  onClose: () => void;
  setCharacterList: Dispatch<SetStateAction<Character[]>>;
  character: Character;
};

const UpdateCharForm = ({
  onClose,
  setCharacterList,
  character,
}: UpdateCharFormProps) => {
  const [name, setName] = useState(character.name);
  const [realName, setRealName] = useState(character.realName);
  const [universe, setUniverse] = useState(character.universe);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateChar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !realName || !universe) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedCharacter = {
        name,
        realName,
        universe,
      };

      const response = await fetch(
        `http://localhost:3000/characters/${character.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCharacter),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update character");
      }

      const updated = await response.json();

      setCharacterList((prev) =>
        prev.map((char) => (char.id === character.id ? updated : char))
      );

      onClose();
    } catch (err) {
      console.error("Error updating character:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update character"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdateChar}
      className="bg-neutral-900 text-gray-300 p-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col gap-5 rounded-2xl min-w-[400px]"
    >
      <span
        className="absolute top-3 right-5 cursor-pointer hover:text-red-500 transition-colors"
        onClick={onClose}
        tabIndex={0}
        role="button"
        aria-label="Close"
      >
        x
      </span>
      <div className="flex flex-col gap-2">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="eg. Spider-man"
          className="bg-neutral-600 p-2 rounded outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="realName">Real Name</label>
        <input
          type="text"
          name="realName"
          id="realName"
          placeholder="eg. Peter Parker"
          className="bg-neutral-600 p-2 rounded outline-none"
          value={realName}
          onChange={(e) => setRealName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="universe">Universe</label>
        <input
          type="text"
          name="universe"
          id="universe"
          placeholder="eg. Earth-616"
          className="bg-neutral-600 p-2 rounded outline-none"
          value={universe}
          onChange={(e) => setUniverse(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="bg-neutral-950 px-4 py-2 rounded cursor-pointer hover:bg-gray-300 hover:text-neutral-950 transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default UpdateCharForm;
