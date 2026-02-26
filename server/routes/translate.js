const express = require('express');
const router = express.Router();
const { HfInference } = require('@huggingface/inference');

const hf = new HfInference(process.env.HUGGINGFACE_TOKEN);

router.post('/', async (req, res) => {
    try {
        const { text, target_lang } = req.body;

        if (!text || !target_lang) {
            return res.status(400).json({ error: 'Text and target_lang are required' });
        }

        // Map simple language codes to Helsinki-NLP models
        const modelMap = {
            'hin_Deva': 'Helsinki-NLP/opus-mt-en-hi',
            'ben_Beng': 'Helsinki-NLP/opus-mt-en-bn',
            'tam_Taml': 'Helsinki-NLP/opus-mt-en-ta',
            'urd_Arab': 'Helsinki-NLP/opus-mt-en-ur',
            'pan_Guru': 'Helsinki-NLP/opus-mt-en-mul' // Multi-lang fallback for others if needed
        };

        const targetModel = modelMap[target_lang] || 'Helsinki-NLP/opus-mt-en-hi';

        // Hugging Face models have a token limit (usually 512 tokens).
        // 1. Split the itinerary into paragraphs
        const paragraphs = text.split('\n\n');
        let translatedText = '';

        // 2. Translate paragraph by paragraph
        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) {
                translatedText += '\n\n';
                continue;
            }

            // Small delay to avoid rate limiting if there are many paragraphs
            await new Promise(r => setTimeout(r, 200));

            try {
                const translation = await hf.translation({
                    model: targetModel,
                    inputs: paragraph
                });
                translatedText += translation.translation_text + '\n\n';
            } catch (chunkError) {
                console.error("Chunk translation failed, falling back to original:", chunkError.message);
                translatedText += paragraph + '\n\n'; // fallback to English for that chunk
            }
        }

        res.json({ translatedText: translatedText.trim() });
    } catch (error) {
        console.error('Translation Error Details:', error.message, error.response?.statusText);
        res.status(500).json({ error: 'Server error during translation: ' + error.message });
    }
});

module.exports = router;
