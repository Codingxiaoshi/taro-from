import cloneDeep from 'lodash/cloneDeep'

export const generatorState = (conf) => {
    let tempObj = {}
    let config = cloneDeep(conf)
    let optionsIsArray = ['radio', 'checkbox']
    if (Array.isArray(config)) {
      config.forEach(opt => {
        const { key, type, defaultValue } = opt
        if (defaultValue) {
          tempObj[key] = defaultValue
        } else if (optionsIsArray.indexOf(type.compName) !== -1) {
          let defaultItems = type.props.options.filter(v => v.isDefault)
          if (defaultItems.length === 1) {
            tempObj[key] = defaultItems[0].value
          } else if (defaultItems.length > 1) {
            tempObj[key] = defaultItems.map(v => v.value)
          }
        } else {
          tempObj[key] = ''
        }
      })
    }
    return tempObj
  }
