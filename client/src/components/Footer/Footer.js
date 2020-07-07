import React from 'react';
// import './../../assets/css/Footer.css'

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section about">
            <ul>
              <li>Qui sommes-nous ? </li>
              <li>Notre équipe</li>
              <li>e-AMA recrute</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className="footer-section links">
            <ul>
              <li>Facebook </li>
              <li>Twitter</li>
              <li>Youtube</li>
              <li>Instagram</li>
              <li>Github</li>
            </ul>
          </div>
          <div className="footer-section contact">
            1 Impasse Reille, 75014 Paris, France <br/>
            E-mail : info@ama-associates.com <br/>
            Tél :  +33 7 66 88 34 77
          </div>
          <div className="footer-bottom">
            &copy; e-ama-mp.com | testing code for malt like project
                    </div>
        </div>
      </footer>
    );
  }
}

export default Footer;