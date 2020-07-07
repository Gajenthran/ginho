import React from 'react';
import PropTypes from 'prop-types';
// import './../../assets/css/profile.css'

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchUpdateInfo = this.fetchUpdateInfo.bind(this);
  }

  async fetchUpdateInfo(url, data) {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('login')}`
      },
      body: JSON.stringify({ data })
    });
    let res = await response.json();
    return res;
  }

  handleSubmit() {
    this.fetchUpdateInfo(
      '/api/user/updatePersonalInformations',
      this.state.user
    )
      .then(res => console.log(res));
  }

  handleRadioChange(event) {
    const { user } = this.state;
    user[event.target.name] = parseInt(event.currentTarget.value);
    this.setState({ user });
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  render() {
    const { user } = this.state;
    console.log(this.state);
    return (
      <>
        {user &&
          <div id="container-freelance-profil">
            <div className="profile-profile-header">
              <div className="profile-profile-img">
                <img src={require('./../../assets/img/hero.png')} width="200" alt="" />
              </div>
              <div className="profile-profile-nav-info">
                <h3 className="profile-user-name"> {user.firstName} {user.lastName.toUpperCase()} </h3>
                <h5 className="profile-user-name"> {user.title} </h5>
                <div className="profile-address">
                  <p className="profile-state"> <i className="fa fa-map-marker" ></i> &nbsp; {user.city}, </p>
                  <span className="profile-country"> {user.country}. </span>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td> Tarif </td>
                      <td> Expériences </td>
                      <td> Disponibilité </td>
                    </tr>
                    <tr>
                      <td> {user.rate} </td>
                      <td> 2-5 ans </td>
                      <td> <i style={{ color: user.disponibility ? 'green' : 'red' }} className="fa fa-circle"></i> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="profile-profile-option">
                <div className="profile-notification">
                  <i className="fa fa-bell"></i>
                  <span className="profile-alert-message"> 1 </span>
                </div>
              </div>
            </div>
            <div className="profile-main-bd">
              <div className="profile-left-side">
                <div className="profile-profile-side">
                  <p className="profile-mobile-no"> <i className="fa fa-phone"></i> {user.phone} </p>
                  <p className="profile-user-mail"> <i className="fa fa-envelope"></i> {user.email} </p>
                  <div className="profile-user-bio">
                    <h3> Bio </h3>
                    <p className="profile-bio">
                      Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas fermentum, sem in
                      pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Maecenas
                      libero. Suspendisse sagittis ultrices augue. Nullam at arcu a est sollicitudin euismod.
                      Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Maecenas fermentum,
                      sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus.
                      Nulla accumsan, elit sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam
                      nulla vel leo. Etiam egestas wisi a erat. Aliquam erat volutpat.
                        </p>
                  </div>
                  <div className="profile-profile-btn">
                    <button className="profile-chatbtn"><i className="fa fa-comment"></i> Chat </button>
                    <button className="profile-createbtn"><i className="fa fa-plus"></i> Create </button>
                  </div>
                  <div className="profile-user-rating">
                    <h3 className="profile-rating"> 4.5 </h3>
                    <div className="profile-stars">
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                      <i className="fa fa-star"></i>
                    </div>
                    <span className="profile-no-user">
                      <span> 123 </span>
                            &nbsp;
                            reviews
                        </span>
                  </div>
                </div>
              </div>
              <div className="profile-right-side">
                <div className="profile-nav">
                  <ul>
                    <li className="profile-user-post active"> Posts </li>
                    <li className="profile-user-review"> Reviews </li>
                    <li className="profile-user-setting"> Settings </li>
                  </ul>
                </div>
                <div className="profile-profile-body">
                  <div className="profile-profile-posts tab">
                    <h1> Your Posts</h1>
                    <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Maecenas libero.
                    Suspendisse sagittis ultrices augue. Nullam at arcu a est sollicitudin euismod. Vestibulum erat
                    nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nulla accumsan, elit
                    sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam
                    egestas wisi a erat. Aliquam erat volutpat. Fusce tellus odio, dapibus id fermentum quis,
                    suscipit id erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                    architecto beatae vitae dicta sunt explicabo. Vivamus ac leo pretium faucibus. Suspendisse
                    sagittis ultrices augue. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. Lorem
                    ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Mauris
                    elementum mauris vitae tortor. In dapibus augue non sapien. Itaque earum rerum hic tenetur a
                    sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
                        doloribus asperiores repellat. </p>
                  </div>
                  <div className="profile-profile-reviews tab">
                    <h1> User Reviews </h1>
                    <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Maecenas libero.
                    Suspendisse sagittis ultrices augue. Nullam at arcu a est sollicitudin euismod. Vestibulum erat
                    nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nulla accumsan, elit
                    sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam
                    egestas wisi a erat. Aliquam erat volutpat. Fusce tellus odio, dapibus id fermentum quis,
                    suscipit id erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                    architecto beatae vitae dicta sunt explicabo. Vivamus ac leo pretium faucibus. Suspendisse
                    sagittis ultrices augue. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. Lorem
                    ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Mauris
                    elementum mauris vitae tortor. In dapibus augue non sapien. Itaque earum rerum hic tenetur a
                    sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
                        doloribus asperiores repellat. </p>
                  </div>
                  <div className="profile-profile-settings tab">
                    <h1> Account settings </h1>
                    <p> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Maecenas libero.
                    Suspendisse sagittis ultrices augue. Nullam at arcu a est sollicitudin euismod. Vestibulum erat
                    nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Maecenas fermentum, sem in pharetra
                    pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Nulla accumsan, elit
                    sit amet varius semper, nulla mauris mollis quam, tempor suscipit diam nulla vel leo. Etiam
                    egestas wisi a erat. Aliquam erat volutpat. Fusce tellus odio, dapibus id fermentum quis,
                    suscipit id erat. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                    architecto beatae vitae dicta sunt explicabo. Vivamus ac leo pretium faucibus. Suspendisse
                    sagittis ultrices augue. Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. Lorem
                    ipsum dolor sit amet, consectetuer adipiscing elit. Nunc tincidunt ante vitae massa. Mauris
                    elementum mauris vitae tortor. In dapibus augue non sapien. Itaque earum rerum hic tenetur a
                    sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis
                        doloribus asperiores repellat. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        <br /><br />
        <p> Civilité:
          <input type="radio" onChange={this.handleRadioChange} name="sexe" value={0} checked={user.sexe === 0} />
          <input type="radio" onChange={this.handleRadioChange} name="sexe" value={1} checked={user.sexe === 1} />
        </p>
        <p> Catégorie: <input type="text" onChange={this.handleChange} name="category" defaultValue={user.category} readOnly /> </p>
        <p> Nom: <input type="text" onChange={this.handleChange} name="lastName" defaultValue={user.lastName} /> </p>
        <p> Prénom: <input type="text" onChange={this.handleChange} name="firstName" defaultValue={user.firstName} /> </p>
        <p> E-mail: <input type="text" name="email" defaultValue={user.email} readOnly /> </p>
        <p> Tél.: <input type="text" onChange={this.handleChange} name="phone" defaultValue={user.phone} /> </p>
        <p> Date de naissance: <input onChange={this.handleChange} name="firstName" defaultValue={new Date(user.date_of_birth)} /> </p>
        <p> Pays: <input type="text" onChange={this.handleChange} name="country" defaultValue={user.country} /> </p>
        <p> Ville: <input type="text" onChange={this.handleChange} name="city" defaultValue={user.city} /> </p>
        <button onClick={this.handleSubmit}> </button>
      </>
    );
  }
}

Profile.defaultProps = {
  user: {},
  history: {},
  favorite: false
};

Profile.propTypes = {
  user: PropTypes.object,
  history: PropTypes.object,
  favorite: PropTypes.bool
};

export default Profile;