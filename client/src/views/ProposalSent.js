import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './../components/Navbar/Navy';
import Footer from './../components/Footer/Footer';

class ConfirmSignup extends React.Component {

  constructor(props) {
    super(props);

    this.moreFreelances = this.moreFreelances.bind(this);
    this.returnHome = this.returnHome.bind(this);
  }

  moreFreelances() {
    this.props.history.push(
      `/search${this.props.history.location.search}`
    );
  }

  returnHome() {
    this.props.history.push('/');
  }

  render() {
    return (
      <>
        <Navbar {...this.props} />
        <div style={{'marginTop': '90px'}}>
          Bravo c&apos;est fait !
          La proposition a bien été transmise à Alexandre qui vous répondront rapidement sur Malt.
          Mais ne vous arrêtez pas en si bon chemin !
        <button onClick={this.moreFreelances}> Contactez d&apos;autres freelances </button>
        <button onClick={this.returnHome}> Retourner à l&apos;accueil </button>
        </div>
        <Footer {...this.props} />
      </>
    );
  }
}

ConfirmSignup.defaultProps = {
  history: {}
};

ConfirmSignup.propTypes = {
  history: PropTypes.object,
};

export default ConfirmSignup;