import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

export default class Gantt extends Component {

  constructor(props) {
    super(props);
    this.initZoom();
  }

  // instance of gantt.dataProcessor
  dataProcessor = null;

  initZoom() {
    gantt.ext.zoom.init({
      levels: [
        {
          name: 'Hours',
          scale_unit: 'day',
          scale_height: 50,
          min_column_width: 50,
          date_scale: '%Y年%m月%d日',
          subscales: [
            {
              unit: 'hour',
              step: 1,
              date: '%H:00',
            },
          ],
        },
        {
          name: 'Days',
          scale_unit: 'month',
          scale_height: 50,
          min_column_width: 70,
          date_scale: '%Y年 %m月',
          subscales: [
            {
              unit: 'day',
              step: 1,
              date: '%m-%d',
            },
          ],
        },
        {
          name: 'Weeks',
          scale_height: 50,
          scale_unit: 'week',
          date_scale: '第%W周',
          min_column_width: 70,
          subscales: [
            {
              unit: 'year',
              step: 1,
              date: '%Y年',
            },
          ],
        },
        {
          name: 'Months',
          scale_unit: 'year',
          scale_height: 50,
          min_column_width: 70,
          date_scale: '%Y年',
          subscales: [
            {
              unit: 'month',
              step: 1,
              date: '%m月',
            },
          ],
        },
      ]
    });
  }

  setZoom(value) {
    gantt.ext.zoom.setLevel(value);
  }

  initGanttDataProcessor() {
    /**
     * type: "task"|"link"
     * action: "create"|"update"|"delete"
     * item: data object object
     */
    const onDataUpdated = this.props.onDataUpdated;
    this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
      return new Promise((resolve, reject) => {
        if (onDataUpdated) {
          onDataUpdated(type, action, item, id);
        }

        // if onDataUpdated changes returns a permanent id of the created item, you can return it from here so dhtmlxGantt could apply it
        // resolve({id: databaseId});
        return resolve();
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    return this.props.zoom !== nextProps.zoom;
  }

  componentDidMount() {
    gantt.config.columns = [
      {
        name: 'text',
        label: '任务名',
        align: 'center',
        tree: true,
        width: 280,
        template: function (obj) {
          return `${obj.text}`; // 通过 template 回调可以指定返回内容值
        },
      },
      {name:"start_date", label:"开始时间", align: "center" },
      {name:"duration",   label:"工期（天）",   align: "center"},
    ];
    gantt.config.readonly = false;   
    gantt.config.show_links = false;
    gantt.config.show_progress = this.props.duration_unit || true;  // 是否在任务条形图中显示制进度条（通常以不同颜色区分）
    gantt.config.duration_unit = this.props.duration_unit || "day";   // 工期计算的基本单位   [“minute”, “hour”, “day”, “week”, “month”, “year”]
    gantt.config.duration_step = this.props.duration_step || 1;  // 工期计算的倍数
    gantt.config.xml_date = "%Y-%m-%d %H:%i";
    gantt.config.lightbox.sections = [
      {name:"description", height:38, map_to:"text", type:"textarea",focus:true},
      {name:"duration", height:22, map_to:"text",type:"select"},                                                                        
      {name:"time", height:72, type:"duration", map_to:"auto"}
  ];
    const { tasks } = this.props;
    gantt.init(this.ganttContainer);
    this.initGanttDataProcessor();
    gantt.parse(tasks);
  }

  componentWillUnmount() {
    if (this.dataProcessor) {
      this.dataProcessor.destructor();
      this.dataProcessor = null;
    }
  }

  render() {
    const { zoom } = this.props;
    this.setZoom(zoom);
    return (
      <div
        ref={(input) => { this.ganttContainer = input }}
        style={{ width: '100%', height: '100%' }}
      ></div>
    );
  }
}
