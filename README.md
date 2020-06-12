# taro-from
基于 taro-ui 的小程序工具，通过配置实现 Form 表单

	注意：
		1. 文件上传只支持“云开发”

## 效果图

![1]()

## 实例

```javascript
import Taro, { Component } from '@tarojs/taro'
import { 
    TaroFrom, // 表单组件
    generatorState  // 生成表单值
} from 'taro-from'

// 表单配置
let formOptions = [
    {
        key: 'name', // 文件上传
        type: {
            /*
                compName 字段支持： 
                        input, 
                        radio, 
                        checkbox, 
                        textarea, 
                        switch,
                        files
            */
            compName: 'input', 
            props: {
                label: '姓名',
                placeholder: '请输入你的姓名'
            }
        },
        defaultValue: '小龙女'
    }
]

export default class Index extends Component {
    state = {
        // 初始化 state
        tempObj: generatorState(formOptions)
    }
    formChange = (data) => this.setState({ tempObj: data })
    render() {
        return (
            <View>
                { /* 调用组件 */ }
                <TaroFrom 
                    data={this.state.tempObj}
                    options={formOptions}
                    onChange={this.formChange}
                />
                <button>Submit</button>
            </View>
        )
    }
}
```

## 组件参数

|属性|类型|默认值|必填|说明|
|--|--|--|--|--|
|data| JSON | 无 | 是 | 表单的初始数据 |
|options| JSON | 无 | 是 | 表单的配置 |
| onChange | Function | 无 | 是 | Form 表单值发生改变的回调函数 |

## options: 表单配置

|属性|类型|默认值|必填|说明|可选值|
|--|--|--|--|--|--|
|key|string|无|是| form 字段的 key |
|type|JSON|无|是| 描述 form 字段 |
|type.compName|string| 无 | 是 | 调用表单组件 |input, radio, checkbox, textarea, switch, files | 
|type.props|JSON|无|是| 除去 label 以外, 其他的属性都参考 [taro-ui](https://taro-ui.aotu.io/#/docs/input) |
|type.props.label|string|无|否|字段的文本标题|
|defaultValue|string|''|否|表单属性的默认值|

## 小程序交流群
    联系我：你可以告诉我你遇到的问题，或者提出意见
    备注：小程序
![](./access/weChartCode.jpg)

## 版本日志
- [未来版本] 1.1.0
    - 支持： InputNumber 数字输入 Rate 评分 Slider 滑动条Range
- [2020-6-12] 1.0.0
    - 支持： radio 文本框, radio 单选， checkbox 多选, textarea 多行文本， switch 开关, files 图片上传
    - 初始化 state : generatorState(options)
