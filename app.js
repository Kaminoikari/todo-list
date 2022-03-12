const bodyParser = require('body-parser') // 載入 body-parser
const Todo = require ('./models/todo') // 載入 Todo model
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require ('express-handlebars');
const methodOverride = require ('method-override')

// 引用路由器
const routes = require('./routes')
const app = express();

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true });

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine ('hbs', exphbs ({ defaultLayout: 'main', extname: '.hbs'}))
app.set ('view engine', 'hbs')


app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// 將 request 導入路由器
app.use(routes)

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
