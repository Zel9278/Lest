import fs from 'fs'
import path from 'path'

export function commandLoader(_path: string) {
  let loaded: any = {}
  if (!fs.existsSync(_path)) return loaded
  const dir = fs.readdirSync(_path)
  for (const file of dir) {
    const filePath = path.join(_path, file)
    const fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) {
      loaded[file] = commandLoader(filePath);
    }

    if (file.endsWith('.js')) {
      const fileData = require(filePath)
      const fileName = file.replace(/.js/, '')
      if (fileName && fileName.length > 0) {
        loaded[fileName] = fileData
      }
    }
  }
  return loaded
}

export function listenerLoader(_path: string) {
  const loaded: any = {}
  if (!fs.existsSync(_path)) return loaded
  const dir = fs.readdirSync(_path)
  for (const file of dir) {
    const filePath = path.join(_path, file)
    const fileStat = fs.statSync(filePath)
    if (fileStat.isDirectory()) return
    if (file.endsWith('.js')) {
      const fileData = require(filePath)
      const fileName = file.replace(/.js/, '')
      if (fileName && fileName.length > 0) {
        loaded[fileName] = fileData
      }
    }
  }
  return loaded
}
