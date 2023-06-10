const router = require("express").Router();
const connection = require("../DB/db_connection");
const authorized = require("../middleware/Authorize");
const admin = require("../middleware/Admin");
const { body, validationResult } = require('express-validator');
const uplode = require("../middleware/uploadImages");
const { query } = require("express");
const util = require("util");
const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//3- MANAGE READER
//CREATE READER
router.post('', admin,
    body("email").isEmail().withMessage("please enter a valid email !"),
    body("name").isString().withMessage("please enter a valid name").isLength({ min: 5 }).withMessage("name should be between (10-20) character"),
    body("password").isLength({ min: 8, max: 12 }).withMessage("password should be between (8-12) character"),
    body("phone").isLength({ min: 6 }).withMessage("phone must be at least 6 chars long"), async (req, res) => {
        try {
            //VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //CHECK IF EMAIL
            const query = util.promisify(connection.query).bind(connection); //transform query mysql -> promise to use [await/async]
            const checkEmailExists = await query("select * from users where email = ?", [req.body.email]);
            const checkPhoneExists = await query("select * from users where phone = ?", [req.body.phone]);
            if (checkEmailExists.length > 0) {
                res.status(400).json(
                    {
                        errors: [
                            {
                                "msg": "email alredy exists !"
                            }
                        ]
                    }
                )
            }
            else if (checkPhoneExists.length > 0) {
                res.status(400).json(
                    {
                        errors: [
                            {
                                "msg": "phone alredy exists !"
                            }
                        ]
                    }
                )
            }
            //PREPARE OBJECT USER TO -> SAVE
            const reader =
            {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
                tokens: crypto.randomBytes(16).toString("hex"), //RANDOM ENCRYPTION STANDARD
            }
            //INSERT USER OBJECT INTO DB
            await query("insert into users set ? ", reader)
            delete reader.password;
            res.status(200).json(reader);
            res.json("success");

        } catch (err) {
            console.log(err)
            res.status(500).json("error");
        }

    }

);

//UPDATE READER
router.put('/:id', admin,
    body("email").isEmail().withMessage("please enter a valid email !"),
    body("name").isString().withMessage("please enter a valid name").isLength({ min: 5 }).withMessage("name should be between (10-20) character"),
    body("password").isLength({ min: 8, max: 12 }).withMessage("password should be between (8-12) character"),
    body("phone").isLength({ min: 6 }).withMessage("phone must be at least 6 chars long"), async (req, res) => {
        try {
            //VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            //CHECK IF EMAIL
            const query = util.promisify(connection.query).bind(connection);
            const reader = await query("select * from users where id = ?", [req.params.id]);
            if (!reader[0]) {
                res.status(404).json({ msg: "Reader not found !" });
            }
            //transform query mysql -> promise to use [await/async]
            const checkEmailExists = await query("select * from users where email = ?", [req.body.email]);
            const checkPhoneExists = await query("select * from users where phone = ?", [req.body.phone]);
            // if (checkEmailExists.length > 0) {
            //     res.status(400).json(
            //         {
            //             errors: [
            //                 {
            //                     "msg": "email already exists !"
            //                 }
            //             ]
            //         }
            //     )
            // }
            // else if (checkPhoneExists.length > 0) {
            //     res.status(400).json(
            //         {
            //             errors: [
            //                 {
            //                     "msg": "phone already exists !"
            //                 }
            //             ]
            //         }
            //     )
            // }

            //PREPARE OBJECT USER TO -> SAVE
            const readerObj =
            {
                name: req.body.name,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, 10),
                phone: req.body.phone,
            }
            //INSERT USER OBJECT INTO DB
            await query("update users set ? where id = ?", [
                readerObj,
                reader[0].id
            ])
            res.status(200).json(
                {
                    msg: "reader updated succsessfully"
                }
            )

        } catch (err) {
            console.log(err)
            res.status(500).json({ err: err });
        }

    }

);

//DELETE READER
router.delete('/:id', admin, async (req, res) => {
    const readerId = req.params.id;
    const query = util.promisify(connection.query).bind(connection); //transform query mysql -> promise to use [await/async]
    await query(
        'DELETE FROM users WHERE id = ? AND type = "0"',
        [readerId],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error deleting reader');
            } else if (results.affectedRows === 0) {
                res.status(404).send('Reader not found');
            } else {
                res.status(200).send('Reader deleted successfully');
            }
        }
    );
});

//LIST READERS
router.get('', admin, async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    await query(
        'SELECT * FROM users WHERE type = "0"',
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error retrieving readers');
            } else {
                delete results[0].password
                delete results[0].tokens
                delete results[0].type
                res.status(200).json(results);
            }
        }
    );
});

router.get("/:id", admin,async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const reader = await query("select * from users where id = ?", req.params.id);
    if (!reader[0]) {
        res.status(404).json({ msg: "Reader not found !" });
    }
    //await query('INSERT INTO usersearch (book_name, user_id) VALUES (?, ?)',
    //[book[0].name, res.locals.reader.id]),
    res.status(200).json(reader[0]);
});

module.exports = router;