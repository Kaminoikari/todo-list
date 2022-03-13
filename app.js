const bodyParser = require('body-parser') // 載入 body-parser
const Todo = require ('./models/todo') // 載入 Todo model
const express = require('express')
const exphbs = require ('express-handlebars')

const methodOverride = require ('method-override')

// 引用路由器
const routes = require('./routes')
require('./config/mongoose') 

const app = express();

app.engine ('hbs', exphbs ({ defaultLayout: 'main', extname: '.hbs'}))
app.set ('view engine', 'hbs')


app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
