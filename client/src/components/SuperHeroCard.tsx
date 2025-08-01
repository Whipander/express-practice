import type { SuperHero } from "./ShowSuperHero";

const SuperHeroCard = ({ id, name, realName, universe }: SuperHero) => {
  return (
    <div>
      <p>{id}</p>
      <h2>{name}</h2>
      <h3>{realName}</h3>
      <p>{universe}</p>
    </div>
  );
};

export default SuperHeroCard;
