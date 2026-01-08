"use client";

import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard";
import { CircularProgress } from "@mui/material";

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

  const [favorites, setFavorites] = useState<string[]>([]);

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

      setPokemons((prev) => {
        const merged = [...prev, ...data.items]; // tudo junto
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unique = new Map(merged.map((p: any) => [p.name, p])); // sobrescreve os repetidos pelo mesmo nome
        return Array.from(unique.values()); // vira uma lista sem duplicados
      });

      setNextUrl(data.nextUrl);
    } catch (err) {
      setError("Falha ao carregar pokemons...");
    } finally {
      setIsLoading(false); // sucesso ou erro
    }
  }

  useEffect(() => {
    // carregar os pokemons favorites salvos (favoritos estrela)
    const saved = localStorage.getItem("favorites"); // string | null
    if (saved) {
      // se existir
      try {
        const parsed = JSON.parse(saved); // converte o json para array
        if (Array.isArray(parsed)) {
          setFavorites(parsed); // salva em favorites
        }
      } catch {
        // se der erro, ignora e comeca vazio
        setFavorites([]);
      }
    }

    // carrega primeira pagina de pokemons
    loadMore();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites)); // salva o array como JSON no LocalStorage
  }, [favorites]);

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

  function toggleFavorite(name: string) {
    setFavorites((prev) => {
      if (prev.includes(name)) {
        return prev.filter((n) => n !== name); // se o valor ja tinha, tira
      } else {
        return [...prev, name]; // se nao tinha, inclui
        // sempre retorna um array novo
      }
    });
  }

  return (
    <div className="flex flex-col align-top items-center">
      <div className="grid gap-4 p-6 w-full h-fit max-w-5xl max-h-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pokemons.map((p) => (
          <PokemonCard
            key={p.name}
            name={p.name}
            abilities={p.abilities}
            imageUrl={p.imageUrl}
            isFavorite={favorites.includes(p.name)} // se esta ou nao favoritado
            onToggleFavorite={() => toggleFavorite(p.name)} // chama o toggle
          />
        ))}

        <div ref={sentinelRef} className="h-1"></div>
      </div>
      {isLoading && <CircularProgress className="m-20" />}
    </div>
  );

  // abre a pagina, monta PokedexClient, useEffect roda, chama loadMore
}
