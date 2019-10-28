#!/usr/bin/env node
const program = require('commander');
const api = require('./index')
const pkg = require('./package.json')
program
  .version(pkg.version)
  .option('-x, --xxx', 'what the x')
program
  .command('add')
  .description('add a task')
  .action((...args) => {
    // 倒数第一个参数不要
    const words = args.slice(0, -1).join(' ')
    api.add(words).then(() => { console.log('添加成功') }, () => { console.log('添加失败') })
  })
program
  .command('clear')
  .description('clear all tasks')
  .action(() => { api.clear().then(() => { console.log('清除完毕') }, () => { console.log('清除失败') }) })

if (process.argv.length === 2) {
  // 没传递参数
  api.showAll()
}
program.parse(process.argv)