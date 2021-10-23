import Joi from "joi";
import lang from "../lang/jp"

export default (index = 0, proc = null) => {
    if(!proc) return false;
    
    const cat = proc.cat.code;
    const varData = proc.varData || null;
    const order = proc.order || null;

    if(cat === 60) {
        if(order) return false;
        if(!varData?.length > 0) {
            return {
                index,
                errors: [ lang.validationMessages.examResultsMissing ]
            }
        }
        let err = false;
        varData.forEach(item => {
            if(typeof(item.value) !== "number") err = true 
        });
        if(err) return {
            index,
            errors: [ lang.validationMessages.examValueNotNumber ]
        }
        return false
    }

    const schema = {
        perscription: Joi.object({
            amount: Joi.number().required(),
            duration: Joi.number().required()
        })
    }

    if (cat === 25) {
        if(order) return false;
        if(!varData) {
            return {
                index,
                errors: [ lang.validationMessages.perscriptionDataMissing ]
            }
        }
        try {
            Joi.assert(varData, schema.perscription, {
                abortEarly: false,
                allowUnknown: true,
                messages: lang.validationMessages,
            });
        } catch(err) {
            return {
                index,
                errors: err.details
            }
        }
        return false;

    }


}