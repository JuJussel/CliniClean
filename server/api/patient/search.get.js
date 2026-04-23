import Patient from '../../models/patient.model'
import japUtils from 'japanese-string-utils';


export default defineEventHandler(async (event) => {

    try {

        const { id, family, given, familyKana, givenKana, query } = getQuery(event)

        let mongoQuery = { $or: [] };
        // If query parameter exists, use it for general search
        if (query) {
            const searchValue = japUtils.toFullwidth(query);

            mongoQuery.$or = [
                { id: new RegExp(query, 'i') },
                { 'name.family': new RegExp(searchValue, 'i') },
                { 'name.given': new RegExp(searchValue, 'i') },
                { 'name.familyKana': new RegExp(searchValue, 'i') },
                { 'name.givenKana': new RegExp(searchValue, 'i') },
                // Add concatenated name matches
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ['$name.family', '$name.given'] },
                            regex: searchValue,
                            options: 'i'
                        }
                    }
                },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ['$name.familyKana', '$name.givenKana'] },
                            regex: searchValue,
                            options: 'i'
                        }
                    }
                }
            ];

        } else {
            // Handle specific field search
            if (id) {
                mongoQuery.$or.push({ id: new RegExp(id, 'i') });
            }

            // Handle kanji name match
            if (family || given) {
                const nameMatch = {};
                if (family) {
                    nameMatch['name.family'] = new RegExp(japUtils.toFullwidth(family), 'i');
                }
                if (given) {
                    nameMatch['name.given'] = new RegExp(japUtils.toFullwidth(given), 'i');
                }
                if (Object.keys(nameMatch).length > 0) {
                    mongoQuery.$or.push(nameMatch);
                }
            }

            // Handle kana name match
            if (familyKana || givenKana) {
                const kanaMatch = {};
                if (familyKana) {
                    kanaMatch['name.familyKana'] = new RegExp(japUtils.toFullwidth(familyKana), 'i');
                }
                if (givenKana) {
                    kanaMatch['name.givenKana'] = new RegExp(japUtils.toFullwidth(givenKana), 'i');
                }
                if (Object.keys(kanaMatch).length > 0) {
                    mongoQuery.$or.push(kanaMatch);
                }
            }
        }

        // If no valid search criteria were provided, return empty array
        if (mongoQuery.$or.length === 0) {
            return res.send([]);
        }

        const patients = await Patient.find(mongoQuery)
            .select('name birthDate gender type id')
            .lean()
            .exec();

        return { patients }



    } catch (error) {
        throw createError({
            status: 500,
            message: 'An error occurred while searching for patients.',
        });
    }


})