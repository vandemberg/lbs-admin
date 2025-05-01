import { NextResponse } from "next/server";
import axios from "axios";

// Função para converter duração ISO 8601 para segundos
function isoDurationToSeconds(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  return hours * 3600 + minutes * 60 + seconds;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Código do YouTube não fornecido" },
        { status: 400 }
      );
    }

    // Fazer a requisição para a API do YouTube
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${code}&key=${process.env.YOUTUBE_API_KEY}&part=snippet,contentDetails`
    );

    if (!response.data.items || response.data.items.length === 0) {
      return NextResponse.json(
        { error: "Vídeo não encontrado" },
        { status: 404 }
      );
    }

    const videoData = response.data.items[0];
    const duration = isoDurationToSeconds(videoData.contentDetails.duration);

    // Estruturar os dados de resposta
    const responseData = {
      title: videoData.snippet.title,
      description: videoData.snippet.description,
      duration: duration,
      url: code,
      thumbnail:
        videoData.snippet.thumbnails.high?.url ||
        videoData.snippet.thumbnails.default?.url,
      channelTitle: videoData.snippet.channelTitle,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Erro ao buscar dados do YouTube:", error);
    return NextResponse.json(
      { error: "Erro ao processar a solicitação" },
      { status: 500 }
    );
  }
}
