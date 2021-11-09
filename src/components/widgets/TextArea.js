import React, { Component } from "react";

class TextArea extends Component {
  state = {
    updatedTextArea: this.props.value
  };

  onChangetext = e => {
    this.setState({ updatedTextArea: e.target.value }, () => {
      this.props.onChange(
        this.props.id,
        this.state.updatedTextArea,
        this.props.rowAndFieldIndex
      );
    });
  };

  componentWillReceiveProps(nextProps) {
    const { id, data } = nextProps;

    this.setState({
      updatedTextArea: data,
      updatedID: id
    });
  }

  render() {
    const { id, style, rows, cols } = this.props;
    return (
      <textarea
        id={id}
        type="text"
        rows={rows}
        cols={cols}
        style={style}
        // value={this.state.updatedTextArea}
        value={this.state.updatedTextArea}
        onChange={e => this.onChangetext(e)}
        onBlur={e => this.onChangetext(e)}
      />
    );
  }
}
export default TextArea;
