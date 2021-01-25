function Storage(): void {}
Storage.prototype = Object.create(null)

function parseArray(resultSet: any, arr: any[]): void {
  arr.forEach((item: any) => {
    parse(resultSet, item)
  })
}

function parseString(resultSet: any, str: string): void {
  const arr = str.split(/\s+/)
  arr.forEach((item: string) => {
    resultSet[item] = true
  })
}

function parseObject(resultSet: any, object: {}): void {
  for (const key in object) {
    if ({}.hasOwnProperty.call(object, key)) {
      resultSet[key] = !!object[key as keyof {}]
    }
  }
}

function parseNumber(resultSet: any, num: number): void {
  resultSet[num] = true
}

function parse(resultSet: any, arg?: any): void {
  if (arg !== undefined) {
    const argType = typeof arg
    if (Array.isArray(arg)) {
      parseArray(resultSet, arg)
    } else if (argType === 'string') {
      parseString(resultSet, arg)
    } else if (argType === 'object') {
      parseObject(resultSet, arg)
    } else if (argType === 'number') {
      parseNumber(resultSet, arg)
    }
  }
}

const classes = (...args: any[]): string => {
  const classSet = new (Storage as any)()
  parseArray(classSet, args)
  const list = []
  for (const key in classSet) {
    if (classSet[key] as boolean) {
      list.push(key)
    }
  }
  return list.join(' ')
}

export const classPrefix = (prefix: string): Function => {
  return function (name?: string) {
    return [prefix, name].filter(Boolean).join('-')
  }
}

export default classes
