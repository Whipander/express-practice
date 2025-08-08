import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
const DOG_API_URL = "https://dog.ceo/api/breeds/image/random";

type CharacterProps = {
  id: number;
  name: string;
  realName: string;
  universe: string;
  setEdit:Dispatch<SetStateAction<boolean>>;
 
};

const CharacterCard = ({ id, name, realName, universe, setEdit}: CharacterProps) => {
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
    <div onClick={() => setEdit(true)} className="flex flex-col justify-between bg-neutral-900 basis-[300px] p-5 rounded-2xl shadow-2xs text-gray-300 relative hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer">
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
