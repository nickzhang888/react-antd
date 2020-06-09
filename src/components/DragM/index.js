import React from "react";
import PropTypes from "prop-types";
export default class DragM extends React.Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };
    static defaultProps = {
        //默认是移动children dom,覆盖该方法，可以把tranform行为同步给外部
        updateTransform: (transformStr, tx, ty, tdom) => {
            tdom.style.transform = transformStr;
        }
    };
    position = {
        startX: 0,
        startY: 0,
        dx: 0,
        dy: 0,
        tx: 0,
        ty: 0
    };
    docStart = event => {
        if (event.button != 0) {
            //只允许左键，右键问题在于不选择conextmenu就不会触发mouseup事件
            return;
        }
        document.addEventListener("mousemove", this.docMove);
        this.position.startX = event.pageX - this.position.dx;
        this.position.startY = event.pageY - this.position.dy;
    };
    docMove = event => {
        let tx = event.pageX - this.position.startX;
        let ty = event.pageY - this.position.startY;
        let content = document.getElementsByClassName("ant-modal-content")[0]
        let disX = (window.innerWidth - content.offsetWidth) / 2
        let disY = (window.innerHeight - content.offsetHeight) / 2
        if (tx > disX) {
            tx = disX
        } else if (tx < -disX) {
            tx = -disX
        }
        if (ty > disY) {
            ty = disY + 10
        } else if (ty < -disY) {
            ty = -disY
        }
        let transformStr = `translate(${tx}px,${ty}px)`;
        this.props.updateTransform(transformStr, tx, ty, this.tdom);
        this.position.dx = tx;
        this.position.dy = ty;
    };
    docMouseUp = event => {
        document.removeEventListener("mousemove", this.docMove);
        
    };
    componentDidMount() {
        this.tdom.addEventListener("mousedown", this.docStart);
        //用document移除对mousemove事件的监听
        document.addEventListener("mouseup", this.docMouseUp);
    }
    componentWillUnmount() {
        this.tdom.removeEventListener("mousedown", this.docStart);
        document.removeEventListener("mouseup", this.docMouseUp);
        document.removeEventListener("mousemove", this.docMove);
        let center = document.getElementsByClassName("ant-modal-centered")[0]
        center && (center.style.transform = `translate(0,0)`)
    }
    render() {
        const { children } = this.props;
        const newStyle = { ...children.props.style, cursor: "move", userSelect: "none" };
        return React.cloneElement(React.Children.only(children), {
            ref: tdom => this.tdom = tdom,
            style: newStyle
        });
    }
}