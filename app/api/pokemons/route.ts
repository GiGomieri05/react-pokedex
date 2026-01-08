type PokemonCardData = {
  name: string;
  abilities: string;
  imageUrl: string;
};

type PokeListResponse = {
  next: string | null;
  results: Array<{ name: string; url: string }>;
};

export async function GET(request: Request) {
  try {
    // le o "cursor" (tipo um ponteiro pra proxima url) que o client vai mandar dps
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");

    // define qual url vai usar pra busca
    // se veio cursor -> usa ele
    // senao -> primeira pagina, limit de 20
    const listUrl =
      cursor ?? "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";

    // busca a lista paginada
    const listRes = await fetch(listUrl);
    if (!listRes.ok) {
      // deu algum erro
      return Response.json(
        { error: "Falha ao buscar lista de pokemons da PokeAPI..." },
        { status: 502 },
      );
    }

    const listData = (await listRes.json()) as PokeListResponse;

    // pra cada pokemon da lista, busca o detalhe (fan-out)
    // usa um promisse.all pra fazer 20 fetches em paralelo (igual no flutter)
    const items: PokemonCardData[] = await Promise.all(
      listData.results.map(async (p) => {
        // detalhes de cada pokemon
        const detailRes = await fetch(p.url);
        if (!detailRes.ok) {
          // se algum detalhe falhar, ainda da um retorno, so que vazio
          return {
            name: p.name,
            abilities: "N/A",
            imageUrl: "",
          };
        }

        const detail = await detailRes.json();

        // pega o array de habilidades e transforma em um string formatado
        const abilities: string = (detail.abilities ?? [])
          .map((a: any) => a?.ability?.name)
          .filter(Boolean)
          .join(", ");

        // abilities =
        //   String(abilities).charAt(0).toUpperCase() +
        //   String(abilities).slice(1);

        // escolhe a imagem official arwork, se nao cai no front default
        const imageUrl: string =
          detail?.sprites?.other?.["official-artwork"]?.front_default ??
          detail?.sprites?.front_default ??
          "";

        return {
          name: p.name,
          abilities: abilities || "N/A",
          imageUrl,
        };
      }),
    );

    // devolve em um formato que o pokedex client espera
    return Response.json({
      items,
      nextUrl: listData.next, // url da proxima pagina ou null
    });
  } catch (err) {
    return Response.json(
      { error: "Erro interno na API /api/pokemons" },
      { status: 500 },
    );
  }
}
