import Joi from "joi";
import lang from "../lang/jp"

export default (index = 0, proc = null) => {
    if (!proc) return false;

    const cat = proc.cat.code;
    const varData = proc.varData || null;
    const order = proc.order || null;
    const schema = {
        perscription: Joi.object({
            amount: Joi.number().required(),
            duration: Joi.number().required()
        }),
        shot: Joi.object({
            amount: Joi.number().required(),
            location: Joi.string().required(),
            lot: Joi.string().required()
        })
    }

    if (cat === 60) {
        if (order) return false;
        if (!varData?.length > 0) {
            return {
                index,
                errors: [{ message: lang.validationMessages.examResultsMissing, context: { label: null } }]
            }
        }
        let err = false;
        varData.forEach(item => {
            if (typeof (item.value) !== "number") err = true
        });
        if (err) return {
            index,
            errors: [{ message: lang.validationMessages.examValueNotNumber, context: { label: null } }]
        }
        return false
    }

    if (cat === 25) {
        if (order) return false;
        if (!varData) {
            return {
                index,
                errors: [{ message: lang.validationMessages.perscriptionDataMissing, context: { label: null } }]
            }
        }
        try {
            Joi.assert(varData, schema.perscription, {
                abortEarly: false,
                allowUnknown: true,
                messages: lang.validationMessages,
            });
        } catch (err) {
            return {
                index,
                errors: err.details
            }
        }
        return false;
    }
    if (cat === 30) {
        if (order) return false;
        if (!varData) {
            return {
                index,
                errors: [{ message: lang.validationMessages.shotDataMissing, context: { label: null } }]
            }
        }
        try {
            Joi.assert(varData, schema.shot, {
                abortEarly: false,
                allowUnknown: true,
                messages: lang.validationMessages,
            });
        } catch (err) {
            return {
                index,
                errors: err.details
            }
        }
        return false;
    }
    return false;

}