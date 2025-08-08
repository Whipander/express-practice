import { useEffect, useState } from "react";
const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

type CharacterProps = {
  id: number;
  name: string;
  realName: string;
  universe: string;
  setEdit: () => void;
  onDelete: (id: number) => void;
};

const CharacterCard = ({
  id,
  name,
  realName,
  universe,
  setEdit,
  onDelete,
}: CharacterProps) => {
  const [dogImage, setDogImage] = useState<string>("");
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  useEffect(() => {
    const fetchDogImage = async () => {
      try {
        const response = await fetch(DOG_API_URL);
        const data = await response.json();
        setDogImage(data.message);
      } catch (err) {
        console.error(err);
        setImgError(true);
      } finally {
        setImgLoading(false);
      }
    };
    fetchDogImage();
  }, []);

  return (
    <div
      onClick={() => setEdit()}
      className="flex flex-col justify-between bg-neutral-900 basis-[300px] p-5 rounded-2xl shadow-2xs text-gray-300 relative hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (
            window.confirm("Are you sure you want to delete this character?")
          ) {
            onDelete(id);
          }
        }}
        className="absolute bottom-5 right-5 bg-red-500 text-white px-2 py-1 rounded-full z-10 hover:bg-red-600 transition-colors aspect-square cursor-pointer"
        aria-label="Delete character"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e3e3e3"
        >
          <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
        </svg>
      </button>
      <p className="absolute top-2 right-5 bg-gray-300 text-neutral-900 px-2 rounded-full z-10">
        #{String(id).padStart(3, "0")}
      </p>
      {imgLoading ? (
        <div className="aspect-square w-full animate-pulse bg-neutral-600 rounded-xl"></div>
      ) : imgError ? (
        <div className="aspect-square w-full bg-neutral-700 flex justify-center items-center rounded-xl">
          Could not load image
        </div>
      ) : (
        <img
          src={dogImage}
          alt="Dog image"
          className="object-cover aspect-square w-full rounded-xl"
        />
      )}
      <div>
        <h2 className="text-4xl mt-2">{name}</h2>
        <h3 className="text-gray-400">{realName}</h3>
      </div>
      <p className="mt-5">Universe: {universe}</p>
    </div>
  );
};

export default CharacterCard;
