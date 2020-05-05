import Mock from "mockjs"

function subList(req, res) {
  const { page, size, sort } = req.body
  const data = [];
  for (let i = 0; i < 28; ++i) {
    data.push(Mock.mock({
      key: i,
      task: `任务${i}`,
      method: /定时|清算后|核算后/,
      startTime: '@datetime("yyyy-MM-dd")',
      endTime: '@datetime("yyyy-MM-dd")',
      creater: /admin|user/,
      createDate: '@datetime("yyyy-MM-dd")',
      subList: [
        {
          key: `1${i}`,
          indicator: `估值表锁定监控指标1${i}`,
          switch: true,
          creator: `admin`,
          createAt: '@datetime("yyyy-MM-dd")',
        },
        {
          key: `2${i}`,
          indicator: `估值表锁定监控指标2${i}`,
          switch: false,
          creator: `zyl`,
          createAt: '@datetime("yyyy-MM-dd")',
        },
      ],
    }));
  }

  res.send({
    httpStatus: 200,
    msg: "查询成功",
    data: {
      dataSource: data,
      current: page,
      pageSize: size,
      total: data.length
    }
  })
}
export default {
  'POST /api/nestQuery': subList,
}
