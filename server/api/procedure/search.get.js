import japUtils from 'japanese-string-utils';
import Procedure from "../../models/procedure.model.js";

export default defineEventHandler(async (event) => {
    try {
        const { cat, search } = getQuery(event)
        const searchKana = japUtils.toKatakana(search) + '%';

        if (!cat || !search) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'Category and search query are required'
            });
        }

        let query = {
            $and: [
                { srykbn: String(cat) },
                {
                    $or: [
                        { name: { $regex: ".*" + search + ".*" } },
                        { kananame: { $regex: ".*" + searchKana + ".*" } },
                        { formalname: { $regex: ".*" + search + ".*" } },
                        { formalname: { $regex: ".*" + searchKana + ".*" } },
                        { srycd: search }
                    ]
                }
            ]
        };

        if (cat === "212") {
            query.$and.push({
                $or: [
                    { ykzkbn: '1' },
                    { ykzkbn: '6' }
                ]
            })
        }

        if (cat === "310") {
            query.$and.push({ ykzkbn: '4' })
        }


        const results = await Procedure.find(query,
            ('srycd name formalname taniname ten procedureClass'))
            .populate('procedureClass', 'name')
            .lean()

        return {
            success: true,
            data: results
        }


    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Medication Search API Error]', {
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while searching for medications'
        })
    }
})