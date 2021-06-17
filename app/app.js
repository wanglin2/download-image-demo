const express = require('express')
const qr = require('qr-image')
const path = require('path')
const fs = require('fs')
const mime = require('mime-types')

// 创建应用
const app = express()

// 情况1.静态资源图片
app.use(express.static('./public', {
    setHeaders(res) {
        res.set('Access-Control-Allow-Origin', '*')
    }
}))

// 解析请求体
app.use(express.json())
app.use(express.urlencoded())

// 设置允许跨域
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
})

// 情况2.读取图片文件返回流
app.get('/getFileStream', (req, res) => {
    const fileName = req.query.name
    const stream = fs.createReadStream(path.resolve('./public/' + fileName))
    stream.pipe(res)
})

// 情况3.读取图片文件返回流并添加Content-Disposition响应头
app.get('/getAttachmentFileStream', (req, res) => {
    const fileName = req.query.name
    res.attachment(fileName);
    const stream = fs.createReadStream(path.resolve('./public/' + fileName))
    stream.pipe(res)
})

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-06-17 09:39:05 
 * @Desc: 情况4.动态生成图片返回流 
 */
app.get('/createQrCode', (req, res) => {
    // 生成二维码只读流
    const data = qr.image(req.query.text, {
        type: 'png'
    });
    data.pipe(res)
})

/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-06-17 15:20:06 
 * @Desc: 情况5.返回base64字符串
 */
app.get('/createBase64QrCode', (req, res) => {
    const data = qr.image(req.query.text, {
        type: 'png'
    });
    const chunks = []
    let size = 0
    data.on('data', (chunk) => {
        chunks.push(chunk)
        size += chunk.length
    })
    data.on('end', () => {
        const data = Buffer.concat(chunks, size)
        const base64 = `data:image/png;base64,` + data.toString('base64')
        res.send(base64)
    })
})
app.get('/getBase64File', (req, res) => {
    const fileName = req.query.name
    let bitmap = fs.readFileSync(path.resolve('./public/' + fileName))
    const base64 = `data:${mime.lookup(fileName)};base64,` + Buffer.from(bitmap).toString('base64')
    res.send(base64)
})


/** 
 * javascript comment 
 * @Author: 王林25 
 * @Date: 2021-06-17 14:00:26 
 * @Desc: 情况5.上述几种情况的post请求方式
 */
app.post('/getFileStream', (req, res) => {
    const fileName = req.body.name
    const stream = fs.createReadStream(path.resolve('./public/' + fileName))
    stream.pipe(res)
})
app.post('/getAttachmentFileStream', (req, res) => {
    const fileName = req.body.name
    res.attachment(fileName);
    const stream = fs.createReadStream(path.resolve('./public/' + fileName))
    stream.pipe(res)
})
app.post('/createQrCode', (req, res) => {
    // 生成二维码只读流
    const data = qr.image(req.body.text, {
        type: 'png'
    });
    data.pipe(res)
})

// 启动服务
app.listen(3000, () => {
    console.log('服务启动完成')
})