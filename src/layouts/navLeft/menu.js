const menuList = [
  {
    title: '首页',
    enTitle:'home',
    icon: 'home',
    key: '/'
  },
  {
    title: '表格',
    enTitle:'table',
    icon: 'table',
    key: '/table',
    children: [
      {
        title: '大数据表格',
        enTitle: 'bigData',
        key: '/table/bigData',
      },
      {
        title: '批量表格',
        enTitle: 'batchTable',
        key: '/table/batchTable',
      },
      {
        title: '高阶组件',
        enTitle: 'dividend',
        key: '/table/dividend',
      },
      {
        title: '可编辑表格',
        enTitle: 'editable',
        key: '/table/editable',
      },
    ]
  },
  {
    title: '图表',
    enTitle: 'charts',
    icon: 'bar-chart',
    key: '/charts',
    children: [
      {
        title: '柱状图',
        enTitle: 'bar',
        key: '/charts/bar',
      }
    ]
  },
  {
    title: '系统管理',
    enTitle: 'setting',
    icon: 'setting',
    key: '/system',
    children: [
      {
        title: '系统参数',
        enTitle: 'systemParam',
        icon: 'user',
        key: '/setting/systemParam',
      }
    ]
  },
];
export default menuList;