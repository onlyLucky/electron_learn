/*
 * @Author: fg
 * @Date: 2023-01-12 16:30:40
 * @LastEditors: fg
 * @LastEditTime: 2023-01-13 17:41:37
 * @Description: 处理动态数据
 */

const fs = require("fs");
import { join } from 'path'
import type { ConfigType } from 'typing/config'
import { ipcRenderer } from 'electron'
// import { ConfigType } from "

class HandleData {
  private config: ConfigType;
  readonly app_url: string;
  public menu: any[] = [];

  constructor() {
    this.config = {} as ConfigType;
    this.app_url = localStorage.getItem('app_url') || ''
    this.init()
  }

  init() {
    this.readFile()
  }

  readFile() {
    this.menu = []
    this.config = JSON.parse(fs.readFileSync(join(this.app_url, '/config.json'), { encoding: 'utf8' }))
    let key: keyof ConfigType
    for (key in this.config) {
      if (this.config.hasOwnProperty(key)) {
        console.log(this.config[key], 'this.config[key]')
      }
    }
  }

  saveFile() {
    console.log(this.config, 'config')
    this.config.language.lang = 'en-US'
    fs.writeFileSync(join(this.app_url, '/config.json'), JSON.stringify(this.config))
    ipcRenderer.send('set_config', this.config)
    /* fs.readFile(join(localStorage.getIt), 'utf-8', function (err: any, data: any) {
      if (err) {
        console.log(err)// eslint-disable-line
      } else {
        console.log(JSON.parse(data).basic)// eslint-disable-line
        // config.language.lang = ""
        // fs.writeFileSync('public/config/config.backup.json', JSON.stringify(config))
      }
    }) */
  }
}

export default new HandleData();
