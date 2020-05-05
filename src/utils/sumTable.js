let tableList;
function handleTableScroll(e){
    const current = e.currentTarget
    tableList.forEach(item => {
        if (item !== current && item.scrollLeft !== current.scrollLeft) {
            item.scrollLeft = current.scrollLeft
        }
    });
}

const sumTable={
    mount:(ref)=>{
        tableList=Array.from(ref.querySelectorAll(".ant-table-body"))
        tableList.forEach(item=>{
            item.addEventListener("scroll",handleTableScroll)
        })
    },
    unMount:()=>{
        tableList.forEach(item=>{
            item.removeEventListener("scroll",handleTableScroll)
        })
    }
}
export default sumTable