const express = require('express')
const app = express()

// 解决跨域的库
const cors = require('cors')
app.use(cors())

// json解析
app.use(express.json())

const mongoose = require('mongoose')
const userModel = require('./models/user')
mongoose.connect('mongodb://localhost/test', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

// 配置一个get请求路径
// http://localhost:5002/list

app.get('/list', async (req, res) => {
    try {
        const data = await userModel.find().sort({ createdAt: 'desc' })
        res.json(data)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.post('/add', async (req, res) => {
    const data = { title: req.body.title }
    let user = new userModel(data)
    try {
        await user.save()
        res.status(200).json({ data: true })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

app.put('/edit', async (req, res) => {
    if (!req.body._id) {
        res.status(500).json({ data: '没找到' })
        return
    }

    let user = await userModel.findById(req.body._id)
    user.title = req.body.title
    try {
        user = await user.save()
        res.status(200).json({ data: 'ok' })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.delete('/remove/:id', async (req, res) => {
    if (!req?.params?.id) {
        res.status(500).json({ data: '没找到' })
        return
    }
    try {
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ data: 'ok' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// 设置服务的监听端口
app.listen(5002)