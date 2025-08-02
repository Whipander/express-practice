import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Character } from "./ShowCharacters";

type CreateCharFormProps = {
  onClose: () => void;
  setCharacterList: Dispatch<SetStateAction<Character[]>>;
};

const CreateCharForm = ({ onClose, setCharacterList }: CreateCharFormProps) => {
  const [name, setName] = useState("");
  const [realName, setRealName] = useState("");
  const [universe, setUniverse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateChar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !realName || !universe) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newCharacter = {
        name,
        realName,
        universe,
      };

      const response = await fetch("http://localhost:3000/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCharacter),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create character");
      }

      const createdCharacter = await response.json();

      setCharacterList((prev) => [...prev, createdCharacter]);

      onClose();
    } catch (err) {
      console.error("Error creating character:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create character"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateChar}
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
        {isSubmitting ? "Creating..." : "Create"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </form>
  );
};

export default CreateCharForm;
