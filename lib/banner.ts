import { note } from 'lognote'
import { description, homepage, bugs, author, license } from '../package.json'

const banner = `
██╗    ██╗███████╗██████╗ ${note.blueBright('███████╗███████╗██╗  ██╗')}
██║    ██║██╔════╝██╔══██╗${note.blueBright('██╔════╝██╔════╝██║  ██║')}
██║ █╗ ██║█████╗  ██████╔╝${note.blueBright('███████╗███████╗███████║')}
██║███╗██║██╔══╝  ██╔══██╗${note.blueBright('╚════██║╚════██║██╔══██║')}
╚███╔███╔╝███████╗██████╔╝${note.blueBright('███████║███████║██║  ██║')}
 ╚══╝╚══╝ ╚══════╝╚═════╝ ${note.blueBright('╚══════╝╚══════╝╚═╝  ╚═╝')}
`

const [name, email] = author.split(' ')
const repository = homepage.split('#')[0]

const motd = `
${description}

Click the ${note.blueBright.bold(
  '`Add`'
)} button at the top left to create a new connection.
Click the ${note.blueBright.bold(
  '`Settings`'
)} button at the top right to edit preferences.

${note.bold('Repository')}: ${note.cyan.underline(repository)}
${note.bold('Homepage')}: ${note.cyan.underline(homepage)}
${note.bold('Report Bugs')}: ${note.cyan.underline(bugs)}

${note.bold('Author')}: ${note.cyanBright.bold(name)} ${note.cyanBright(email)}
${note.bold('License')}: ${note.cyanBright.bold(license)}

Enjoy it! 🎉
`

export default banner
export { motd }
