const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Nouveau endpoint Google AI pour Gemini 2.5 Flash
const MODEL = "models/gemini-2.5-flash";

export const getAIResponseFromAPI = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    console.error("API Key for Gemini is not set. Please check your .env.local file.");
    return "Désolé, la clé API de l'assistant n'est pas configurée. Veuillez contacter l'administrateur.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      return `Erreur API : ${errorData.error?.message || "inconnue"}`;
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "L'IA n'a pas pu générer de réponse."
    );
  } catch (error: any) {
    console.error("Erreur lors de la génération :", error);
    return "Désolé, un problème est survenu avec l'IA.";
  }
};
