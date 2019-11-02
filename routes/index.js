const express = require("express");
const router = express.Router();
const getResults = require("../teacher");
const getReview = require("../reviews");

// const topThreeReviews = reviews => {
//     const newReviews = reviews.map(review => {
//         if (review.includes("\n")) {
//             return review.replace("\n", "");
//         } else {
//             return review;
//         }
//     });
//     const heroReviews = newReviews.sort((a, b) => {
//         return a.length - b.length;
//     });
//     return heroReviews.slice(0, 1);
// };

/* GET home page. */
router.get("/", async(req, res, next) => {
    const professorName = "Sandra Spiroff";
    const universityName = "University of Mississippi";

    const result = await getResults(professorName, universityName);
    const reviews = await getReview(professorName, universityName);
    res.send(
        JSON.stringify({
            result,

            reviews
        })
    );
});

module.exports = router;