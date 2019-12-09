module.exports = (config) => {
  config.module.rules[2].oneOf[1].options.presets.push('mobx')
  return config
}
