import React, { Component } from "react";
import "./App.css";
import Pizza from "./images/pizza.jpg";
import Bakery from "./images/bakery.jpg";

class Store extends Component {
  popOnMap(store) {
    window.tomtom.L.popup()
      .setLatLng([store.lat, store.lng * -1])
      .setContent(store.Name)
      .openOn(this.props.map);
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.listStore.map((store, index) => (
            <li
              key={store.Name}
              className="listStore"
              onMouseEnter={() => this.popOnMap(store)}
            >
              <div className="cards">
                {/* <img
                  className="photo"
                  src={() => this.setImage(store.category)}
               /> */}
                <Image category={store.category} />
                <div className="storeInfo">
                  <h1>{store.Name}</h1>
                  <div className="itemsAvailable">
                    {store.products.map((product, index) => (
                      <p key={product.name}>
                        {product.name}: {product.quantity} {product.type} left!{" "}
                        <span className="price">
                          ${product.price}/{product.type}
                        </span>
                      </p>
                    ))}
                  </div>
                  <button className="order">Order</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

class Image extends Component {
  render() {
    if (this.props.category === "bakery") {
      return (
        <div>
          <img className="photo" src={Bakery} />
        </div>
      );
    }
    return (
      <div>
        <img className="photo" src={Pizza} />
      </div>
    );
  }
}

export default Store;
