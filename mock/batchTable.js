import mockjs from 'mockjs';

// mock tableList
let tableList = [];
tableList = mockjs.mock({
  'data|1370': [
    {
      'id|+1': 1,
      name: '@cname',
      'age|1-100': 50,
      sex: /男|女/,
      mobile: /^1[3-9][0-9]{9}$/,
      address: '@city',
      passed: "@boolean"
    },
  ],
});

// 查询
function getList(req, res) {
  const { sort, page, size } = req.body;
  let dataSource = tableList;
  // 排序
  if (sort && sort.length > 0) {
    const sorter = sort[0].split(' ')[1];
    const text = sort[0].split(' ')[0];
    dataSource.data.sort((pre, next) => {
      if (sorter == 'desc') {
        return next[text] > pre[text] ? 1 : -1;
      }
      return pre[text] > next[text] ? 1 : -1;
    });
  }
  //使用状态
  // if (params.status) {
  //   const status = params.status.split(',');
  //   let filterDataSource = [];
  //   status.forEach(s => {
  //     filterDataSource = filterDataSource.concat(
  //       dataSource.filter(data => parseInt(data.status, 10) === parseInt(s[0], 10)),
  //     );
  //   });
  //   dataSource = filterDataSource;
  // }
  // // 规则名称
  // if (params.name) {
  //   dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  // }
  // // 每页数量
  // let pageSize = 10;
  // if (params.pageSize) {
  //   pageSize = params.pageSize * 1;
  // }

  // const result = {
  //   list: dataSource,
  //   pagination: {
  //     total: dataSource.length,
  //     pageSize,
  //     current: parseInt(params.currentPage, 10) || 1,
  //   },
  // };
  res.status(200).send({
    list: {
      data: dataSource.data,
      current: page || 1,
      pageSize: size || 10,
      total: dataSource.length,
    },
    httpStatus: 200,
    msg: '查询成功',
  });
  // return res.json(result);
}

function updateList(req, res) {
  res.status(200).send({
    data: null,
    httpStatus: 200,
    msg: '修改成功',
  });
}

function update(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableList = tableList.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableList.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableList = tableList.map(item => {
        if (item.key === key) {
          Object.assign(item, { desc, name });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableList,
    pagination: {
      total: tableList.length,
    },
  };

  return res.json(result);
}

export default {
  'POST /batchTable/querylist': getList,
  'POST /batchTable/updateList': updateList,
};
