import User from '../../../models/user.model';

export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params.userId;
        const favs = await User.findById(userId).select('preferences').lean();
        return favs.preferences?.procedures?.favourites || [];
    } catch (error) {
        console.error('[User Favourites API Error]', {
            error: error.message,
            stack: error.stack
        })
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while fetching user favourites'
        })
    }
});