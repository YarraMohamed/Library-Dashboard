const connection = require("../DB/db_connection");
const util = require("util");

const admin = async (req, res, next) => {
    const query = util.promisify(connection.query).bind(connection);
    const { tokens } = req.headers;
    const admin = await query("select * from users where tokens = ?", [tokens])
    if (admin[0] && admin[0].type == "1") {
        res.locals.user = admin[0];
        next();
    }
    else {
        res.status(403).json({
            msg: "you are not authorized to access this route !",
        })
    }

}
module.exports = admin;