import japUtils from 'japanese-string-utils';

export default defineEventHandler(async (event) => {
    try {
        const { cat, search } = getQuery(event)

        const searchCode = search
        const searchName = search + '%';
        const searchNameKana = japUtils.toKatakana(search) + '%';

        if (!cat || !searchCode) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'Category and search query are required'
            });
        }

        // Build where clauses
        let where = `
            (ykzkbn = '1' OR ykzkbn = '6')
            AND (name LIKE '${searchName}' OR kananame LIKE '${searchNameKana}' or srycd IN ('${searchCode}'))
            AND yukoedymd = '99999999'
        `;

        if (cat === "310") {
            where = `
                ykzkbn = '4'
                AND (name LIKE '${searchName}' OR kananame LIKE '${searchNameKana}' OR srycd IN ('${searchCode}'))
                AND yukoedymd = '99999999'
            `;
        }

        // Build select
        const results = await orcaDb.execute(`
            SELECT
                srycd,
                name,
                taniname,
                yakkakjncd,
                ten AS cost
            FROM public.tbl_tensu
            WHERE ` + where + ` LIMIT 200
        `, [searchName, searchNameKana, searchCode]);

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