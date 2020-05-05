import React from 'react';
import { Icon } from 'antd';
import { parse, stringify } from 'qs';
import moment from 'moment';
import xlsx from "xlsx"
import xlsxStyle from "xlsx-style"

export function keepNdecimal(num, decimal) {
  // 判断是否为数字
  if (isNaN(parseFloat(num))) {
    return false;
  }
  if (decimal) {
    // 四舍五入
    let params = Math.pow(10, decimal);
    num = (Math.round(num * params) / params).toString();
    let hasPoint = num.indexOf('.');
    if (hasPoint < 0) {
      hasPoint = num.length;
      num += '.';
    }
    // 保留n位小数
    while (num.length <= hasPoint + decimal) {
      num += '0';
    }
  }
  // 千分位展示
  let parts = num.toString().split('.');
  // 数字(从右到左)要是3的倍数,且后面不能是数字了
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const insertComma = (e, sign = ",") => {
  let parts = typeof (e) == "object" ? e.target.value.toString().split('.') : e.toString().split('.');
  // 数字(从右到左)要是3的倍数,且后面不能是数字了
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const removeComma = (e) => {
  let value = e.target.value
  if (value) {
    if (value.includes(",")) {
      value = value.split(",").join("")
    }
  }
  return value
}

export const validateForm = (int, decimal, msg = "必填项") => {
  return {
    required: true,
    validator: (rule, value, callback) => {
      let length, length_decimal, newValue;
      newValue = value.includes(",") ? value.split(",").join("") : value
      if (!newValue) {
        callback(`请输入${msg}`)
      } else if (isNaN(newValue)) {
        callback("请输入数字")
      } else if (newValue <= 0) {
        callback(`${msg}需大于0`)
      } else {
        if (newValue.includes(".")) {
          length = newValue.split(".")[0].length
          length_decimal = newValue.split(".")[1].length
        } else {
          length = newValue.length
        }
        if (length > int || length_decimal > decimal) {
          callback(`整数最多${int},小数最多${decimal}`)
        }
      }
      callback()
    }
  }
}


//导出文件
export function postFile(params) {
  fetch(`${url}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then(res => {
    if (res.httpStatus == 200) {
      res.blob.then(response => {
        let a = document.crateElement('a');
        // window.URL是将一个blob或者file对象读取成一个url
        const url = window.URL.createObjectURL(blob);
        // 对返回的进行解码,获取文件类型
        const filename = decodeURI(response.headers.get('Content-Disposition').split(';')[1].split('=')[1]);
        a.href = url;
        a.download = filename;
        // 兼容火狐浏览器
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    } else {
      res.json.then(res => {
        msg.error(res.msg);
      });
    }
  });
}
// 排序表头封装
export function generateTitle(name, key, sortArrKey, sortColumns, index, handleClickHeader) {
  return (
    <a onClick={handleClickHeader}>
      {name}
      <Icon type={sortColumns[index].order == 'asc' ? 'caret-up' : sortColumns[index].order == 'desc' ? 'caret-down' : ''} />
      {sortArrKey.includes(key) ? sortArrKey.indexOf(key) + 1 : ''}
    </a>
  );
}
//排序方法
export function sortTable(type, sortColumns, sortArr, sortArrKey) {
  let exist = sortColumns.find(item => item.columnKey == type);
  if (exist) {
    if (exist.order == '') {
      exist.order = 'asc';
    } else if (exist.order == 'asc') {
      exist.order = 'desc';
    } else {
      exist.order = '';
    }
  }
  // 判断数组中是否含有该项
  let index = sortArr.findIndex(item => item.split(' ')[0] == exist.columnKey);
  // 没有的话就push到数组中,有的话就会被替换掉
  if (index > -1) {
    sortArr.splice(index, 1, `${exist.columnKey} ${exist.order}`);
    sortArrKey.splice(index, 1, `${exist.columnKey}`);
  } else {
    // index=-1的情况下
    sortArr.push(`${exist.columnKey} ${exist.order}`);
    sortArrKey.push(`${exist.columnKey}`);
  }
  // 删除没有升降序的数据
  let empty = sortArr.findIndex(item => item.split(' ')[1] == '');
  if (empty > -1) {
    sortArr.splice(empty, 1);
    sortArrKey.splice(empty, 1);
  }
}

export function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

  var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
  };
  var wbout = xlsxStyle.write(workbook, wopts);
  var blob = new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }); // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  return blob;
}

export function openDownloadDialog(url, saveName) {
  // if (typeof url == 'object' && url instanceof Blob) {
  //     url = URL.createObjectURL(url); // 创建blob地址
  // }
  let href = URL.createObjectURL(url)
  let a = document.createElement('a');
  a.href = href;
  a.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 200);
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path,
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}
