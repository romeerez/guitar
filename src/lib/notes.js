export const fretsCount = 19
const A4 = 440

const createString = (magicNumber) => {
  const string = []
  for (let i = 0; i <= fretsCount; i++, magicNumber--)
    string[i] = A4 / Math.pow(2, magicNumber / 12)
  return string
}

export default [5, 10, 14, 19, 24, 29].map(magicNumber => createString(magicNumber))

export const quartytoneRatio = Math.pow(2, 5 / 120)
