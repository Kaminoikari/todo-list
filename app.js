const bodyParser = require('body-parser') // 載入 body-parser
const Todo = require ('./models/todo') // 載入 Todo model
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require ('express-handlebars');

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

app.get('/', (req, res) => {
  Todo.find() // 取出Todo model裡的所有資料
  .lean () // 把Mongoose的Model物件轉換成乾淨的Javascript資料陣列
  .sort ({_id: 'asc' }) // 按照建立id時間排序
  .then (todos => res.render ('index', {todos})) // 將資料傳給index樣板
  .catch (error => console.error(error)) // 錯誤處理
})

app.get ('/todos/new', (req, res) => {
  return res.render ('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  const todo = new Todo ({ name }) 
  // 從 Todo 產生一個實例，另一種寫法為忽略此行直接加入
  // return Todo.create({ name }) 取代 以下 return todo.save() 欄位

  return todo.save() // 存入資料庫
  .then(() => res.redirect('/')) // 新增完成後導入首頁
  .catch(error => console.log(error))
})

app.get ('/todos/:id', (req, res) => {
  const id = req. params.id
  return Todo.findById(id)
  .lean()
  .then((todo) => res.render('details', {todo} ))
  .catch(error => consoloe.log('error'))

})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) // 查詢資料
    .lean()
    .then (todo => res.render ('edit', { todo })) 
    .catch(error => console.log(error))
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id
  /* 
  原寫法：
  const name = req.body.name
  const isDone = req.body.isDone 
  */
  const { name, isDone } = req.body // 改使用解構賦值 (destructuring assignment)語法
  
  return Todo.findById(id) // 查詢資料
  .then (todo => {
    todo.name = name
    /*
    原寫法：
    if (isDone === 'on') {
    todo.isDone = true
    } else {
    todo.isDone = false
    }
    */
    todo.isDone = isDone === 'on'
    return todo.save()
  })
  .then(() => res.redirect (`/todos/${id}`)) // 如果儲存成功，導向首頁
  .catch(error => console.log(error))
})

app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000');
});
