/*
@access: Array with access for roles. Array structure: [Receptionis, Nurse, Doctor]
Role IDs minus 1 correspond to the location in the arra. eg. User is doctor: role = 3; 3-1=2;
get access from 2nd element in array (starting with 0)
Receptionis role: 1
Nurse role: 2
Doctor role: 3
This must match what is in the database..
Values are 0,1 - 0: no access, 1: access
*/

module.exports = function (access) {
    return function (req,res,next) {
        const role = req.user.role - 1;
        console.log(role);
        access = access[role];
        if (access) {
            next();            
        } else {
            return res.status(403).send({
                message: "Access to this route denied!"
            });    
        }
    }
}