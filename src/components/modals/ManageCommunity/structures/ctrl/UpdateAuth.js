import React, { PureComponent } from 'react';

import { defaults } from 'utils/common';

import { Fields, InputSmall, ErrorLine } from '../elements';

const DEFAULT = {
  period: 60,
};

export default class UpdateAuth extends PureComponent {
  state = defaults(this.props.initialValues, DEFAULT);

  onChange = e => {
    this.setState(
      {
        period: e.target.value,
      },
      this.triggerChange
    );
  };

  triggerChange = () => {
    const { onChange } = this.props;
    const period = parseInt(this.state.period, 10);

    if (!period || Number.isNaN(period)) {
      this.setState({ isInvalid: true });
      onChange('INVALID');
      return;
    }

    this.setState({ isInvalid: false });
    onChange({
      period,
    });
  };

  render() {
    const { period, isInvalid } = this.state;

    return (
      <Fields>
        <InputSmall value={period} onChange={this.onChange} />
        {isInvalid ? <ErrorLine /> : null}
      </Fields>
    );
  }
}
