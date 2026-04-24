export default defineEventHandler(async (event) => {
    try {
        await requireUserSession(event)

        const zip = getRouterParam(event, 'zip')

        // Validate zip code format
        if (!zip || !/^\d{7}$/.test(zip)) {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Zip Format',
                message: 'Zip code must be 7 digits'
            })
        }

        const address = await orcaDb.execute(`
            SELECT editadrs_name 
            FROM public.tbl_adrs
            WHERE post = ${zip}::text
        `, [zip])

        return {
            success: true,
            data: {
                address: address[0]?.editadrs_name || null
            }
        }
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Address API Error]', {
            zip: getRouterParam(event, 'zip'),
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch address data'
        })
    }
})