import mockjs from 'mockjs';
const Random = mockjs.Random;

export default {
    'GET /editable/editableInfo': (req, res) => {
        const {
            page,
            size,
        } = req.query;
        let data = {}
        data = mockjs.mock({
            'data|137': [{
                'key|+1': 1,
                name: '@cname',
                'age|1-100': 20,
                city: '@city',
                province: "@province",
                hobby: "@hobby",
                cityArr:[]
            }],
        });

        res.status(200).send({
            data: {
                data: data.data,
                current: +page || 1,
                pageSize: +size || 10,
                total: data.data.length,
            },
            httpStatus: 200,
            msg: '查询成功',
        });
    },
};
