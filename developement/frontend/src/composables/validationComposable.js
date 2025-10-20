import { isKatakana, isKana, isKanji, isRomaji } from "wanakana";


const validateKanji = (value, helpers) => {
    // Check if the value is defined and not null/empty before validation
    if (!value) {
        return value;
    }
    // Wanakana's isKanji returns true only if ALL characters are Kanji.
    if (!isKanji(value)) {
        // Use helpers.error() to return a Joi-formatted validation error.
        // 'kanji.invalid' is a custom error key we define here.
        return helpers.error('kanji.invalid', { value });
    }

    // Validation passed, return the original value
    return value;
};

const validateKana = (value, helpers) => {
    if (!value) return value;
    if (!isKana(value)) {
        return helpers.error('kana.invalid', { value });
    }
    return value;
};

const validateKatakana = (value, helpers) => {
    if (!value) return value;
    if (!isKatakana(value)) {
        return helpers.error('katakana.invalid', { value });
    }
    return value;
};

const validateRomaji = (value, helpers) => {
    if (!value) return value;
    if (!isRomaji(value)) {
        return helpers.error('romaji.invalid', { value });
    }
    return value;
};

export { validateKanji, validateKana, validateKatakana, validateRomaji };