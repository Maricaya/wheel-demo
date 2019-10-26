const program = require('commander');
const api = require('./index')

program
  .option('-x, --xxx', 'what the x')
program
  .command('add')
  .description('add a task')
  .action((...args) => {
    // 倒数第一个参数不要
    const words = args.slice(0, -1).join(' ')
    api.add(words)
  })
program
  .command('clear')
  .description('clear all tasks')
  .action((...args) => {
    // 倒数第一个参数不要
    const words = args.slice(0, -1).join(' ')
    // console.log('this is clear');
  })
program.parse(process.argv)