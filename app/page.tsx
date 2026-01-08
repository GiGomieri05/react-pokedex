import PokedexClient from "./components/PokedexClient";
import PokemonHeader from "./components/PokedexHeader";
import { Sora } from "next/font/google";

const soraSans = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export default async function Home() {
  return (
    <div className={`${soraSans.variable} antialiased`}>
      <PokemonHeader />
      <div className="min-h-screen bg-white font-sans flex justify-center">
        <PokedexClient />
      </div>
    </div>
  );
}
