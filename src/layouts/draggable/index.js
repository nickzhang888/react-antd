import React, { Component } from 'react';
import { Button, Dropdown, Icon, Select, Modal, Upload, Form, message } from 'antd';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import $ from 'jquery';
import ModalTitle from "@/components/DragM/ModalTitle"
import 'braft-editor/dist/index.css';
import styles from './index.less';
const Option = Select.Option;
const FormItem = Form.Item;
let dragFlag;
@Form.create()
class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
    };
  }

  dragEvent = e => {
    var drag = this.draggable;
    var e = e || window.event;
    e.preventDefault();
    var firstTime, lastTime;
    firstTime = new Date().getTime();
    let disX = e.clientX - drag.offsetLeft;
    let disY = e.clientY - drag.offsetTop;
    if (typeof drag.setCapture != 'undefined') {
      drag.setCapture();
    }
    document.onmousemove = e => {
      let left = e.clientX - disX;
      let top = e.clientY - disY;
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      drag.style.cursor = 'move';
      if (left < 0) {
        left = 0;
      } else if (left > window.innerWidth - drag.offsetWidth) {
        left = window.innerWidth - drag.offsetWidth;
      }
      if (top < scrollTop) {
        top = scrollTop;
      } else if (top > window.innerHeight - drag.offsetHeight) {
        top = scrollTop + (window.innerHeight - drag.offsetHeight);
      }
      drag.style.left = left + 'px';
      drag.style.top = top + 'px';
    };
    document.onmouseup = e => {
      lastTime = new Date().getTime();
      document.onmousemove = document.onmouseup = null;
      if (typeof drag.releaseCapture != 'undefined') {
        drag.releaseCapture();
      }
      lastTime - firstTime < 200 ? (dragFlag = true) : (dragFlag = false);
      drag.style.cursor = 'pointer';
    };
  };

  handClick = () => {
    dragFlag &&
      this.setState({
        visible: true,
      });
  };

  handleChange = editorState => {
    let arrayImgs = [];
    let imgSrc = [...$('div.bf-image div img')];
    imgSrc.forEach(item => {
      arrayImgs.push(item.src);
    });
    this.setState({
      imgSrc: arrayImgs,
      text: editorState.toText().trim(),
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const content = this.state.text;
    const { fileList, imgSrc } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let formData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
          formData.append(`excelfile${[i]}`, fileList[i]);
        }
        imgSrc.forEach(item => {
          formData.append('img', item);
        });
        formData.append('content', content);

        fetch(`orders/batchetablish`, {
          method: 'POST',
          body: formData,
          headers: {
            // 转为formData格式
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(res => {
          message.success('提交成功');
          this.setState({
            visible: false,
            fileList:[]
          });
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { fileList, text } = this.state;
    const uploadProps = {
      accept: ".xlsx,.xls",
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        // 也可以用lastIndexOf
        const length = file.name.split('.').length
        const postfix = file.name.split('.')[length - 1];
        if (postfix !== 'xlsx' && postfix !== 'xls') {
          message.warn('请导入excel类型的文件');
          return;
        }
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };
    const editorprops = {
      conteFormat: 'html',
      onChange: this.handleChange,
      media: {
        allowPasteImage: true,
        image: true,
      },
    };
    const title= <ModalTitle title={"问题反馈"} />;
    const contentList = (
      <Form>
        <FormItem label="">
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  if (!value || value.isEmpty()) {
                    callback('请输入内容');
                  } else if (value && value.toText().length > 300) {
                    callback('内容不要超过300字');
                  }
                  callback();
                },
              },
            ],
          })(
            <BraftEditor
              controlBarStyle={{ display: 'none' }}
              id="my-br"
              className={styles.bfStyle}
              placeholder="请输入内容"
              {...editorprops}
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('upload', {},
          )(
            <Upload {...uploadProps}>
              <Button type="primary" icon="upload">
                上传
              </Button>
            </Upload>,
          )}
        </FormItem>
      </Form>
    );
    return (
      <div>
        <div
          className={styles.dragStyle}
          onMouseDown={this.dragEvent}
          onClick={this.handClick}
          ref={node => (this.draggable = node)}
        >
          <Icon type="form" style={{ fontSize: 24 }} />
        </div>
        <Modal
          title={title}
          visible={this.state.visible}
          destroyOnClose={true}
          onOk={this.handleSubmit}
          centered
          onCancel={() => {
            this.setState({
              visible: false,
            });
          }}
        >
          {contentList}
        </Modal>
      </div>
    );
  }
}

export default Draggable;
