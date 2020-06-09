import darkTheme from '@ant-design/dark-theme';
import path from 'path';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin'
import { black } from '@/components/theme';
const themKeys = Object.keys(black);
export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        //配置语言
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          webpackChunkName: true,
        },
      },
    ],
  ],
  //umi会自动生成路由,只需文件配置与menu里的配置相同即可,component 是相对于 src/pages 目录的
  //但路由也可以手工配置,要精确匹配!
  // routes: [
  //   {
  //     path: '/',
  //     component: '../layouts',
  //     routes: [
  //       {
  //         path: 'login',
  //         component: './login'
  //       },
  //       {
  //         path: 'table/bigData',
  //         component: './table/bigData'
  //       },
  //       {
  //         path: 'table/nestedTable',
  //         component: './table/nestedTable'
  //       },
  //       {
  //         path: 'table/batchTable',
  //         component: './table/batchTable'
  //       },
  //       {
  //         path: 'table/resizable',
  //         component: './table/resizable'
  //       },
  //       {
  //         path: 'table/dividend',
  //         component: './table/dividend'
  //       },
  //       {
  //         path: 'charts/bar',
  //         component: './charts/bar'
  //       },
  //       {
  //         path: '/',
  //         component: './index'
  //       },
  //     ]
  //   },
  // ],
  //以下三个文件都是为了压缩文件的大小
  disableRedirectHoist: true,
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
    // modifyVars: darkTheme,
  },
  treeShaking: true,
  //用#的哈希路由
  history: 'hash',
  outputPath: "./web",
  // 禁用全局变量,避免多个umi冲突?
  // disableGlobalVariables:true,
  //兼容 ie11
  targets: {
    ie: 11,
  },
  // 主题色
  theme: {
    // '@primary-color': '#ff8b14',
    //  "@body-background":"#2e2e2e",
    //  "@component-background":"#2e2e2e",
  },
  // 代理,解决跨域问题
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  },
  externals: {
    "./cptable": "var cptable"
  },
  chainWebpack: config => {
    config.plugin("ant-design-theme").use(AntDesignThemePlugin, [
      {
        antDir: path.join(__dirname, './node_modules/antd'), //antd包位置
        stylesDir: path.join(__dirname, './src/styles'), //指定皮肤文件夹
        varFile: path.join(__dirname, './src/styles/variables.less'), //自己设置默认的主题色
        indexFileName: 'index.html',
        mainLessFile: path.join(__dirname, './src/styles/main.less'),
        outputFilePath: path.join(__dirname, '/color.less'), //输出到什么地方
        themeVariables: themKeys,
        generateOnce: false,
      }
    ])
  }
}
