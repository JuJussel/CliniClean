import Encounter from '../../models/encounter.model';

export default defineEventHandler(async (event) => {
    const encounterId = event.context.params.encounterId;
    const body = await readBody(event);

    try {
        await Encounter.updateOne({ _id: encounterId }, body);
        return {
            success: true,
        };
    } catch (error) {
        console.log(error);
        return {
            error: error.message,
            success: false,
        };
    }
}); 