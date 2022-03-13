const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')
router.get('/new', (req, res) => {
  return res.render('new')
})
router.post('/', (req, res) => {
  const name = req.body.name
  return Todo.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo }))
    .catch(error => console.log(error))
})
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('edit', { todo }))
    .catch(error => console.log(error))
})
router.put('/:id', (req, res) => {
    const id = req.params.id
    /*
    原寫法：
    const name = req.body.name
    const isDone = req.body.isDone
    */
    const { name, isDone } = req.body // 改使用解構賦值 (destructuring assignment)語法

    return Todo.findById(id) // 查詢資料
      .then(todo => {
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
      .then(() => res.redirect(`/todos/${id}`)) // 如果儲存成功，導向首頁
      .catch(error => console.log(error))
  })

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
module.exports = router

