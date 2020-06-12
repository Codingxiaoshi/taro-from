import Taro, { Component } from '@tarojs/taro'
import { View, Image } from "@tarojs/components"
import {
  AtInput, AtRadio,
  AtCheckbox, AtTextarea, AtSwitch
 } from "taro-ui"

import './index.css'

const getFileName = (s) => {
  s = s.split('://')[1]
  s = s.split('.')
  let fileName = s[s.length - 2]+'.'+s[s.length-1]
  return fileName
}

class SetForm extends Component {

  getOptionsMap = () => {
    const { options } = this.props
    let optionsMap = {}
    if (Array.isArray(options)) {
      return options.reduce((res, item) => {
        res[item.key] = item
        return res
      }, {})
    }
    return {}
  }

  changeState = (v, key) => {
    const { data, onChange, options } = this.props
    data[key] = v
    if (typeof onChange === 'function') {
      onChange(data, options)
    }
  }

  renderCheckbox = (type, key) => {
    const { data } = this.props
    let label = type.props.label
    return (
      <View>
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        <AtCheckbox
          {...type.props}
          selectedList={data[key]}
          onChange={v => this.changeState(v, key)}
        />
      </View>
    )
  }

  renderRadio = (type, key) => {
    const { data } = this.props
    const { label, options } = type.props
    return (
      <View>
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        {
          Array.isArray(options) && options.length && (
            <AtRadio
              {...type.props}
              value={data[key]}
              data-key={key}
              onClick={v => this.changeState(v, key)}
            />
          )
        }
        {
          Array.isArray(options) && options.length === 0 && (
            <View>
              暂无选项
            </View>
          )
        }
      </View>
    )
  }

  renderTextArea = (type, key) => {
    const { data } = this.props
    const { label } = type.props
    return (
      <View>
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        <AtTextarea
          {...type.props}
          value={data[key]}
          onChange={v => this.changeState(v, key)}
        />
      </View>
    )
  }

  renderSwitch = (type, key) => {
    const { label } = type.props
    const { data } = this.props
    return (
      <View>
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        <AtSwitch
          {...type.props}
          checked={data[key]}
          onChange={v => this.changeState(v, key)}
        />
      </View>
    )
  }

  uploadImg = async (key) => {
    const { data } = this.props;
    let fileOptions = this.getOptionsMap()[key]
    const { maxFileCount } = fileOptions.type.props
    let local_imgs = await Taro.chooseImage({
      count: maxFileCount,
      sizeType: ['compressed']
    })
    Taro.showLoading()
    for (let f of local_imgs.tempFilePaths) {
      if (data[key].length < maxFileCount) {
        let filename = getFileName(f)
        // 上传
        let res = await Taro.cloud.uploadFile({
                  cloudPath: `file/${filename}`,
                  filePath: f
                })
        data[key].push(res.fileID)
      }
    }
    Taro.hideLoading()
    this.changeState(data[key], key)
  }
  showImg = (e) => {
    const { data } = this.props
    const { file, key } = e.currentTarget.dataset
    Taro.previewImage({
      current: file,
      urls: data[key]
    })
  }
  delImg = (e) => {
    const { data } = this.props
    const { index, key } = e.currentTarget.dataset
    data[key].splice(index, 1)
    this.changeState(data[key], key)
  }
  renderFiles = (type, key) => {
    const { label } = type.props
    const { data, options } = this.props
    let contentWidth = `${(data[key].length) * 158}rpx`
    let fileOptions = this.getOptionsMap()[key]
    const { maxFileCount } = fileOptions.type.props
    if (data[key].length < maxFileCount) {
      contentWidth = `${(data[key].length + 1) * 158}rpx`
    }

    return (
      <View >
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        <ScrollView scrollX className='files' >
          <View className='' style={{ width: contentWidth}} >
            {
              Array.isArray(data[key]) && data[key].map((fileID, i) => {
                return (
                  <View
                    className='files-img'
                    key={fileID}
                  >
                    <View
                      className='files-img_del'
                      data-key={key}
                      data-index={i}
                      onClick={this.delImg}
                    >
                      ×
                    </View>
                    <Image
                      className='files-img_img'
                      mode='aspectFill'
                      data-file={fileID}
                      data-key={key}
                      onClick={this.showImg}
                      src={fileID}
                    />
                  </View>
                )
              })
            }
            {
              Array.isArray(data[key]) &&
              data[key].length < maxFileCount &&
              (
                <View className='files-btn' onClick={() => this.uploadImg(key)} >
                  <View className='files-btn_x' ></View>
                  <View className='files-btn_y' ></View>
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
    )
  }

  renderInput = (type, key) => {
    const { data } = this.props
    const { label } = type.props
    return (
      <View >
        {
          label && (
            <View className='filed' >
              {label}
            </View>
          )
        }
        <AtInput
          {...type.props}
          value={data[key]}
          data-key={key}
          onChange={(v) => this.changeState(v, key)}
        />
      </View>
    )
  }

  renderForm = () => {
    const { options } = this.props
    return (
        <View>
            {
              Array.isArray(options) &&options.map((opt, i) => {
                const { type, key } = opt
                if (opt.type.compName === 'input') {
                  return this.renderInput(type, key);
                } else if (opt.type.compName === 'radio') {
                  return this.renderRadio(type, key);
                } else if (opt.type.compName === 'checkbox') {
                  return this.renderCheckbox(type, key);
                } else if (opt.type.compName === 'textarea') {
                  return this.renderTextArea(type, key);
                } else if (opt.type.compName === 'switch') {
                  return this.renderSwitch(type, key);
                } else if (opt.type.compName === 'files') {
                  return this.renderFiles(type, key)
                }
                return <View key={i} />
              })
            }
        </View>
    )
  }

  render() {
    return (
      <View>
        {this.renderForm()}
      </View>
    )
  }
}

export default SetForm
