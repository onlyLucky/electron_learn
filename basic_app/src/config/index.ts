export default {
  "basic": {
    "name": "basic",
    "description": "基础设置",
    "show": true,
    "children": []
  },
  "windows": {
    "name": "windows",
    "description": "窗口设置",
    "show": true,
    "closeAppMode": 0,
    "winsNum": 3,
    "children": [
      {
        "name": "closeAppMode",
        "description": "关闭主窗口",
        "type": "RadioGroup",
        "value": "",
        "props": {
          "data": [
            {
              "label": "最小化到托盘，不退出程序",
              "value": 0
            },
            {
              "label": "退出程序",
              "value": 1
            }
          ]
        }
      },
      {
        "name": "winsNum",
        "description": "窗口个数",
        "type": "RadioGroup",
        "value": 3
      }
    ]
  },
  "language": {
    "name": "language",
    "description": "语言与文字",
    "show": true,
    "isShowReset": false,
    "isNeedReload": true,
    "lang": "zh-CN",
    "children": [
      {
        "name": "lang",
        "description": "切换语言",
        "type": "Select",
        "props": {}
      }
    ]
  },
  "network": {
    "name": "network",
    "description": "网络配置",
    "show": true,
    "baseUrl": "http://192.168.19.89:8888",
    "children": [
      {
        "name": "baseUrl",
        "description": "代理网络",
        "type": "Input",
        "props": {}
      }
    ]
  }
}