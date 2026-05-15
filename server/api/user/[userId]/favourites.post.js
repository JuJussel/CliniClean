import User from "../../../models/user.model";

export default defineEventHandler(async (event) => {
    try {
        const userId = event.context.params.userId;
        const procedure = await readBody(event);
        const procedureId = procedure.srycd;
        
        if (!procedure) {
            throw createError({
                status: 400,
                statusMessage: 'Bad Request',
                message: 'Procedure is required'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            throw createError({
                status: 404,
                statusMessage: 'Not Found',
                message: 'User not found'
            });
        }

        user.preferences = user.preferences || {};
        user.preferences.procedures = user.preferences.procedures || {};
        user.preferences.procedures.favourites = user.preferences.procedures.favourites || [];

        let codeSorted = {};
        let newFavourites = [];
        let pushNew = true;

        user.preferences.procedures.favourites.forEach(item => {
        
            if (item.srycd === req.body.srycd) pushNew = false;
            codeSorted[item.cat.code] ? codeSorted[item.cat.code].push(item) : codeSorted[item.cat.code] = [item];
            let codeContainer = codeSorted[item.cat.code];
            if (codeContainer.length > 9) {
            codeSorted[item.cat.code].shift();
            }
        })


        // // Check if procedure already exists in favourites by srycd
        // const exists = user.preferences.procedures.favourites.some(f => String(f.srycd) === String(procedure.srycd));
        
        // if (!exists) {
        //     user.preferences.procedures.favourites.unshift(procedure);
        //     await user.save();
        // }

        return user.preferences.procedures.favourites;
    } catch (error) {
        console.error('[User Favourites API Error]', {
            error: error.message,
            stack: error.stack
        })
        throw createError({
            status: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while adding procedure to favourites'
        })
    }
});