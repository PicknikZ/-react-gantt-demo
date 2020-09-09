import React, { Component } from 'react';
export default class Toolbar extends Component {
  
  handleZoomChange = (value) => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(value)
    }
  }
  render() {
    const zoomRadios = [{label: '时', value: 'Hours'},{label: '日', value: 'Days'}, {label: '周', value: 'Weeks'}, {label: '月', value: 'Months'}].map((item) => {
      const isActive = this.props.zoom === item.value;
      return (
        <label key={ item.value } className={ `radio-label ${isActive ? 'radio-label-active': ''}` }>
          <input type='radio'
            checked={ isActive }
            onChange={ () => this.handleZoomChange(item.value) }
            value={ item.value }/>
          { item.label }
        </label>
      );
    });

    return (
      <div className="tool-bar">
        <b>切换视图: </b>
          { zoomRadios }
      </div>
    );
  }
}
