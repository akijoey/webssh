let count = 0

const generateID = (): string => {
  return (count++).toString()
}

export { generateID }
