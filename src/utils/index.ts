export const debounce = (cb: (...args: any[]) => void, wait = 20) => {
  let h = 0
  return (...args: any) => {
    clearTimeout(h)
    h = setTimeout(() => cb(...args), wait) as any
  }
}