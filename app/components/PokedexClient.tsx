"use client";

import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard";

type PokemonCardData = {
  name: string;
  abilities: string;
  imageUrl: string;
};

export default function PokedexClient() {
  const [pokemons, setPokemons] = useState<PokemonCardData[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // useState, useEffect e IntersectionObserver

  async function loadMore() {
    if (isLoading == true || nextUrl === null) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // monta a url que vai chamar agora
      const apiUrl =
        nextUrl === ""
          ? "/api/pokemons"
          : "/api/pokemons?cursor=" + encodeURIComponent(nextUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Erro ao buscar pokemons");
      }

      const data = await response.json(); // atualizar pokemons e nextUrl

      // setPokemons(prev => [...prev, ...newPokemon])
      if (!Array.isArray(data.items))
        throw new Error("Resposta invalida da API");

      setPokemons((prev) => [...prev, ...data.items]);
      setNextUrl(data.nextUrl);
    } catch (err) {
      setError("Falha ao carregar pokemons...");
    } finally {
      setIsLoading(false); // sucesso ou erro
    }
  }

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const el = sentinelRef.current; // elemento real do dom
    if (!el) return; //se ele nao existir ainda, nao faz nada (primeiro render)

    // observer
    // recebe um callback que roda quando o elemento entra ou sai da tela
    // observa o el (elemento do dom)
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // navegador dizendo: "oi, ele apareceu :)"
        loadMore(); //quero mais dados

        // console.log("sentinela bateu");
      }
    });

    observer.observe(el); // fica de olho no el

    return () => {
      observer.disconnect(); // limpa quando desmontar
    };
  }, [isLoading, nextUrl]);

  return (
    <div className="grid gap-4 p-6 w-full h-fit max-w-5xl max-h-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {pokemons.map((p) => (
        <PokemonCard
          key={p.name}
          name={p.name}
          abilities={p.abilities}
          imageUrl={p.imageUrl}
        />
      ))}

      {isLoading && (
        <div className="font-bold text-2xl self-center text-black">
          Carregando...
        </div>
      )}

      <div ref={sentinelRef} className="h-1"></div>
    </div>
  );

  // abre a pagina, monta PokedexClient, useEffect roda, chama loadMore
}
