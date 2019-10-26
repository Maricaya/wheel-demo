const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const p = require('path')
const fs = require('fs')
const dbPath = p.join(home, '.todo')

module.exports.add = (title) => {
    // 读取之前的任务
    fs.readFile(dbPath, {
        flag: 'a+'
    }, (error, data) => {
        if (error) {
            console.log(error)
        } else {
            let list
            try {
                list = JSON.parse(data.toString())
            } catch (error2) {
                list = []
            }
            const task = {
                title: title,
                done: false
            }
            list.push(task)
            console.log(list)
            const string = JSON.stringify(list)
            fs.writeFile(dbPath, string+'\n', (error3) => {
                if (error3) {
                    console.log(error3)
                }
            })
        }
    })
    // 添加一个title任务
    // 存储任务到文件
}