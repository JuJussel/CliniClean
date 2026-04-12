export default defineCachedEventHandler(async (event) => {
    const zip = getRouterParam(event, 'zip')

    try {
        const response = await $fetch(`https://viacep.com.br/ws/${zip}/json/`, {
            method: 'GET',
        })
        return response
    } catch (e) {
        throw createError({
            status: 500,
            message: 'Failed to fetch address data',
        })
    }