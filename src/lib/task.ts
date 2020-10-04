import {observable, action} from "mobx";

const defineObjectProperty = (wrapper, object, key) =>
  Object.defineProperty(wrapper, key, {
    get: () => object[key],
    set: (value) => object[key] = value
  })

const defineObject = (wrapper) => {
  const object = observable({
    state: 'initial',
    get initial() { return this.state === 'initial' },
    get pending() { return this.state === 'pending' },
    get success() { return this.state === 'success' },
    error: null,
    set: action((value) => {
      object.state = value
    })
  })
  wrapper.object = object;
  ['State.js', 'initial', 'pending', 'success', 'error'].forEach((key) =>
    defineObjectProperty(wrapper, object, key)
  )
}

const promiseHandler = async (target, wrapper, resolve, reject) => {
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

const run = (wrapper, args) => {
  wrapper.args = args
  return new Promise(wrapper.handler)
}

const factory = (target, original, wrapper) => {
  if (!wrapper) wrapper = (...args) => run(wrapper, args)

  wrapper.original = original
  wrapper.handler = promiseHandler.bind(null, target, wrapper)

  defineObject(wrapper)

  return wrapper
}

const task = (target, property, descriptor) => {
  if (!property) {
    return factory(null, target)
  } else {
    descriptor.value = factory(target, descriptor.value)
    return descriptor
  }
}

task.once = (target, property, descriptor) => {
  const wrapper = (...args) => wrapper.promise || (wrapper.promise = run(wrapper, args))
  descriptor.value = factory(target, descriptor.value, wrapper)
  return descriptor
}

task.cached = (target, property, descriptor) => {
  const wrapper = (...args) => {
    const key = JSON.stringify(args)
    wrapper.cache[key] || (wrapper.cache[key] = run(wrapper, args))
  }

  wrapper.cache = {}
  wrapper.resetCache = (...args) => delete wrapper.cache[JSON.stringify(args)]

  descriptor.value = factory(target, descriptor.value, wrapper)
  return descriptor
}

export default task
