import japUtils from 'japanese-string-utils';

export default defineEventHandler(async (event) => {
    try {
        const { cat, search } = getQuery(event)

        if (!cat || !search) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'Category and search query are required'
            });
        }

        const searchCode = search;
        const searchName = search + '%';
        const searchNameKana = japUtils.toKatakana(search) + '%';

        let results;

        if (cat === "212") {
            results = await orcaClient`
                SELECT
                    srycd,
                    name,
                    formalname,
                    taniname,
                    yakkakjncd,
                    ten AS cost,
                    concat(cdkbn_kbn, lpad(cdkbn_kbnnum::text, 3, '0'), lpad(cdkbn_kbnnum_eda::text, 2, '0')) AS "procedureClass"
                FROM public.tbl_tensu
                WHERE (ykzkbn = '1' OR ykzkbn = '6')
                    AND (
                        name     LIKE ${searchName}
                        OR kananame LIKE ${searchNameKana}
                        OR srycd   = ${searchCode}
                    )
                    AND yukoedymd = '99999999'
                LIMIT 200
            `;
        } else if (cat === "310") {
            results = await orcaClient`
                SELECT
                    srycd,
                    name,
                    formalname,
                    taniname,
                    yakkakjncd,
                    ten AS cost,
                    concat(cdkbn_kbn, lpad(cdkbn_kbnnum::text, 3, '0'), lpad(cdkbn_kbnnum_eda::text, 2, '0')) AS "procedureClass"
                FROM public.tbl_tensu
                WHERE ykzkbn = '4'
                    AND (
                        name     LIKE ${searchName}
                        OR kananame LIKE ${searchNameKana}
                        OR srycd   = ${searchCode}
                    )
                    AND yukoedymd = '99999999'
                LIMIT 200
            `;
        } else {
            results = await orcaClient`
                SELECT
                    srycd,
                    name,
                    formalname,
                    taniname,
                    yakkakjncd,
                    ten AS cost,
                    concat(cdkbn_kbn, lpad(cdkbn_kbnnum::text, 3, '0'), lpad(cdkbn_kbnnum_eda::text, 2, '0')) AS "procedureClass"
                FROM public.tbl_tensu
                WHERE srysyukbn = ${cat}
                    AND (
                        name        LIKE ${searchName}
                        OR kananame  LIKE ${searchNameKana}
                        OR formalname LIKE ${searchName}
                        OR formalname LIKE ${searchNameKana}
                        OR srycd     = ${searchCode}
                    )
                    AND yukoedymd = '99999999'
                    AND NOT srysyukbn = ''
                LIMIT 200
            `;
        }

        return {
            success: true,
            data: results
        }

    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Procedure Search API Error]', {
            error: error.message,
            pgCode: error.code,       // PostgreSQL error code e.g. 42703 = undefined column
            pgDetail: error.detail,   // Extra detail from PostgreSQL
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while searching for procedure'
        })
    }
})