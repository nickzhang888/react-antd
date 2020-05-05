// import React from 'react';
// import styles from './index.less';

// var timer;
// export default class Home extends React.Component {
//   componentDidMount() {
//     this.child2.innerHTML = this.child1.innerHTML;
//     this.child1.style.paddingRight = 200 + 'px';
//     timer = setInterval(this.marquee, 20);
//     this.wrap.onmouseover = function() {
//       clearInterval(timer);
//     };
//   }

//   marquee = () => {
//     if (this.wrap) {
//       if (this.wrap.scrollLeft >= this.child1.offsetWidth) {
//         this.wrap.scrollLeft = 0;
//       } else {
//         this.wrap.scrollLeft++;
//       }
//       // console.log(this.wrap.scrollLeft, this.child1.offsetWidth);
//     }
//   };

//   onMouseLeave = () => {
//     timer = setInterval(this.marquee, 20);
//   };

//   render() {
//     return (
//       <div
//         ref={node => (this.wrap = node)}
//         className={styles.home}
//         onMouseLeave={this.onMouseLeave}
//       >
//         <span ref={node => (this.child1 = node)}>
//           欢迎进入后台管理系统!&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
//         </span>
//         <span ref={node => (this.child2 = node)}></span>
//       </div>
//     );
//   }
// }
import React from 'react';
import FullCalendar from 'fullcalendar-reactwrapper';
import "fullcalendar/dist/fullcalendar.css"
import moment from 'moment';
import style from "./index.less"
import $ from "jquery"
class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          id: 999,
          title: '回顾会',
          start: '2020-02-09T16:00:00',
          color: 'yellow', // a non-ajax option
          textColor: 'black'
        },
        {
          title: 'Repeating Event',
          start: '2020-02-16T16:00:00'
        },
        {
          title: '开会',
          start: '2020-02-11',
          end: '2020-02-13',
          backgroundColor: "red"
        },
        {
          title: '开会',
          start: '2020-02-12T10:30:00',
          end: '2020-02-12T12:30:00'
        },
        {
          title: '过生日',
          start: '2020-02-13 07:00:00'
        },
        {
          title: '运动',
          start: '2020-02-28'
        }
      ],
    }
  }

  render() {
    return (
      <div id={style.calendar}>
        <FullCalendar
          id="your-custom-ID"
          locale={'zh-cn'}
          header={{
            left: 'prev,next today myCustomButton',
            center: 'title',
            right: 'month,basicWeek,basicDay'
          }}
          buttonText={{
            today: '今天',
            month: '月',
            week: '周',
            day: '天'
          }}
          // defaultDate={date}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          eventLimit={true} // allow "more" link when too many events
          events={this.state.events}
          // events= {(start, end, timezone, callback)=>{
          // // 写请求
          // }}
          dayClick={(date, allDay, jsEvent, view) => {
            alert(moment(date).format("YYYY-MM-DD"))
          }}
          eventClick={(event) => {
            alert(event.title);
          }}
          eventDrop={function (event, delta, revertFunc) {
            alert("脱好了! ")
          }}
        />
      </div>
    );
  }
}

export default ExampleComponent
