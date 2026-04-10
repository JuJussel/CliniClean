export default defineEventHandler(async (event) => {

    await requireUserSession(event)

    const asset = getRouterParam(event, 'asset')

    return retrieveFileLocally(event, asset)
})


