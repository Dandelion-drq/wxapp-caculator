const ci = require('miniprogram-ci')
const AppConfig = require('./appConfig')

const project = new ci.Project({
    appid: AppConfig.appid,
    type: 'miniProgram',
    projectPath: '.',
    privateKeyPath: AppConfig.privateKeyPath,
    ignores: ['node_modules/**/*'],
})

// 预览
async function preview() {
    console.log('生成预览二维码中...')

    let qrcodePath = './preview-qrcode.jpg'
    const previewResult = await ci.preview({
        project,
        desc: 'ci预览 ' + (new Date()).toLocaleString(), // 此备注将显示在“小程序助手”开发版列表中
        setting: {
            es6: true,
            es7: true,
            minify: true,
            codeProtect: true,
            autoPrefixWXSS: true
        },
        qrcodeFormat: 'image',
        qrcodeOutputDest: './preview-qrcode.jpg',
        // onProgressUpdate: console.log,
        // pagePath: 'pages/index/index', // 预览页面
        // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    })
    console.log('二维码生成成功，路径：' + qrcodePath)
}

// 上传代码
async function upload() {
    console.log('开始上传代码...')

    const uploadResult = await ci.upload({
        project,
        version: '1.0.0',
        desc: 'ci上传 ' + Date().toString(), // 此备注将显示在“小程序助手”开发版列表中
        setting: {
            es6: true,
            es7: true,
            minify: true,
            codeProtect: true,
            autoPrefixWXSS: true
        },
        // onProgressUpdate: console.log,
    })

    console.log('代码上传成功', uploadResult)
}

// 构建npm
async function buildNpm() {
    console.log('开始构建npm包...')

    // 在有需要的时候
    const warning = await ci.packNpm(project, {
        // ignores: ['pack_npm_ignore_list'],
        reporter: (infos) => { console.log(infos) }
    })
    console.warn(warning)

    // // 可对warning进行格式化
    // warning.map((it, index) => {
    //     return `${index + 1}. ${it.msg}
    //     \t> code: ${it.code}
    //     \t@ ${it.jsPath}:${it.startLine}-${it.endLine}`
    // }).join('---------------\n')

    console.log('构建npm包成功')
}

async function getDevSourceMap() {
    await ci.getDevSourceMap({
        project,
        robot: 1,
        sourceMapSavePath: './sm.zip'
    })
}

async function main() {
    // await buildNpm()
    await preview()
    await upload()
}

main()