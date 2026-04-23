export default defineEventHandler(async (event) => {

    try {
        const asset = getRouterParam(event, 'asset')
        return retrieveFileLocally(event, asset)
    } catch (error) {
        throw createError({
            status: 401,
            message: 'Unauthorized',
        })
    }
})


