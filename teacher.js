const axios = require("axios");
const cheerio = require("cheerio");
const Professor = require("./professor-model.js");

const findId = name => {
    return Professor.find({ name });
};

const getId = async name => {
    const data = await findId(name);
    return data[0]._id;
};

const getNumberOfProfessors = async(id, page) => {
    const result = await axios.get(
        `https://www.ratemyprofessors.com/filter/professor/?&page=${page}&filter=firstname_sort_s+asc&lastname_sort_s+asc&query=*%3A*&queryoption=TEACHER&queryBy=schoolId&sid=${id}`
    );
    const hero = await result;

    return hero;
};

const helperMethod = async id => {
    let page = 1;
    const helperArray = [];
    let daddy;
    let remaining = 5000;

    do {
        daddy = await getNumberOfProfessors(id, page);
        remaining = await daddy.data.remaining;
        await helperArray.push(daddy.data.professors);
        page++;
    } while (remaining > 0);

    return helperArray;
};

const findProfessorByName = async(firstName, lastName, id) => {
    professor = await helperMethod(id);
    const data = await professor.map(item => {
        return item.find(pro => {
            return pro.tFname === firstName && pro.tLname === lastName;
        });
    });
    return data;
};

// const fetchSchoolData = async id => {
//     const result = await axios.get(
//         `https://www.ratemyprofessors.com/campusRatings.jsp?sid=${id}`
//     );
//     const hero = await result;

//     return cheerio
//         .load(hero.data)(".school-name")
//         .text()
//         .trim();
// };

const getResults = async(professorName, universityName) => {
    const yo = professorName.split(" ");
    const id = await getId(universityName);
    const mama = await findProfessorByName(yo[0], yo[1], id);
    const dai = await mama.find(hello => {
        return hello !== undefined;
    });

    return {
        professorId: dai.tid,
        professorRatingClass: dai.rating_class,
        professorNumberRatings: dai.tNumRatings,
        professorOverallRating: dai.overall_rating,
        professorYayNay: parseFloat(dai.overall_rating) > 3.5 ? "Yay" : "StayAway"
    };
};

// const insertDB = async() => {
//     for (let i = 0; i < 6049; i++) {
//         const name = await fetchSchoolData(i);
//         const newProfessor = await new Professor({ _id: i, name });
//         await newProfessor.save();
//     }
// };
// insertDB();
module.exports = getResults;