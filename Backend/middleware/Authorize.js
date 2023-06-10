const connection = require("../DB/db_connection");
const util = require("util");


const authorized = async (req, res, next) => {
    const query = util.promisify(connection.query).bind(connection);
    const { tokens } = req.headers;
    const user = await query("select * from users where tokens = ?", [tokens])
    if (user[0]) {
        res.locals.user = user[0];
        next();
    }
    else {
        res.status(403).json({
            msg: "you are not authorized to access this route !",
        })
    }

}
module.exports = authorized;