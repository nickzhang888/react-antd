import React from "react";
import DragM from './index';
class ModalTitle extends React.Component {
    updateTransform = transformStr => {
        this.modalDom.style.transform = transformStr;
    };
    componentDidMount() {
        this.modalDom = document.getElementsByClassName("ant-modal-wrap" )[0];
        //modal的class是ant-modal-wrap
    }
    render() {
        const { title } = this.props;
        return (
            <DragM updateTransform={this.updateTransform}>
                <div>{title}</div>
            </DragM>
        );
    }
}
export default ModalTitle