import React from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';

const mapStyles = {
    position: "relative",
    width: "50%",
    height: "500px",
    marginLeft: "25%",
    marginTop: "25px",
    boxShadow: "0px 8px 15px #00000026",
    border: "3px solid #80cbc4",
    borderRadius: "25px"
};

export class ResourceLocator extends React.Component {

    state = {
        location: {lat: 0, lng: 0},
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    }

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.getLocation();
    }

    updateLocation(currLat, currLng) {
        this.setState(() => {
            return {location: {lat: currLat, lng: currLng}}
        });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                this.updateLocation(
                    position.coords.latitude,
                    position.coords.longitude
                )
               },
              () => {
                // handleLocationError(true, infoWindow, map.getCenter());
              }
            );
        } else {
            // handleLocationError(false, infoWindow, map.getCenter());
        }
    }

    onMarkerClick = (props, marker, e) =>
        this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
    });

    onMapClick = (props) => {
        if (this.state.showingInfoWindow) {
          this.setState({
            showingInfoWindow: false,
            activeMarker: null
          })
        }
    };

    render () {
        return (
            <Map
                id="map"
                google={this.props.google}
                style={mapStyles}
                zoom={14}
                initialCenter={{lat: 0, lng: 0}}
                center={this.state.location}
                onClick={this.onMapClick}
            >
                <Marker
                    title="Current Location"
                    name={"Current Location"}
                    position={this.state.location}
                    onClick={this.onMarkerClick}
                />

                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}>
                    <div>
                        <p>{this.state.selectedPlace.name}</p>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

ResourceLocator = GoogleApiWrapper({
    apiKey: 'AIzaSyAHwoQ5Wzg7vxDeLyu2ivk5icpZTnPNHso'
})(ResourceLocator);