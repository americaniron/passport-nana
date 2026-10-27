import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// The dev server must always listen on port 3000 (nginx reverse proxies 8080 -> 3000)
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BUSINESS_CONTEXT = `
You are the warm, highly knowledgeable, professional AI Concierge for "Kweenz Dream💭", founded by Ken'nyzhae Nathaniel (affectionately known by families as "Nana", "Passport Nanny", and "Your Favorite Nanny").
Contact phone: 305-409-6788 (Call or Text 24/7).
Operating Hours: 24-HOURS ON-CALL!!!
Primary service areas: San Francisco Bay Area (Civic Center, Opera Plaza, Hayes Valley, Mid-Market & surrounding Bay Area), Tampa FL, plus Domestic & International Travel (Passport Nanny travels worldwide with families).

Core Offerings & Pricing:
1. Nanny Services: Starts at $30/HR + $5/HR per additional child. 4-hour minimum. Includes daily care (feeding, bathing, dressing, diapers, routine), educational support (reading, crafts, games, tutoring), emotional support (confidence, manners), physical activities (outdoor/indoor play), household child tasks (meal clean up, toy tidying, laundry, safe transit), and ongoing communication with parents.
2. Babysitter & On-Call Sitter: Starts at $25/HR (+$5 per additional child, ranges up to $30/HR depending on tasks). 4-hour minimum. Ideal for evening routines, date nights, homework, and urgent care.
3. Passport Nanny (Travel Nanny): Full domestic & international accompaniment. Airport navigation, in-flight entertainment, time zone easing, hotel/resort supervision, conference & wedding childcare.
4. Picking up Baby From School: 4-hour session. Stress-free pickup, safe transit home, nutritious snack, homework coaching, and evening routine.
5. Adventure Day: 4-hour customized child excursion to museums, parks, hands-on science centers, or beaches tailored to child's curiosity.
6. 24-HR On-Call Pet Nanny: $120 / 24 hours. Day 1 sunrise walks at 5:00 AM, beach adventures, feeding, grooming, companionship, and medication administration.
7. Locks: Wash, Retwist & Style: Starts at $50 (varies by loc length & condition). Includes deep clarifying wash, deep conditioning, soothing scalp massage, blow-dry, palm rolling retwist, hooded dryer heat sealing, and scalp oil moisture treatment.
8. Freestyle Braids: $100 (approx. 6 hrs). Pain-free, gentle kid-friendly and adult protective styles.
9. Hair Consultation: $25 deposit credited directly to the final styling service.
10. Meet-N-Greet: 100% Free ($0.00 / 30 mins) in-person or video consultation for new families to get acquainted with Ken'nyzhae.

Tone: Warm, welcoming, respectful, reliable, parent-reassuring, and enthusiastic. Always encourage booking a free Meet-N-Greet or texting/calling 305-409-6788 for immediate on-call needs.
`;

// 1. Multi-turn Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage && (!messages || messages.length === 0)) {
      return res.status(400).json({ error: 'Missing message content' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful fallback response when API key is not yet set
      return res.json({
        text: `Welcome to Kweenz Dream💭! Ken'nyzhae ("Passport Nanny") is 24/7 on-call for nanny services ($30/hr), babysitting ($25/hr), travel care, pet sitting, and loctician care ($50 retwist). You can call or text directly at 305-409-6788 or use the booking tab to reserve your time slot!`,
        suggestions: [
          'Book a free Meet-N-Greet',
          'Calculate nanny pricing',
          'Tell me about Passport Nanny',
          'Loc wash & retwist details',
        ],
      });
    }

    // Convert client chat history to GenAI contents format
    const contents: any[] = [];
    if (Array.isArray(messages)) {
      for (const m of messages) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    }

    if (userMessage) {
      contents.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `${BUSINESS_CONTEXT}\nWhen answering, provide crisp, reassuring, clear answers. At the end, if relevant, suggest 2-3 quick next actions or questions. Format with friendly Markdown.`,
      },
    });

    res.json({
      text: response.text || 'How can I assist you with child care or hair styling today?',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error.message || 'Error processing chat message',
      fallbackText:
        "We're here for you 24/7! Feel free to call or text Ken'nyzhae directly at 305-409-6788 to book right away.",
    });
  }
});

// 2. Maps Grounding Endpoint
app.post('/api/maps-grounding', async (req, res) => {
  try {
    const { query, location, latLng } = req.body;
    const targetLocation = location || 'San Francisco, CA';
    const searchQuery = query || `Top family-friendly parks, interactive children museums, and adventure spots near ${targetLocation}`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `Here are great family adventure destinations in ${targetLocation}:`,
        places: [
          {
            title: "Children's Creativity Museum",
            address: '221 4th St, San Francisco, CA',
            uri: 'https://maps.google.com/?q=Childrens+Creativity+Museum+San+Francisco',
            category: 'Interactive Arts & Animation',
          },
          {
            title: 'California Academy of Sciences',
            address: '55 Music Concourse Dr, San Francisco, CA',
            uri: 'https://maps.google.com/?q=California+Academy+of+Sciences+San+Francisco',
            category: 'Aquarium, Rainforest & Planetarium',
          },
          {
            title: "Koret Children's Quarter & Carousel",
            address: 'Golden Gate Park, San Francisco, CA',
            uri: 'https://maps.google.com/?q=Koret+Childrens+Quarter+San+Francisco',
            category: 'Historic Playground & Park Excursion',
          },
        ],
      });
    }

    const toolConfig: any = {};
    if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
      toolConfig.retrievalConfig = { latLng };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Find 4 to 5 outstanding, safe, kid-friendly adventure spots, children's museums, or scenic parks in or near ${targetLocation} suitable for Kweenz Dream Adventure Days. Query: "${searchQuery}". Provide engaging details on why children adore each spot and key practical family tips.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const places: any[] = [];

    // Extract grounding URLs and details as required by Google Maps Grounding instructions
    for (const chunk of groundingChunks) {
      if ((chunk as any).maps) {
        const mapsData = (chunk as any).maps;
        places.push({
          title: mapsData.title || 'Location',
          uri: mapsData.uri || '',
          address: mapsData.address || '',
          snippet: mapsData.placeAnswerSources?.reviewSnippets?.[0] || '',
        });
      }
    }

    res.json({
      text: response.text || '',
      places,
    });
  } catch (error: any) {
    console.error('Maps grounding error:', error);
    res.status(500).json({
      error: error.message || 'Error executing maps grounding',
      places: [],
    });
  }
});

// 3. AI Care Plan & Loc Consultation Advisor
app.post('/api/care-advisor', async (req, res) => {
  try {
    const { type, details } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      if (type === 'hair') {
        return res.json({
          advice:
            'For optimal loc health: Cleanse thoroughly every 2-3 weeks with residue-free shampoo. Sleep with a satin bonnet or pillowcase. Maintain lightweight moisture with natural jojoba or rose water spray. Schedule retwists every 4-6 weeks to avoid over-manipulation.',
          recommendedService: 'Locks: Wash, Retwist & Style ($50+)',
          prepTips: [
            'Arrive with loose, unbraided locs for assessment',
            'Avoid heavy petroleum or wax buildup 48 hours prior',
            'Drink water to keep scalp hydrated from within',
          ],
        });
      }

      return res.json({
        advice:
          'Based on your family routine, a consistent 4-hour after-school or weekend block gives children the structured homework, active physical playtime, and calm evening unwinding they need.',
        recommendedService: 'Nanny Services ($30/hr)',
        estimatedHours: 4,
      });
    }

    const prompt =
      type === 'hair'
        ? `You are an expert master loctician at Kweenz Dream. Analyze the following hair consultation details: ${JSON.stringify(details)}. Provide: 1. Professional loc diagnosis & maintenance schedule. 2. Scalp hydration and wash routine. 3. Recommended Kweenz Dream service (Wash, Retwist & Style starting at $50, or Freestyle Braids $100). 4. Preparation instructions before their appointment.`
        : `You are an experienced elite childcare director at Kweenz Dream. Analyze this family's childcare needs: ${JSON.stringify(details)}. Provide: 1. A customized care routine and schedule. 2. Recommended activity themes (educational, emotional growth, physical play). 3. Suggested booking package and hours.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `${BUSINESS_CONTEXT}\nDeliver practical, highly personalized guidance formatted in structured Markdown with actionable checklists.`,
      },
    });

    res.json({
      advice: response.text,
    });
  } catch (error: any) {
    console.error('Care advisor error:', error);
    res.status(500).json({
      error: error.message || 'Error generating care advice',
    });
  }
});

// Mount Vite or serve static assets
async function startServer() {
  // Always serve public assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Fallback for SPA HTML requests
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kweenz Dream server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
