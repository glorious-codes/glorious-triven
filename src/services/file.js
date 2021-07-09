const path = require('path');
const fs = require('fs');
const glob = require('glob');
const fileSystem = require('file-system');

class FileService {
  constructor(dependencies = {}){
    this.fs = getDependency(dependencies, 'fs', fs);
    this.glob = getDependency(dependencies, 'glob', glob);
    this.fileSystem = getDependency(dependencies, 'fileSystem', fileSystem);
    this.req = getDependency(dependencies, 'req', require);
  }

  require(filepath){
    return this.req(filepath);
  }

  copySync(srcFilepath, destFilepath){
    this.fileSystem.copyFileSync(srcFilepath, destFilepath);
  }

  read(filepath, onSuccess){
    this.fs.readFile(filepath, (err, data) => {
      if(err) return console.log(`Failed to read ${filepath}`, err);
      onSuccess(data);
    });
  }

  readSync(filepath){
    return this.fs.readFileSync(filepath, 'utf-8');
  }

  readJSONSync(filepath){
    return JSON.parse(this.readSync(filepath));
  }

  getFileInfoByFilepath(filepath){
    const extension = path.extname(filepath);
    const name = path.basename(filepath, extension);
    return { name, extension: extension.replace('.','') };
  }

  collect(pattern, onSuccess, onError){
    this.glob(pattern, (err, files) => {
      if(err) return onError ? onError(err) : console.log(`Failed to collect ${pattern} files`, err);
      onSuccess(files);
    });
  }

  write(filepath, data, onSuccess, onError){
    this.fileSystem.writeFile(filepath, data, err => {
      if(err) return handleWriteError(err, filepath, onError);
      onSuccess && onSuccess();
    });
  }
}

function handleWriteError(err, filepath, onError){
  return onError ? onError(err) : console.log(`Failed to write ${filepath}`, err);
}

function getDependency(dependencies, dependencyName, rawDependency){
  return dependencies[dependencyName] || rawDependency;
}

let fileService = new FileService();

module.exports = {
  fileService,
  FileService
};
