export default defineCachedEventHandler(async (event) => {

    try {

        await requireUserSession(event)

        const zip = getRouterParam(event, 'zip')

        const address = await db.execute(`
            SELECT editadrs_name 
            FROM public.tbl_adrs
            WHERE post = ${zip}::text
        `
        );

        return { address: address[0]?.editadrs_name || null }
    } catch (e) {
        throw createError({
            status: 500,
            message: 'Failed to fetch address data',
        })
    }
})