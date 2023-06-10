const router = require("express").Router();
const connection = require("../DB/db_connection");
const authorized = require("../middleware/Authorize");
const admin = require("../middleware/Admin");
const reader = require("../middleware/Reader");
const { body, validationResult } = require('express-validator');
const uplode = require("../middleware/uploadImages");
const { query } = require("express");
const util = require("util");
const fs = require("fs");
const bcrypt = require("bcrypt");
const crypto = require("crypto")

//MANAGE BOOKS
// //CREATE BOOK
router.post("",
    admin,
    uplode.fields([{ name: 'image_url', maxCount: 1 }, { name: 'pdf_files', maxCount: 1 }]),
    //uplode.single("image"),
    //uplode.single("file"),
    body("name").isString()
        .withMessage("please enter a valid movie name").
        isLength({ min: 10 }).
        withMessage("movie name should be at least 10 characters"),

    body("description").
        isString()
        .withMessage("please enter a valid description ")
        .isLength({ min: 20 })
        .withMessage("description name should be at least 20 characters"),

    body("author").
        isString()
        .withMessage("please enter a valid author ")
        .isLength({ min: 5 })
        .withMessage("author name should be at least 5 characters"),

    body("field").
        isString()
        .withMessage("please enter a valid field ")
        .isLength({ min: 5 })
        .withMessage("field name should be at least 5 characters"),

    body("puplication_date")
        .isString()
        .withMessage("please enter a valid puplication_date ")
        .isLength({ min: 5 })
        .withMessage("puplication_date should be at least 5 characters"),

    async (req, res) => {
        try {
            //VALIDATION REQUEST
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(
                { errors: [
                    {
                        msg : "Enter correct data",
                    },
                ],
                });
            }
            //VALIDATE THE IMAGE
            if (!req.files["image_url"]) {
                return res.status(400).json(
                    {
                        errors: [
                            {
                                msg: "Image is Required",
                            },
                        ],
                    },
                )
            }
            if (!req.files["pdf_files"]) {
                return res.status(400).json(
                    {
                        errors: [
                            {
                                msg: "PDF file is Required",
                            },
                        ],
                    },
                )
            }
            //PREPARE BOOK OBJECT
            const book =
            {
                name: req.body.name,
                description: req.body.description,
                author: req.body.author,
                field: req.body.field,
                img_url: req.files['image_url'][0].filename,
                PDF_File: req.files['pdf_files'][0].filename,
                puplication_date: req.body.puplication_date,
            }
            
            //INSERT BOOK TO DB
            const query = util.promisify(connection.query).bind(connection); 
            await query("insert into books set ? ", book);
            res.status(200).json({
                msg: "book created successfully !",
            });
        } catch (err) {
            res.status(500).json(err);
        }
    });

//UPDATE BOOK
router.put("/:id", admin,

//uplode.single("image"),
//uplode.single("file"),
uplode.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf_files', maxCount: 1 }]),

body("name").isString()
    .withMessage("please enter a valid movie name").
    isLength({ min: 10 }).
    withMessage("movie name should be at least 10 characters"),

body("description").
    isString()
    .withMessage("please enter a valid description ")
    .isLength({ min: 20 })
    .withMessage("description name should be at least 20 characters"),

body("author").
    isString()
    .withMessage("please enter a valid author ")
    .isLength({ min: 5 })
    .withMessage("author name should be at least 5 characters"),

body("field").
    isString()
    .withMessage("please enter a valid field ")
    .isLength({ min: 5 })
    .withMessage("field name should be at least 5 characters"),

body("puplication_date")
    .isString()
    .withMessage("please enter a valid puplication_date ")
    .isLength({ min: 5 })
    .withMessage("puplication_date should be at least 5 characters"),

async (req, res) => {
    try {
        //VALIDATION REQUEST
        const query = util.promisify(connection.query).bind(connection); 
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
                return res.status(400).json(
                { errors: [
                    {
                        msg : "Enter correct data",
                    },
                ],
                });
        }
        //CHECK IF MOVIE EXIST
        const book = await query("select * from books where id = ?", [req.params.id]);
        if (!book[0]) {
            res.status(404).json({ msg: "book not found !" });
        }
        //PREPARE BOOK OBJECT
        const bookObj =
        {
            name: req.body.name,
            description: req.body.description,
            author: req.body.author,
            field: req.body.field,
            puplication_date: req.body.puplication_date,
        }
  
        if (req.files["image"]) {
            bookObj.img_url = req.files['image'][0].filename;
            fs.unlinkSync("./upload/" + book[0].img_url);
        }
        if (req.files["pdf_files"]) {
            bookObj.PDF_File = req.files['pdf_files'][0].filename;
            fs.unlinkSync("./upload/" + book[0].PDF_File);
        }
        //UPDATE BOOK
        await query("update books set ? where id = ?", [
            bookObj,
            book[0].id
        ])
        res.status(200).json(
            {
                msg: "book updated succsessfully"
            }
        )
    } catch (err) {
        res.status(500).json(err);
    }

});

//DELETE BOOK
router.delete("/:id", authorized,
    async (req, res) => {
        try {
            //CHECK IF MOVIE EXIST
            const query = util.promisify(connection.query).bind(connection); //transform query mysql -> promise to use [await/async]
            const book = await query("select * from books where id = ?", [req.params.id]);
            if (!book[0]) {
                res.status(404).json({ msg: "book not found !" });
            }
            //REMOVE IMAGE
            fs.unlinkSync("./upload/" + book[0].img_url);
            fs.unlinkSync("./upload/" + book[0].PDF_File);

            //UPDATE BOOK
            await query("delete from books where id = ?", [book[0].id])
            res.status(200).json(
                {
                    msg: "book deleted succsessfully"
                }
            )
        } catch (err) {
            res.status(500).json(err);
        }
    });

//LIST BOOKS
router.get("",authorized,async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    let search = "";
    if (req.query.search) {
        search = `where name LIKE '%${req.query.search}%' or description LIKE '%${req.query.search}%'`
        query('INSERT INTO usersearch (search, user_id) VALUES (?, ?)',
        [req.query.search, res.locals.user.id])
    }
    const books = await query(`select * from books ${search}`);
    books.map((book) => {
        book.img_url = "http://" + req.hostname + ":4000/" + book.img_url;
        book.PDF_File = "http://" + req.hostname + ":4000/" + book.PDF_File;
    })
    res.status(200).json(books)
});

//SHOW A SPECEFIC BOOK
router.get("/:id", async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const book = await query("select * from books where id = ?", req.params.id);
    if (!book[0]) {
        res.status(404).json({ msg: "book not found !" });
    }
    book[0].img_url = "http://" + req.hostname + ":4000/" + book[0].img_url;
    res.status(200).json(book[0]);
});


//SHOW SEARCH HISTORY
router.get("/search/history",reader, async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const book = await query("select DISTINCT search from usersearch where user_id = ?", [res.locals.reader.id],
    (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send('ERROR TRY AGAIN LATER');
        }
        return res.status(200).json(results);
    }
);
    res.status(200).json("done");
});

//MANAGE CHAPTERS
//CREATE CHAPTERS
router.post('/:book_id/chapters', admin,
    body("title").isString()
        .withMessage("please enter a valid title").
        isLength({ min: 5 }).
        withMessage("title should be at least 5 characters"),
    body("description").
        isString()
        .withMessage("please enter a valid description ")
        .isLength({ min: 7 })
        .withMessage("description name should be at least 7 characters"),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const chapter = {
                title: req.body.title,
                description: req.body.description,
                book_id: req.params.book_id
            };
            const query = util.promisify(connection.query).bind(connection)
            //const sql = 'INSERT INTO chapters SET ?';
            await query("insert into bookchapters set ? ", chapter);
            res.status(200).json({
                msg: "Chapter created successfully !",
            });
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    });

//LIST CHAPTER
router.get('/:bookId/chapters', (req, res) => {
    const bookId = req.params.bookId;
    const query = util.promisify(connection.query).bind(connection);
    query(
        'SELECT bookchapters.id, bookchapters.title, bookchapters.description, books.name AS books_name FROM bookchapters JOIN books ON bookchapters.book_id = books.id WHERE books.id = ?',
        [bookId],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error retrieving chapters');
            } else {
                res.status(200).json(results);
            }
        }
    );
});

router.get("/:bookId/chapters/:chapterid", async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const book_id=req.params.bookId
    const chapter_id=req.params.chapterid
    const chapter = await query("select title,description from bookchapters where id = ?", [chapter_id]);
    if (!chapter[0]) {
        res.status(404).json({ msg: "chapter not found !" });
    }
    else
    {
        res.status(200).json(chapter);

    }
   
});


//UPDATE CHAPTER
router.put('/:bookId/chapters/:chapterId', admin, async (req, res) => {
    const { title, description } = req.body;
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const query = util.promisify(connection.query).bind(connection);

    await query(
        'UPDATE bookchapters SET title = ?, description = ? WHERE id = ? AND book_id = ?',
        [title, description, chapterId, bookId],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error updating chapter');
            } else if (results.affectedRows === 0) {
                res.status(404).send('Chapter not found for the given book');
            } else {``
                res.status(200).send('Chapter updated successfully');
            }
        }
    );
});

//DELETE CHAPTER
router.delete('/:bookId/chapters/:chapterId', admin, async (req, res) => {
    const bookId = req.params.bookId;
    const chapterId = req.params.chapterId;
    const query = util.promisify(connection.query).bind(connection)
    await query(
        'DELETE FROM bookchapters WHERE id = ? AND book_id = ?',
        [chapterId, bookId],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error deleting chapter');
            } else if (results.affectedRows === 0) {
                res.status(404).send('Chapter not found for the given book');
            } else {
                res.status(200).send('Chapter deleted successfully');
            }
        }
    );
});

//MANAGE REQUESTS
//READER SEND A REQUEST
router.post('/requests', reader,

    body("book_id").
        isNumeric()
        .withMessage("please enter a valid book id"),

    async (req, res) => {
        const status = 'pending';
        const query = util.promisify(connection.query).bind(connection);
        //VALIDATION REQUEST
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const book = await query("select * from books where id = ?", [req.body.book_id]);
        if (!book[0]) {
            res.status(404).json({ msg: "book not found !" });
        }
        // Insert new book request into book_request table
        await query('INSERT INTO userbookrequest (book_id,book_name,user_id,user_name, request) VALUES (?,?,?,?, ?)',
            [book[0].id,book[0].name ,res.locals.reader.id,res.locals.reader.name, status],
            (error, results) => {
                if (error) {
                    console.log(error);
                    return res.status(500).send('Error creating book request');
                }
                return res.status(200).send('Book request created successfully');
            }
        );
    });

//LIST PENDING REQUESTS
router.get('/requests/pending',admin, async (req, res) => {
    // Retrieve all pending book requests
    const query = util.promisify(connection.query).bind(connection);
    await query('SELECT * FROM userbookrequest WHERE request = "pending"',
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error retrieving book requests');
            }
            return res.status(200).json(results);
        }
    );
});

//ADMIN Accept A REQUEST
router.put('/requests/:id/accepted', async (req, res) => {
    const requestId = req.params.id;
    // Update book request status in book_request table
    const query = util.promisify(connection.query).bind(connection);
    await query('UPDATE userbookrequest SET request = "accepted" WHERE id = ?',
        [requestId],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error updating book request');
            }
            return res.status(200).send('Book request accepted successfully');
        }
    );
});

//ADMIN decline A REQUEST
router.put('/requests/:id/declined', async (req, res) => {
const requestId = req.params.id;
    // Update book request status in book_request table
    const query = util.promisify(connection.query).bind(connection);
    await query('UPDATE userbookrequest SET request = "declined" WHERE id = ?',
        [requestId],
        (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send('Error updating book request');
            }
            return res.status(200).send('Book request declined successfully');
        }
    );
});

//USER REQUEST HISTORY
router.get('/requests/:id',admin, (req, res) => {
    const userId = req.params.id;
    const query = util.promisify(connection.query).bind(connection);
    query( 'SELECT userbookrequest.request,userbookrequest.book_name, users.name AS user_name FROM userbookrequest JOIN users ON userbookrequest.user_id = users.id WHERE users.id = ?',
    [userId],
        (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error retrieving requets');
            } else {
                res.status(200).json(results);
            }
        }
    );
});

router.put('/:id/logout', async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    //VALIDATION REQUEST
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await query("select * from users where id = ?", [req.params.id]);
        if (!user[0]) {
            return res.status(404).json({ msg: "user not found !" });
        }
        const result = await query("update users set status = 'in-active' where id = ?", [req.params.id])
        if (result) {
            return res.status(200).json(
                {
                    msg: "Loged out succsessfully"
                }
            )
        }
        return res.status(404).json({ msg: "fuckwd" })
    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = router;