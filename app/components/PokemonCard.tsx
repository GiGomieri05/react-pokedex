import Image from "next/image";
import { Star } from "lucide-react";

type PokemonCardProps = {
  name: string;
  abilities: string;
  imageUrl: string;
};

const PokemonCard = ({ name, abilities, imageUrl }: PokemonCardProps) => {
  return (
    <div className="bg-red-600 border-2 border-red-800 rounded-xl m-1 p-6 w-xl max-w-full">
      <div className="flex justify-between items-center align-middle flex-row">
        <div className="flex justify-baseline items-center-safe align-middle">
          <Image
            src={imageUrl}
            alt={name}
            width={96}
            height={96}
            className="rounded-xl mr-4"
          />
          <div className="font-bold text-lg">{name}</div>
        </div>
        <Star className="self-start text-gray-300" width={32} height={32} />
      </div>
      <div className="bg-white rounded-lg mt-4 p-4 w-full text-gray-900 text-sm">
        <span className="font-bold">Habilidades:</span> {abilities}
      </div>
    </div>
  );
};

export default PokemonCard;
