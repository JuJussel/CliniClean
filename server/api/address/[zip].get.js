export default defineCachedEventHandler(async (event) => {

    await requireUserSession(event)

    try {


        const zip = getRouterParam(event, 'zip')

        const address = await orcaDb.execute(`
            SELECT editadrs_name 
            FROM public.tbl_adrs
            WHERE post = ${zip}::text
        `
        );

        return { address: address[0]?.editadrs_name || null }
    } catch (e) {
        console.log(e);

        throw createError({
            status: 500,
            message: 'Failed to fetch address data',
        })
    }
})