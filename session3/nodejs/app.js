const express = require('express');
const path = require('path');
const fileSystem = require('./fileSystem');
const handlebars = require('express-handlebars');
const bodyParser = require("body-parser");
const fs = require('fs');


let app = express();

app.use(bodyParser.urlencoded({extended: false}));

// declare a new engine named 'handlebars from  'handlebars({defaultLayout: 'main'})'
app.engine("handlebars", handlebars({defaultLayout: 'main'}));
// Set view app's view engine is 'handlebars' already declared above
app.set('view engine', 'handlebars');

app.get('/',function(req, res) {
    // let stringData = "Hung Arima";
    // let htmlData = "<h1>Hung Arima</h1>";
    // res.render('home', {
    //     stringData,
    //     htmlData
    // });
    
    let questionList = JSON.parse(fs.readFileSync('./questionList.json','utf-8'));
    // let questionFound = questionList.filter(question => question.id == questionId)[0];
    res.render('home', {
        question : questionList[Math.floor(Math.random() * questionList.length)],
    });
});

app.get('/ask', function(req,res) {
    res.render('ask');
});

app.post('/api/question', function(req, res) {
    console.log(req.body);
    let questionList = JSON.parse(fs.readFileSync('./questionList.json','utf-8'));

    console.log(questionList);

    let newQuestion = {
        questionContent: req.body.question,
        id: questionList.length,
        yes: 0,
        no: 0
    };
    questionList.push(newQuestion);
    fs.writeFileSync('./questionList.json', JSON.stringify(questionList), 'utf-8');

    res.redirect(`/question/${newQuestion.id}`);

});

app.get('/question/:id', function(req, res) {
    let questionId = req.params.id;
    let questionList = JSON.parse(fs.readFileSync('./questionList.json','utf-8'));

    let questionFound = questionList.filter(question => question.id == questionId)[0];
    res.render('question', {
        question : questionFound,
        totalVote : questionFound ? questionFound.yes + questionFound.no : null
    });
});

app

// app.get('/question/', function(req, res) {
//     let questionId = req.query.questionId;
//     let questionList = JSON.parse(fs.readFileSync('./questionList.json','utf-8'));

//     let questionFound = questionList.filter(question => question.id = questionId)[0];
//     res.render('question', {
//         question : questionFound,
//         totalVote :  questionFound.yes + questionFound.no
//     });
// });

app.get('/list', function(req, res) {
    let data = [
        "Sherlock Holmes",
        "John Watson",
        "Hung Arima"
    ]
    res.render('list', { data });
})

// fileSystem.writeFile("web12", JSON.stringify({a: 5, b: 10}));
// fileSystem.readFileNotSync('test.json', function(fileData) {
//     console.log(`Read File: ${fileData}`)
// })


// app.get('/', function (req, res) {
//     res.send("Homepage!");
// });

// app.get('/about', function (req, res) {
//     res.send("About page!");
// });

// app.get('/sendnude', function (req, res) {
//     console.log(__dirname);
//     res.sendFile(__dirname + "/unplash.jpg");
    
// });

// app.get('/blah', function (req, res) {
//     console.log(__dirname);
//     res.sendFile(path.resolve(__dirname, './public/index.html'));
    
// });

app.use(express.static('public'));

app.listen(8000, function(err) {
    if (err) console.log(err);
    else console.log("Server is up!");

});