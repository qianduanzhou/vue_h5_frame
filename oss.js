const OSS = require('ali-oss')
const fs = require('fs')

/**
 * 阿里云配置
 * https://help.aliyun.com/document_detail/32068.html?spm=a2c4g.11174283.6.1265.561d7da2vhwnRs
 * 具体看官网
 */
const client = new OSS({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
});

//  阿里云远程目录
const objPath = 'test_dev'
//  本地build目录
const localPath = 'dist'
//  计数器
let fileNum = 0; 
let putNum = 0

//  上传阿里云
async function put(objName, localName) {
  //  普通上传
  // try {
  //   //object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
  //   let result = await client.put(`${objPath}${objName}`, `${localName}`);
  //   console.log(result);
  // } catch (e) {
  //   console.log(e);
  // }

  //  分片上传
  try {
    return client.multipartUpload(`${objPath}${objName}`, `${localName}`);
  } catch (e) {
   // 捕获超时异常
  if (e.code === 'ConnectionTimeoutError') {
    console.log("Woops,超时啦!");
    // do ConnectionTimeoutError operation
  }
    console.log(e)
  }
}

//  删除文件
async function deleteObj(objName) {
  try {
    await client.delete(objName);
    // console.log(result);
  } catch (e) {
    console.log(e);
  }
}  

//  查找桶文件并删除
async function findList(path) {
  let list = await client.list({
    prefix: `${objPath}${path}/`,
    delimiter: '/'
  });
  let arr = list.objects
  if (!arr) {
    return
  }
  for (let i = 0; i < arr.length; i++) {
    deleteObj(arr[i].name)
  }
}

//  分片上传进度
const progress = async function (p) {
  console.log(p);
};

//  判断文件类型并上传
async function putOss(path, files) {
  for (let i = 0; i < files.length; i++) {
    let is_direc = fs.lstatSync(`${path}${files[i]}`).isDirectory();// true || false 判断是不是文件夹
    if (is_direc) {
      await findList(`${path.replace(`./${localPath}`, '')}${files[i]}`)
      main(`${path}${files[i]}/`)
    } else {
      fileNum = fileNum + 1
      await put(`${path.replace(`./${localPath}`, '')}${files[i]}`, `${path}${files[i]}`)
      console.log('\x1b[32m', `${path}${files[i]}  上传完毕`)
      putNum = putNum + 1
    }
  }
  if (putNum == fileNum) {
    console.info('\x1b[34m', '======= 所有文件上传完毕 =======')
  }
}

//  入口函数
function main(path) {
  fs.readdir(path, async (err, files) => {
    if (err) throw err;
    putOss(path, files)
  })
}

main(`./${localPath}/`)