const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const axios = require('axios')
const mongoose = require('mongoose')
const utf8 = require('utf8')
const app = express()
const NewsAPI = require('newsapi')
const nodemailer = require("nodemailer")
const apikey = "577b0d2c8e9e4d579ed70cdc9a09aba0";
const newsapi = new NewsAPI('577b0d2c8e9e4d579ed70cdc9a09aba0');
const db = "mongodb+srv://bryanlovell:abcd1234@cluster0.oa8qz.mongodb.net/News?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000
const Articles = require('./articledb')



// Mongodb connection
mongoose.connect(db).then(() => { 
  console.log('connected');
})

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get('/', (req, res) => res.render('pages/index'))

app.get('/searchhistory', async (req, res) => {
  try {
    let articles = await Articles.find({}).sort({ createdAt: -1 }).limit(5)

    articles = articles.map((article) => {
      return {
        keyword: article.keyword
      }
    })

    res.status(200).json(articles)
  } catch(err) {
    res.status(500).send({ err: err.response })
  }
});

app.post('/delete', (req,res) => {
  var info = require('./articledb');
  info.remove({})
  .then((response) => {
    res.send({ })
  }).catch((err) => {
    res.status(500).send({ err })
  })

  // var info = require('./articledb');
  // info.remove({})
  // .then((response) => {
  //   console.log('Done')
  // }).catch((err) => {
  //   console.log('Error')
  // })
})


app.post('/searchnews', (req,res) => {
  var compname = req.body.comp;
  var info = require('./articledb');
  var news = [];
  var array = [];
  var old = [];
  
  const querystr = `https://newsapi.org/v2/everything?q=${compname}&apiKey=${apikey}`; //Get Api by link it to the url and api key
  axios.get(querystr).then((response) => {
    array.push(compname);
    if(response == null){
      console.log("error");
    }
    else{
      const querykeys = Object.keys(response.data.articles);
      for(var x=0;x < querykeys.length; x++) { //Reroll all the data into an array 
        var totalresult = response.data.totalResults;
        var sourcename = response.data.articles[x].source.name;
        var author = response.data.articles[x].author;
        var title = response.data.articles[x].title;
        var desc = response.data.articles[x].description;
        var url = response.data.articles[x].url;
        var img = response.data.articles[x].urlToImage;
        var date = response.data.articles[x].publishedAt;
        var content = response.data.articles[x].content;
        news = [{
            "total" : totalresult,
            "source" : sourcename,
            "author" : author,
            "title" : title,
            "desc" : desc,
            "url" : url,
            "img" : img,
            "date" : date,
            "content" : content
        }]
        array.push(news);
      }
      res.send(array); 
      inf = new info({
        keyword : compname
      })
      inf.save().then((result) => {
        var tdydate = new Date();
        tdydate.setHours(tdydate.getHours() + 8); //Set timezone to GMT + 8
      })
    }   
  }) 
})


  app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
