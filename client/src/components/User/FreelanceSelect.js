import React from 'react';
import PropTypes from 'prop-types';
import freelanceSelection from '../../utils/freelanceSelection';

class FreelanceSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: this.props.selection,
      proposal: false
    };

    this.handleProposal = this.handleProposal.bind(this);
    this.renderSelection = this.renderSelection.bind(this);
    this.removeSelection = this.removeSelection.bind(this);
  }

  handleProposal() {
    this.props.history.push(
      `/proposal${this.props.history.location.search}`
    );
  }

  removeSelection(freelance) {
    console.log(this.state.selection);

    var { selection } = this.state;
    selection.delete(freelance['id']);
    this.setState({ selection });
    freelanceSelection.remove(freelance);
  }

  renderSelection() {
    var selection = [];
    const MAX = 6;

    for (let [key, value] of this.state.selection) {
      selection.push(
        <li
          key={key}
          onClick={() => this.removeSelection(value)}
        >
          {value['lastName'][0]} {value['firstName'][0]}
        </li>
      );
    }

    var it = MAX - selection.length;
    while (it > 0) {
      selection.push(
        <li key={it}> </li>
      );
      it--;
    }
    return selection;
  }

  render() {
    const { selection } = this.state;
    return (
      <>
        {selection.size !== 0 &&
          <div className="search--freelance-selection">
            <h4> Sélection freelances </h4>
            <ul>
              {this.renderSelection()}
              <button onClick={this.handleProposal}> Proposer un projet </button>
            </ul>
          </div>
        }
      </>
    );
  }
}

FreelanceSelect.defaultProps = {
  selection: {},
  history: {}
};

FreelanceSelect.propTypes = {
  selection: PropTypes.any,
  history: PropTypes.object
};

export default FreelanceSelect;