import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function AlertCookies() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert className="cookie--container" onClose={() => setShow(false)} dismissible>
        <p className="cookie--text">
          En poursuivant votre navigation sur notre site,
          vous acceptez l’utilisation de cookies destinés à
          vous proposer des offres, contenus et services personnalisés.
          Plus d’informations ici.
        </p>
      </Alert>
    );
  }
  return null;
}

export default AlertCookies;