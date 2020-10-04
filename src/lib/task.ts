import {observable, action} from "mobx"

type Wrapper = {
  (...args: []): any
  original: Function
  handler: (resolve: Function, reject: Function) => void
  args: any[]
  object: WrapperObject
}

type State = 'initial' | 'pending' | 'success' | 'error'

type WrapperObject = {
  state: State
  initial: boolean
  pending: boolean
  success: boolean
  error: any
  set: (state: State) => void
}

const defineObjectProperty = (wrapper: Object, object: any, key: string) =>
  Object.defineProperty(wrapper, key, {
    get: () => object[key],
    set: (value) => object[key] = value
  })

const defineObject = (wrapper: Wrapper) => {
  const object = observable<WrapperObject>({
    state: 'initial',
    get initial() { return this.state === 'initial' },
    get pending() { return this.state === 'pending' },
    get success() { return this.state === 'success' },
    error: null,
    set: action((value: State) => {
      object.state = value
    })
  })
  wrapper.object = object;
  ['State.js', 'initial', 'pending', 'success', 'error'].forEach((key) =>
    defineObjectProperty(wrapper, object, key)
  )
}

const promiseHandler = async (target: any, wrapper: Wrapper, resolve: Function, reject: Function) => {
  wrapper.object.set('pending')
  try {
    const result = await wrapper.original.apply(target, wrapper.args)
    wrapper.object.set('success')
    resolve(result)
  } catch (err) {
    wrapper.object.set('error')
    wrapper.object.error = err
    reject(err)
  }
}

const run = (wrapper: Wrapper, args: any[]) => {
  wrapper.args = args
  return new Promise(wrapper.handler)
}

const factory = (target: any, original: Function, wrapper?: Wrapper) => {
  if (!wrapper) wrapper = ((...args: any[]) => run(wrapper as Wrapper, args)) as Wrapper

  wrapper.original = original
  wrapper.handler = promiseHandler.bind(null, target, wrapper)

  defineObject(wrapper)

  return wrapper
}

type Decorator = (target: Object, key: string) => void

type Task = Decorator & {
  once: Decorator
  cached: Decorator
}

const task = (<T>(target: Object, key: string, descriptor: PropertyDescriptor) => {
  descriptor.value = factory(target, descriptor.value)
}) as Task

task.once = ((target: Object, property: string, descriptor: PropertyDescriptor) => {
  type OnceWrapper = Wrapper & { promise?: Promise<any> }

  const wrapper = ((...args: any[]) =>
    wrapper.promise || (wrapper.promise = run(wrapper, args))
  ) as OnceWrapper

  descriptor.value = factory(target, descriptor.value, wrapper)
}) as Decorator

task.cached = ((target: Object, property: string, descriptor: PropertyDescriptor) => {
  type CachedWrapper = Wrapper & {
    cache: { [key: string]: any },
    resetCache: (...args: any[]) => void
  }

  const wrapper = ((...args) => {
    const key = JSON.stringify(args)
    wrapper.cache[key] || (wrapper.cache[key] = run(wrapper, args))
  }) as CachedWrapper
  wrapper.cache = {}
  wrapper.resetCache = (...args) => delete wrapper.cache[JSON.stringify(args)]

  descriptor.value = factory(target, descriptor.value, wrapper)
}) as Decorator

export default task
