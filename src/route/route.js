const express=require('express');
const router=express.Router();
const UserController=require('../controllers/userController')
const BookController=require('../controllers/bookController')
const ReviewController=require('../controllers/reviewController')
const Middleware=require('../middleware/middleware')



router.post('/register',UserController.createUser )

router.post('/login',UserController.loginUser )

router.post('/books',Middleware.authentication,Middleware.authorize, BookController.createBook )

router.get('/books',Middleware.authentication,BookController.getBook)

router.get('/books/:bookId',Middleware.authentication,BookController.getBookByParams)

router.put('/books/:bookId',Middleware.authentication,Middleware.authorization, BookController.updateBooks)
router.delete('/books/:bookId',Middleware.authentication,Middleware.authorization, BookController.deleteBooks)


router.post('/books/:bookId/review',ReviewController.createReview)


router.put('/books/:bookId/review/:reviewId',ReviewController.updatedReview)
router.delete('/books/:bookId/review/:reviewId',ReviewController.deletedReview)


module.exports=router;