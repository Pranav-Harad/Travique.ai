const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateItinerary = async (data) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Act as an expert travel consultant.

    Create a professional, structured ${data.days}-day itinerary for a trip to ${data.destination}, starting from ${data.startLocation}.
    The trip is for ${data.travelers} traveler(s) using ${data.transportMode} as the primary mode of transportation.

    User Budget: ₹${data.budget}
    User Interests: ${data.interests}

    Format output clearly with:

    Day 1:
    Morning:
    Afternoon:
    Evening:

    Add:
    - Estimated cost per day
    - Recommended restaurants
    - Travel safety tips
    - Local transport options
    - Best time to visit spots

    **CRITICAL REQUIREMENT:** 
    For EVERY major location, city, or attraction mentioned, you MUST include a markdown image tag at the very end of the paragraph or bullet point describing it, on its own new line. DO NOT insert the image tag in the middle of a sentence.
    Use this exact format:
    ![Location Name, City](image)
    
    Replace "Location Name, City" with the actual specific name of the place (e.g., "Eiffel Tower, Paris" or "Central Park, New York"). Keep the url inside parentheses exactly as "(image)". This will act as a trigger for our frontend dynamically.

    Make it detailed but realistic.
    `;

  const result = await model.generateContent(prompt);

  return result.response.text();
};