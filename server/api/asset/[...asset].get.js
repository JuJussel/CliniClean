export default defineEventHandler(async (event) => {
    try {

        const asset = getRouterParam(event, 'asset')

        // Validate asset path
        if (!asset || typeof asset !== 'string') {
            throw createError({
                status: 400,
                statusMessage: 'Invalid Asset Path',
                message: 'Asset path is required'
            })
        }

        return retrieveFileLocally(event, asset)
    } catch (error) {
        if (error.statusCode) {
            throw error
        }

        console.error('[Asset API Error]', {
            asset: getRouterParam(event, 'asset'),
            error: error.message,
            stack: error.stack
        })

        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to retrieve asset'
        })
    }
})


