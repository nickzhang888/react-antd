import mockjs from 'mockjs';
const Random = mockjs.Random;

export default {
  'POST /dividend/getList': (req, res) => {
    const {
      page,
      size,
      sort,
      start,
      end,
      fundCode
    } = req.body;
    let data = {}, newData = [];
    data = mockjs.mock({
      'data|137': [{
        'nId|+1': 1,
        payStatus: "待发送",
        payFailCause: null,
        fundCode: '@name',
        fundName: '@cname',
        fundType: '@city',
        dividendDate: '@dateTime("2019-MM-dd")',
        bank: /农业银行|工商银行|建设银行/,
        balance: '@float(1,10000,0,2)',
        //   balance: '@natural(1,10000)',
      }],
    });
    if (sort && sort.length > 0) {
      const sorter = sort[0].split(' ')[1];
      const text = sort[0].split(' ')[0];
      data.data.sort((pre, next) => {
        if (sorter == 'desc') {
          return next[text] > pre[text] ? 1 : -1;
        }
        return pre[text] > next[text] ? 1 : -1;
      });
    }
    if (start || end) {
      newData = data.data.filter(item => {
        return item.dividendDate >= start && item.dividendDate <= end;
      });
    }
    if (fundCode && fundCode.length > 0) {
      newData = data.data.filter(item => fundCode.some(each => each == item.fundName))
    }
    res.status(200).send({
      data: {
        data: start || end || (fundCode && fundCode.length > 0) ? newData : data.data,
        current: page,
        pageSize: size,
        total: start || end || (fundCode && fundCode.length > 0) ? newData.length : data.data.length,
      },
      httpStatus: 200,
      msg: '查询成功',
    });
  },
  'POST /dividend/sendService': (req, res) => {
    const {
      nId
    } = req.body;
    let data = {};
    data = mockjs.mock({
      'nId|+1': nId,
      payStatus: "已发送",
      payFailCause: "余额不足!",
      fundCode: '@name',
      fundName: '@cname',
      fundType: '@city',
      dividendDate: '@dateTime("2019-MM-dd")',
      bank: /农业银行|工商银行|建设银行/,
      balance: '@float(1,10000,0,2)',
      // balance: '@natural(1,10000,0,2)',
    },

    );
    setTimeout(() => {
      res.status(200).send({
        data,
        httpStatus: 417,
        msg: '发送失败',
      })
    }, 200)
  },
  'POST /dividend/getSelect': (req, res) => {
    let data = {};
    data = mockjs.mock({
      'list|5300': [{
        'nId|+1': 1,
        fundCode: Random.string('upper', 5),
        fundName: '@cname',
      }],
    });

    res.status(200).send({
      data: data.list,
      httpStatus: 200,
      msg: '查询成功',
    });
  },
};
