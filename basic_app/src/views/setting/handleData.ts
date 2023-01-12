/*
 * @Author: fg
 * @Date: 2023-01-12 16:30:40
 * @LastEditors: fg
 * @LastEditTime: 2023-01-12 17:38:10
 * @Description: 处理动态数据
 */
import config from "P/config/index.json";
const fs = require("fs");
import { join } from 'path'

class HandleData {
  private config: object;

  constructor() {
    this.config = config;
  }

  saveFile() {
    fs.readFile('public/config/index.json', 'utf-8', function (err: any, data: any) {
      if (err) {
        console.log(err)// eslint-disable-line
      } else {
        console.log(JSON.parse(data).basic)// eslint-disable-line
        config.basic.name = "basic setting"
        fs.writeFileSync('public/config/index.json', JSON.stringify(config))
      }
    })
    console.log('config/index.json')
  }
}

export default new HandleData();
