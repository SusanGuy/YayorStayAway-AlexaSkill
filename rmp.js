const request = require("request");
const cheerio = require("cheerio");
let a;
// const fetchData = async() => {
//     const result = await axios.get(siteUrl);

//     return cheerio.load(result.data);
// };
const findUniversity = (id, callback) => {
    request(
        `https://www.ratemyprofessors.com/campusRatings.jsp?sid=${id}`,
        (error, response, html) => {
            const $ = cheerio.load(html);
            const result = $(".result-text");
            const hero = result.text().trim();
            callback(hero);
            a = 1;
        }
    );
};

findUniversity(1265, hero => {});