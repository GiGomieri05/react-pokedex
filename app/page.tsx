import PokemonHeader from "./components/PokedexHeader";
import PokemonCard from "./components/PokemonCard";
import { Sora } from "next/font/google";

const soraSans = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export default function Home() {
  const pokemons = [
    {
      name: "Charmander",
      abilities: "Fogo",
      imageUrl: "https://picsum.photos/202",
    },
    {
      name: "Bulbasaur",
      abilities: "Planta",
      imageUrl: "https://picsum.photos/203",
    },
    {
      name: "Pikachu",
      abilities: "Eletricidade",
      imageUrl: "https://picsum.photos/201",
    },
    {
      name: "Squirtle",
      abilities: "Água",
      imageUrl: "https://picsum.photos/204",
    },
    {
      name: "Metapod",
      abilities: "Inseto",
      imageUrl: "https://picsum.photos/205",
    },
  ];

  const abilities = ["Fogo", "Planta", "Eletricidade", "Agua", "Inseto"];

  // {`${geistSans.variable} ${geistMono.variable} antialiased`}
  return (
    <div className={`${soraSans.variable} antialiased`}>
      <PokemonHeader />
      <div className="min-h-screen bg-white font-sans flex justify-center">
        <div className="grid gap-4 p-6 w-full h-fit max-w-5xl max-h-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {pokemons.map((p) => (
            <PokemonCard
              key={p.name}
              name={p.name}
              abilities={p.abilities}
              imageUrl={p.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
