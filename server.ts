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

// Prevent server process termination on unexpected async rejections
process.on('uncaughtException', (err) => {
  console.error('[SERVER CRASH PREVENTED] Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[SERVER CRASH PREVENTED] Unhandled rejection:', reason);
});

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

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction: `${BUSINESS_CONTEXT}\nWhen answering, provide crisp, reassuring, clear answers. At the end, if relevant, suggest 2-3 quick next actions or questions. Format with friendly Markdown.`,
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: `${BUSINESS_CONTEXT}\nWhen answering, provide crisp, reassuring, clear answers. At the end, if relevant, suggest 2-3 quick next actions or questions. Format with friendly Markdown.`,
        },
      });
    }

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

// 2. Maps Grounding & Live Adventure Finder Endpoint
app.post('/api/maps-grounding', async (req, res) => {
  try {
    const { query, location, latLng } = req.body;
    const targetLocation = (location && location.trim()) || 'San Francisco, CA';
    const searchQuery =
      (query && query.trim()) ||
      `Top family-friendly parks, interactive children museums, and adventure spots near ${targetLocation}`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        text: `Here are great family adventure destinations in ${targetLocation} curated by Passport Nana:`,
        places: [
          {
            title: "Children's Creativity Museum",
            address: '221 4th St, San Francisco, CA 94103',
            uri: 'https://www.google.com/maps/search/?api=1&query=Childrens+Creativity+Museum+San+Francisco',
            category: 'Interactive Arts & Animation',
            description: 'Hands-on multimedia art and technology experience designed specifically for toddlers and young children.',
            kidHighlight: 'Stop-motion animation studio where kids direct their own claymation films!',
            parentTip: 'Convenient parking next door at Yerba Buena Gardens, stroller friendly.',
          },
          {
            title: 'California Academy of Sciences',
            address: '55 Music Concourse Dr, San Francisco, CA 94118',
            uri: 'https://www.google.com/maps/search/?api=1&query=California+Academy+of+Sciences+San+Francisco',
            category: 'Aquarium, Rainforest & Planetarium',
            description: 'A 4-story living rainforest, Steinhart Aquarium, planetarium, and natural history museum all under a living roof.',
            kidHighlight: 'Walk through the sphere rainforest with free-flying tropical butterflies!',
            parentTip: 'Reserve Planetarium passes upon arrival at the kiosk; cafe has healthy organic kid meals.',
          },
          {
            title: "Koret Children's Quarter & Historic Carousel",
            address: '320 Bowling Green Dr, San Francisco, CA 94117',
            uri: 'https://www.google.com/maps/search/?api=1&query=Koret+Childrens+Quarter+San+Francisco',
            category: 'Historic Playground & Carousel Excursion',
            description: 'One of the oldest public children playgrounds in the US featuring huge slides, climbing rope pyramid, and 1914 Herschell-Spillman carousel.',
            kidHighlight: 'Sliding down the classic concrete slides on cardboard boxes!',
            parentTip: 'Bring your own cardboard or borrow from other families; adjacent to lawn picnic area.',
          },
          {
            title: 'Bay Area Discovery Museum',
            address: '557 McReynolds Rd, Sausalito, CA 94965',
            uri: 'https://www.google.com/maps/search/?api=1&query=Bay+Area+Discovery+Museum',
            category: 'STEM & Outdoor Coastal Play',
            description: 'Waterfront museum at Fort Baker at the foot of the Golden Gate Bridge, with indoor-outdoor art and engineering spaces.',
            kidHighlight: 'Lookout Cove with life-sized fishing boat and outdoor tide pool gravel play.',
            parentTip: 'Extra change of clothes is recommended for splash and mud exploration.',
          },
        ],
        source: 'curated-standby',
      });
    }

    // Step 1: Try Native Google Maps Tool Grounding with Gemini
    let mapsToolWorked = false;
    try {
      const toolConfig: any = {};
      if (latLng && typeof latLng.latitude === 'number' && typeof latLng.longitude === 'number') {
        toolConfig.retrievalConfig = { latLng };
      }

      // Try gemini-3.8-flash first with googleMaps tool
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Find 4 to 5 outstanding, safe, kid-friendly adventure spots, children's museums, or scenic parks in or near ${targetLocation}. Query: "${searchQuery}". Provide engaging details on why children adore each spot and key practical family tips.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const places: any[] = [];

      for (const chunk of groundingChunks) {
        if ((chunk as any).maps) {
          const mapsData = (chunk as any).maps;
          places.push({
            title: mapsData.title || 'Adventure Spot',
            uri:
              mapsData.uri ||
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((mapsData.title || '') + ' ' + targetLocation)}`,
            address: mapsData.address || targetLocation,
            category: 'Google Maps Verified Destination',
            description:
              mapsData.placeAnswerSources?.reviewSnippets?.[0] ||
              'Verified family adventure destination with live Google Maps place details.',
            kidHighlight: 'Verified kid-friendly destination with direct Google Maps navigation.',
            parentTip: 'Live Google Maps place with verified directions and hours.',
          });
        }
      }

      if (places.length > 0) {
        mapsToolWorked = true;
        return res.json({
          text: response.text || `Found ${places.length} real Google Maps grounded adventure spots in ${targetLocation}:`,
          places,
          source: 'google-maps-grounding',
          model: 'gemini-3.8-flash',
        });
      }
    } catch (toolError: any) {
      console.warn('Google Maps tool grounding unavailable or rate-limited. Falling back to live Gemini AI model generation:', toolError?.message || toolError);
    }

    // Step 2: Live Gemini Model Generation (Works 100% reliably, structured JSON with real Google Maps search links)
    const prompt = `You are the expert local adventure guide for Passport Nana (founded by Ken'nyzhae Nathaniel, offering 24/7 on-call childcare and guided child adventure days).
The family is asking for child-friendly adventure recommendations for:
Location / Area: "${targetLocation}"
Activity Preference: "${searchQuery}"

Provide 4 to 5 real, exciting, safe places (parks, museums, play centers, beaches, hands-on science hubs) located in or very close to "${targetLocation}".

Format your response as valid JSON with this exact schema:
{
  "intro": "A warm, 2-sentence encouraging note from Nana about exploring this area with little ones.",
  "places": [
    {
      "title": "Exact Official Venue / Park Name",
      "address": "Accurate street address or park neighborhood in that area",
      "category": "e.g. Children's Museum, Historic Carousel, Nature Park, Splash Zone",
      "description": "2-3 sentences explaining why kids adore this adventure and what makes it special.",
      "kidHighlight": "1-sentence exciting detail that kids love (e.g. climbing the giant rope dome, petting stingrays)",
      "parentTip": "1 practical parent tip (e.g. best parking location, stroller friendly, bring a towel)"
    }
  ]
}

Return ONLY valid JSON. No preamble, no backticks.`;

    // Try gemini-3.1-flash-lite (fast, high availability), fallback to gemini-3.8-flash
    let rawText = '';
    let usedModel = 'gemini-3.1-flash-lite';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
      });
      rawText = response.text || '';
    } catch (liteErr) {
      console.warn('gemini-3.1-flash-lite failed, trying gemini-3.8-flash:', liteErr);
      usedModel = 'gemini-3.8-flash';
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
      rawText = response.text || '';
    }

    // Clean markdown code blocks if the model wrapped them
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    let parsed: any = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {}
      }
    }

    if (parsed && Array.isArray(parsed.places) && parsed.places.length > 0) {
      const places = parsed.places.map((p: any) => ({
        title: p.title || 'Adventure Destination',
        address: p.address || targetLocation,
        category: p.category || 'Family Adventure Spot',
        description: p.description || '',
        kidHighlight: p.kidHighlight || '',
        parentTip: p.parentTip || '',
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((p.title || '') + ' ' + (p.address || targetLocation))}`,
      }));

      return res.json({
        text: parsed.intro || `Here are top family-friendly adventure destinations in ${targetLocation} powered by live Gemini AI:`,
        places,
        source: 'live-gemini-model',
        model: usedModel,
      });
    }

    // Fallback if parsing failed
    return res.json({
      text: rawText || `Here are great family adventure destinations in ${targetLocation}:`,
      places: [
        {
          title: `Adventure Exploration in ${targetLocation}`,
          address: targetLocation,
          uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery + ' ' + targetLocation)}`,
          category: 'Family Exploration',
          description: `Customized 4-hour child adventure day in ${targetLocation} organized door-to-door by Ken'nyzhae Nathaniel.`,
          kidHighlight: 'Personalized to your child interests with interactive games and snacks.',
          parentTip: 'Call or text (305) 409-6788 to arrange door-to-door escort.',
        },
      ],
      source: 'live-gemini-text',
      model: usedModel,
    });
  } catch (error: any) {
    console.error('Maps grounding error:', error);
    res.status(200).json({
      text: `Ken'nyzhae is ready to lead adventure days in ${req.body?.location || 'San Francisco & Tampa'}! Call (305) 409-6788 24/7 to design your child's custom itinerary.`,
      places: [
        {
          title: "Golden Gate Park Children's Quarter",
          address: 'Golden Gate Park, San Francisco, CA',
          uri: 'https://www.google.com/maps/search/?api=1&query=Golden+Gate+Park+Childrens+Quarter',
          category: 'Outdoor Playground & Carousel',
          description: 'Beloved classic park with giant historic slides and sprawling lawns.',
          kidHighlight: 'Historic 1914 Carousel ride and concrete slides!',
          parentTip: 'Great on sunny afternoons; free parking along Bowling Green Dr.',
        },
      ],
      source: 'resilient-fallback',
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

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: `${BUSINESS_CONTEXT}\nDeliver practical, highly personalized guidance formatted in structured Markdown with actionable checklists.`,
        },
      });
    } catch {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `${BUSINESS_CONTEXT}\nDeliver practical, highly personalized guidance formatted in structured Markdown with actionable checklists.`,
        },
      });
    }

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
