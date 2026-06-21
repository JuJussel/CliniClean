import System from '../../models/system.model.js';

export default defineEventHandler(async (event) => {
    try {
        const { category, search } = getQuery(event);
        if (!category) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'category query parameter is required (allergies or medicationAllergies)'
            });
        }

        if (!search || search.trim().length === 0) {
            return {
                success: true,
                data: []
            };
        }

        // Search name or code within the array using unwind aggregation
        const results = await System.aggregate([
            { $match: { category: category } },
            { $unwind: '$data' },
            {
                $match: {
                    $or: [
                        { 'data.name': { $regex: search, $options: 'i' } },
                        { 'data.code': { $regex: search, $options: 'i' } }
                    ]
                }
            },
            { $limit: 50 },
            {
                $project: {
                    _id: 0,
                    code: '$data.code',
                    name: '$data.name',
                    company: '$data.company',
                    level: '$data.level',
                    parent: '$data.parent'
                }
            }
        ]);

        return {
            success: true,
            data: results
        };

    } catch (error) {
        if (error.statusCode) {
            throw error;
        }
        console.error('[Allergy Search API Error]', error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to search allergies'
        });
    }
});
