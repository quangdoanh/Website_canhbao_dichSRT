const LogUserModel = require("../models/log_user.model")

module.exports.logUser = async (user, endponit, method, purpose) => {
    const dataFinal = {
        user: user,
        endpoint: endponit,
        method: method,
        time: new Date().toISOString(),
        purpose: purpose
    }
    console.log("data nè", dataFinal)

    //await LogUserModel.insert(dataFinal);

};
