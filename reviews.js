const axios = require("axios");
const cheerio = require("cheerio");
const getResults = require("./teacher");

const newAsync = async(professorName, universityName) => {
    const results = await getResults(professorName, universityName);
    return results.professorId;
};

const fetchReviews = async(professorName, universityName) => {
    const hello = await newAsync(professorName, universityName);
    const result = await axios.get(
        `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${hello}`
    );
    const hero = await result;

    return cheerio.load(hero.data);
};

const getReview = async(professorName, universityName) => {
    const $ = await fetchReviews(professorName, universityName);
    const comment = $(".commentsParagraph");
    const data = comment
        .text()
        .trim()
        .split("  ");
    const dateData = $(".date");
    const date = dateData.text().substring(0, 10);

    return {
        data: data
            .filter(item => {
                return item !== "" && item !== "\n";
            })
            .map(review => {
                if (review.includes("\n")) {
                    return review.replace("\n", "");
                } else {
                    return review;
                }
            })
            .slice(0, 1),
        createdAt: date
    };
};

module.exports = getReview;