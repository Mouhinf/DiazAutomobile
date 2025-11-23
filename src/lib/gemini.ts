// Importez axios si vous préférez, mais fetch est suffisant pour cet exemple
// import axios from 'axios';

// Récupérez votre clé API de Google AI Studio depuis les variables d'environnement
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const getAIResponseFromAPI = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    console.error("API Key for Gemini is not set. Please check your .env.local file.");
    return "Désolé, la clé API de l'assistant n'est pas configurée. Veuillez contacter l'administrateur.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`, // Changement ici : gemini-pro
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY, // En-tête correct pour la clé API
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`API request failed with status ${response.status}: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "L'IA n'a pas pu générer de réponse.";
  } catch (error: any) {
    console.error("Erreur lors de la génération de la réponse de l'IA:", error);
    return "Désolé, je rencontre un problème technique et ne peux pas répondre pour le moment. Veuillez réessayer plus tard.";
  }
};