export const debounce = (cb: (...args: any[]) => void, wait = 20) => {
  let h = 0
  return (...args: any) => {
    clearTimeout(h)
    h = setTimeout(() => cb(...args), wait) as any
  }
}

export const findGreaterThanOrEqual = (arr: number[], target: number) => {
  let low = 0, high = arr.length - 1
  while (low != high) {
    const mid = ~~((low + high) / 2)
    if (arr[mid] <= target)
      low = mid + 1
    else
      high = mid
  }
  return low
}

export const findLowerThanOrEqual = (arr: number[], target: number) => {
  let low = 0, high = arr.length - 1
  while (low != high) {
    const mid = ~~((low + high) / 2)
    if (arr[mid] >= target)
      low = mid + 1
    else
      high = mid
  }
  return low
}
