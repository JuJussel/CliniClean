import { orcaClient } from '../../utils/orcaDbConnector.js';
import japUtils from 'japanese-string-utils';

export default defineEventHandler(async (event) => {
    try {
        const { search } = getQuery(event);
        if (!search) {
            return {
                success: true,
                data: []
            };
        }

        const searchCode = search;
        const searchName = '%' + search + '%';
        const searchNameKana = '%' + japUtils.toKatakana(search) + '%';

        const results = await orcaClient`
            SELECT
                trim(byomeicd) AS code,
                byomei AS name,
                byomeikana AS kana
            FROM public.tbl_byomei
            WHERE (
                byomei LIKE ${searchName}
                OR byomeikana LIKE ${searchNameKana}
                OR byomeicd = ${searchCode}
            )
            AND haisiymd = '99999999'
            LIMIT 50
        `;

        return {
            success: true,
            data: results
        };

    } catch (error) {
        console.error('[Disease Search API Error]', error);
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while searching for disease'
        });
    }
});
