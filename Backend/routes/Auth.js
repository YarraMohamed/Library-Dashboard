const router = require("express").Router();
const connection = require("../DB/db_connection");
const authorized = require("../middleware/Authorize.js");
const reader = require("../middleware/Reader.js")

const { body, validationResult } = require('express-validator');
const util = require("util");
const bcryt = require("bcrypt");
const crypto = require("crypto")

///ٌRegister
router.post("/register", 
body("email").isEmail().withMessage("wrong email"),
body("name").isString().withMessage("wrong name").isLength({ min : 8 , max : 20}),
body("password").isLength({min : 4 ,max : 10 }).withMessage("wrong password"),
body("phone").isNumeric().withMessage("wrong number"),

async (req,res)=> {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = util.promisify(connection.query).bind(connection);
    const checkEmail = await query("select * from users where email=?",[req.body.email]);

    if(checkEmail.length > 0){
        res.status(400).json({
            errors :[
                {
                    "msg" : "email already existed",
                },
            ],
        });
    }

    const userData = {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        password : await bcryt.hash(req.body.password,10),
        tokens : crypto.randomBytes(16).toString("hex"),
    };

    await query ("insert into users set ?",userData);
    
    delete userData.password;
    res.status(200).json(userData);

    }catch(err){
        res.status(500).json({err : err});
    }

});

//login
router.post("/login", 
body("email").isEmail().withMessage("wrong email"),
body("password").isLength({min : 4 ,max : 10 }).withMessage("wrong password"),
async (req,res)=> {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = util.promisify(connection.query).bind(connection);
    const user = await query("select * from users where email=?",[req.body.email]);

    if(user.length == 0){
        res.status(404).json({
            errors :[
                {
                    msg : "email or password not found",
                },
            ],
        });
    }
    const checkPassword = await bcryt.compare(req.body.password,user[0].password);
    await query("update users set status = 'active' where email = ?", [req.body.email])
    if(checkPassword){
        delete user[0].password
        delete user[0].status
       // res.status(200).json("Logged In Successfully");
        res.status(200).json(user[0]);
    }else{
        res.status(404).json({
            errors :[
                {
                    msg : "email or password not found",
                },
            ],
        });
    }
    const status = await query('UPDATE users set status = 1 WHERE email = ?',[req.body.email]);

    }catch(err){
        res.status(500).json({err : err});
    }

});

//logout
router.put("/logout", authorized,
 async (req, res) => {
    
    try{
         const query = util.promisify(connection.query).bind(connection); 
         await query('UPDATE users set status = "in-active" WHERE id = ?',
         [res.locals.user.id],
         (error, results) => {
            if (error) {
                res.status(400).json({
            errors :[
                {
                    "msg" : "error logging out",
                },
            ],
        });
        }       
        return res.status(200).json({
            msg: "Logged out successfully"
        });
    }
    );
    }catch(err){
        res.status(500).json({err : err});
    } 
});

module.exports = router;