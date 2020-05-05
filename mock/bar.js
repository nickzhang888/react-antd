import Mock from "mockjs"
import mockjs from 'mockjs';
function barInfo(req, res) {
    let data1 = [], data2 = [], data3 = []
    for (let i = 1; i <= 10; i++) {
        data1.push(mockjs.mock({
            id: i,
            cMonsimp: "<b>@cparagraph(1)</b>",
        }))
    }
    for (let i = 1; i <= 10; i++) {
        data2.push(mockjs.mock({
            id: i,
            cMonsimp: "<span style='color:red'>@cparagraph(1)<span>",
        }))
    }
    for (let i = 1; i <= 10; i++) {
        data3.push(mockjs.mock({
            id: i,
            cMonsimp: "@ctitle",
        }))
    }
    res.send({
        httpStatus: 200,
        msg: "查询成功",
        data: {
            1: data1,
            2: data2,
            3: data3,
            4: [
                {
                    name: "警告",
                    count: "23"
                },
                {
                    name: "一般错误",
                    count: "10"
                },
                {
                    name: "严重错误",
                    count: "14"
                }
            ],
        },
    })
}
export default {
    'GET /bar/list': barInfo,
}
