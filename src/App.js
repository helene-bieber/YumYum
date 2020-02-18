import React from "react";
import "./App.css";
import Store from "./Store";
import SearchIcon from "./images/search.svg";

import Firebase from "firebase";
import config from "./config";

let mapState;

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("Test2");
    if (!Firebase.apps.length) {
      Firebase.initializeApp(config);
    }

    this.state = {
      stores: []
    };
    this.updateMap = this.updateMap.bind(this);
    this.test = this.test.bind(this);
  }

  componentDidMount() {
    const script = document.createElement("script");
    script.src = process.env.PUBLIC_URL + "/sdk/tomtom.min.js";
    document.body.appendChild(script);
    script.async = true;
    script.onload = function() {
      mapState = window.tomtom.L.map("map", {
        source: "vector",
        key: "Your API key",
        center: [37.769167, -122.478468],
        basePath: "/sdk",
        zoom: 3
      });

      // var markerLayer = window.tomtom.L.tomTomMarkersLayer().addTo(mapState);
    };
  }

  updateMap() {
    fetch(
      "https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=" +
        this.refs.zip.value
    )
      .then(res => res.json())
      .then(data => {
        var lng = data.records[0].fields.longitude;
        var lat = data.records[0].fields.latitude;
        //window.tomtom.L.marker([lat, lng]).addTo(mapState);
        mapState.setView([lat, lng], 15);
      })
      .catch(console.log);
    this.getUserData();
  }

  test() {
    console.log("Hello!");
  }

  getUserData = () => {
    let ref = Firebase.database().ref("/stores");
    console.log(ref);
    ref.on("value", snapshot => {
      const state = snapshot.val();
      var filteredStores = [];
      state.map(store => {
        if (this.refs.zip.value == store.zipCode) {
          filteredStores.push(store);
        }
        window.tomtom.L.marker([store.lat, store.lng * -1])
          .bindPopup(store.Name)
          .addTo(mapState)
          .on("mouseover", this.test);
        /* window.tomtom.L.popup()
          .setLatLng([store.lat, store.lng * -1])
          .setContent("Dinesh")
          .openOn(mapState);
          */
      });

      this.setState({ stores: filteredStores });
    });
  };

  render() {
    return (
      <div>
        <header>YumYum</header>
        <div className="wrapper">
          <div id="map"></div>
          <div id="storesColumn">
            <div className="searchBar">
              <input
                type="text"
                ref="zip"
                id="zip"
                placeholder="Enter zip code"
              ></input>
              <button className="search" onClick={() => this.updateMap()}>
                <img src={SearchIcon} alt="my image" />
              </button>
            </div>
            <Store listStore={this.state.stores} map={mapState} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
