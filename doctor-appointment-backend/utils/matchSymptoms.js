const symptoms = require("../data/symptoms");

function matchSymptomsToDoctor(text){
    if (!text || typeof text !== "string") {
    return "General Physician";
  }
     const input = text.toLowerCase();
    for(let item of symptoms){
        for(let keyword of item.keywords) {
            if(input.includes(keyword)){
                return item.specialization;  // first matched specialization
            }
        }
    }
     return "General Physician"; // default fallback
}

module.exports = matchSymptomsToDoctor;