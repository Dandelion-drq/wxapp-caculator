const ci = require('miniprogram-ci')

const project = new ci.Project({
    appid: 'wx414d8a4718cad505',
    type: 'miniProgram',
    projectPath: '.',
    privateKeyPath: './private.wx414d8a4718cad505.key',
    ignores: ['node_modules/**/*'],
})

async function preview() {
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
        onProgressUpdate: console.log,
        // pagePath: 'pages/index/index', // 预览页面
        // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
    })
    console.log('previewResult', previewResult)
}

// preview()

async function upload() {
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
        onProgressUpdate: console.log,
    })
    console.log('uploadResult', uploadResult)
}

upload()
