const ReviewModel = require('../models/reviewModel')
const BookModel = require('../models/bookModel')
const mongoose = require('mongoose')
const isValid = function (value) {

    if (typeof (value) == 'undefined' || typeof (value) == 'null') { return false }
    if (typeof (value) == 'string' && value.trim().length == 0) { return false }
    return true
}


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createReview = async function (req, res) {
    try {
        const data = req.body

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, msg: "data is missing" }) }

        const bookId1 = req.params.bookId

        if (!isValidObjectId(bookId1)) { return res.status(400).send({ status: false, msg: ' Invalid bookId' }) }

        const bookDetails = await BookModel.findById(bookId1).select({__v:0})

        if (!bookDetails) { return res.status(404).send({ status: false, msg: "bookId does not exist" }) }
     

        const { reviewedBy, reviewedAt, rating, review } = data

        const req0 = isValid(data.bookId)
        if (!req0) { return res.status(400).send({ status: false, msg: "bookId is required" }) }

        let bookId = data.bookId.trim()

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: ' Invalid bookId' }) }

        let findBookid = await BookModel.findById({_id:bookId})
        if (!findBookid) return res.status(404).send({ status: false, msg: "BookId does not exist" })
        data.bookId = bookId



        const req1 = isValid(reviewedBy)
        if (!req1) { return res.status(400).send({ status: false, msg: "reviewedBy is required" }) }

        const req2 = isValid(reviewedAt)
        if (!req2) { return res.status(400).send({ status: false, msg: "reviewedAt is required" }) }

        const req3 = isValid(rating)
        if (!req3) { return res.status(400).send({ status: false, msg: "rating is required" }) }

        // const req4 = isValid(review)
        // if (!req4) { return res.status(400).send({ status: false, msg: "review is required" }) }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "ratings should be in 1 to 5" })
        }
    
        if (bookId1 === bookId) {
            if ( bookDetails.isDeleted == false) {
                const saveData = await ReviewModel.create(data)
                let increasedreview = await BookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: +1 } }, { new: true })
            

                const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
          
                const  bookDetailsWithReviewDetails=increasedreview.toObject()

        
                    bookDetailsWithReviewDetails.reviewsData=saveData1
                    
                  
                return res.status(201).send({ status: true, data: bookDetailsWithReviewDetails })
            } else {

                return res.status(404).send({ status: false, msg: "book is already deleted" })
            }
        } else { return res.status(400).send({ statu: false, msg: " bookId does not match " }) }
    }

    catch (err) {
        res.status(500).send({ status:false,error: err.message })
    }

}

const updatedReview = async function (req, res) {
    try {
        const data = req.body
        const review = data.review
        const rating = data.rating
        const reviewedBy = data.reviewedBy
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, msg: "data is missing" }) }

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: ' Invalid  bookId' }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, msg: ' Invalid reviewId' }) }




        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) { return res.status(404).send({ status: false, msg: "bookId does not exist" }) }

        const FindReview = await ReviewModel.findById(reviewId)
        if (!FindReview) { return res.status(404).send({ status: false, msg: "reviewId does not exist" }) }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, msg: "ratings should be in 1 to 5" })
        }

        if (bookId == FindReview.bookId) {

            if (bookDetails.isDeleted === false) {


                if (FindReview.isDeleted === false) {

                    const UpdateReview = await ReviewModel.findOneAndUpdate({ _id: reviewId}, { review: review, rating: rating, reviewedBy: reviewedBy }, { new: true })
                    const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
                   
                    const  bookDetailsWithReviewDetails=bookDetails.toObject()
                    bookDetailsWithReviewDetails.reviewsData=saveData1

                    return res.status(202).send({ status: true, data: bookDetailsWithReviewDetails })

                } else {
                    return res.status(400).send({ status: false, msg: "reviewData is already Deleted" })
                }
            } else {
                return res.status(400).send({ status: false, msg: "BookData is already Deleted" })
            }
        }
        else {
            return res.status(400).send({ statu: false, msg: " id does not match" })
        }


    } catch (err) {
        return res.status(500).send({ statu: false, error: err.message })
    }
}


const deletedReview = async function (req, res) {
    try {


        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!isValidObjectId(bookId)) { return res.status(400).send({ status: false, msg: ' Invalid bookId' }) }

        if (!isValidObjectId(reviewId)) { return res.status(400).send({ status: false, msg: ' Invalid reviewId' }) }


        const bookDetails = await BookModel.findById(bookId)
        if (!bookDetails) { return res.status(404).send({ status: false, msg: " bookId does not exist" }) }


        const FindReview = await ReviewModel.findById(reviewId)
        if (!FindReview) { return res.status(404).send({ status: false, msg: "reviewId does not exist" }) }



        if (bookId == FindReview.bookId) {
            if (bookDetails.isDeleted === false) {
                if (FindReview.isDeleted === false) {

                    const deleteReview = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true, deleteAt: new Date() }, { new: true })

                    let deleteReview1 = await BookModel.findOneAndUpdate({ _id: bookDetails._id }, { $inc: { reviews: -1 } },{ new: true })
                    const saveData1 = await ReviewModel.find({ bookId: bookDetails._id, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
                 
                    const  bookDetailsWithReviewDetails=deleteReview1.toObject()

                    
                        bookDetailsWithReviewDetails.reviewsData=saveData1
                 
                    return res.status(200).send({ status: true, msg: 'selected reviewData is deleted', data: bookDetailsWithReviewDetails })

                } else {
                    return res.status(404).send({ status: false, msg: "reviewData is already Deleted" })
                }
            }
            else {
                return res.status(404).send({ status: false, msg: "BookData is already Deleted" })
            }
        } else {
            return res.status(400).send({ status: false, msg: " Id does not match" })
        }


    } catch (err) {
        return res.status(500).send({ status:false,error: err.message })
    }
}






module.exports.createReview = createReview
module.exports.updatedReview = updatedReview
module.exports.deletedReview = deletedReview





