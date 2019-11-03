// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const teacherFinder = require('./teacher.js');

const reviewFinder = require('./reviews.js');
// const rmp-module = require('rmp-module.js');
let school_name_global;
let prof_name_global;

     

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, this is rate my professor Alexa skill. Tell me the name of the university';
        const speakReprompt = 'We can get started with the name of the university';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakReprompt)
            .getResponse();
    }
};
const AskNameUniversityHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AskNameUniversity';
    },
    handle(handlerInput) {
        // const school_name =  handlerInput.requestEnvelope.request.intent.slots.school_name.value;
        school_name_global = handlerInput.requestEnvelope.request.intent.slots.school_name.value;
        const speakOutput = 'Okay! ' + school_name_global + '. What is the name of your professor?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Tell me the name of the professor so I can get started.')
            .getResponse();
    }
};

const AskNameProfessorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AskNameProfessor';
    },
     async handle(handlerInput) {
        prof_name_global = handlerInput.requestEnvelope.request.intent.slots.prof_name.value;
        let outputStr;
        const value = await teacherFinder(prof_name_global,school_name_global);
        if(value.professorOverallRating>3.5){
            outputStr = ' You should take this professor. '
        } else
        {
            outputStr = "You better stay away. "
        }
         const speakOutput = prof_name_global+ ' from ' + school_name_global + ' has a rating of  ' + value.professorOverallRating +". " + value.professorYayNay + "!  "  + outputStr+ '.  Do you want to hear one of the recent student comments ?' ;
        

    
   
                return handlerInput.responseBuilder
                    .speak( speakOutput) //+" has a rating of " + value.professorOverallRating+ ".  "+ outputStr)
                    .reprompt('Nothing')
                    .getResponse();
            }
        // let outputStr;
        
       
        // .reprompt('Tell me the name of the professor so I can get started.')


    
};



// const SearchForRatingHandler = (handlerInput) => {
//     // canHandle(handlerInput) {
//     //     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//     //         && handlerInput.requestEnvelope.request.intent.name === 'SearchForRating';
//     // },handle(handlerInput) {
//     // const prof_name = handlerInput.requestEnvelope.request.intent.slots.prof_name.value;
    
//     // var comments;
//     // if(aayoHai.prof_rating>3.5){
//     //     comments = ' You should definitely take this class'
//     // }else{
//      teacherFinder(1265,1).then((data)=>{
//          return handlerInput.responseBuilder
//              .speak('Number is data ')
//              .reprompt("Do you want to know a recent student comment?")
//              .getResponse();
//      }).catch((err)=>{
//          console.log('Dubayo bhatij'+ err);
//      });
   
//    // handlerInput.responseBuilder.speak(aayoHai);
//     // }
//     // const speakOutput = prof_name_global+ ' from ' + school_name_global + ' has a rating of  ' + aayoHai.professorOverallRating +". " + aayoHai.professorId + "!  " + comments + '. Do you want to hear one of the recent student comments ?' ;
   
// }

const AskForReviewHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AskForReview';
    },
    async handle(handlerInput) {
        let outputText;
        const userInput = handlerInput.requestEnvelope.request.intent.slots.reviewDecision.value.toLowerCase();
        if (userInput === 'yes' || userInput === 'yeah' || userInput === 'alright' || userInput === 'yep' || userInput === 'okay' || userInput === 'sure') {
            outputText = await reviewFinder(prof_name_global, school_name_global)
            
        } else {
            outputText = "Alright mate! Goodbye! "
        }

        return handlerInput.responseBuilder
            .speak('The most recent review is: '+ outputText.data[0])
            // .reprompt()
            .getResponse();



    }
};






const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskNameUniversityHandler,
        AskNameProfessorHandler,
        AskForReviewHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();