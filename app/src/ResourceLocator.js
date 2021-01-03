import React from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import { server as backend } from "./App";
import { APIKey } from "./GoogleAPIKey";

const mapStyles = {
    position: "relative",
    width: "50%",
    height: "500px",
    marginLeft: "25%",
    marginTop: "25px",
    boxShadow: "0px 8px 15px #00000026",
    border: "3px solid #80cbc4",
    borderRadius: "25px",
};

const mapButtonUI = {
    backgroundColor: "#fff",
    border: "2px solid #fff",
    borderRadius: "3px",
    boxShadow: "0 2px 6px rgba(0,0,0,.3)",
    cursor: "pointer",
    marginTop: "25px",
    textAlign: "center",
    title: "Click to recenter the map",
};

const mapButtonText = {
    color: "rgb(25,25,25)",
    fontFamily: "Roboto,Arial,sans-serif",
    fontSize: "16px",
    lineHeight: "38px",
    paddingLeft: "5px",
    paddingRight: "5px",
};

const markers = {
    current: "",
    Veterinarian: [],
    "Dog park": [],
    "Pet store": [],
    "Pet hotel": [],
    "Pet grooming": [],
};

const icons = {
    Veterinarian: "https://www.flaticon.com/svg/static/icons/svg/2138/2138508.svg",
    "Dog park": "https://www.flaticon.com/svg/static/icons/svg/3048/3048384.svg",
    "Pet store": "https://www.flaticon.com/svg/static/icons/svg/3436/3436255.svg",
    "Pet hotel": "https://www.flaticon.com/svg/static/icons/svg/3884/3884967.svg",
    "Pet grooming": "https://www.flaticon.com/svg/static/icons/svg/3636/3636098.svg",
};

const buttonTitles = ["Vets", "Dog Parks", "Pet Stores", "Pet Hotels", "Grooming"];

const searchQueries = ["Veterinarian", "Dog park", "Pet store", "Pet hotel", "Pet grooming"];

export class ResourceLocator extends React.Component {
    state = {
        location: { lat: 0, lng: 0 },
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    };

    componentDidMount() {
        this.getLocation();
    }

    updateLocation(currLat, currLng) {
        this.setState(() => {
            return { location: { lat: currLat, lng: currLng } };
        });
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.updateLocation(position.coords.latitude, position.coords.longitude);
                },
                () => {}
            );
        }
    }

    onMarkerClick = (props, marker, e) => {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
        });
    };

    onMapClick = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
            });
        }
    };

    handleReady(props, map) {
        const fetchPlaces = (props, map, query) => {
            const { google } = props;
            const service = new google.maps.places.PlacesService(map);

            const loc = this.center;
            const locObj = new google.maps.LatLng(loc.lat, loc.lng);

            const request = {
                location: locObj,
                radius: "5000",
                query: query,
            };

            // clears current markers
            let currMarker = markers.current;
            if (currMarker) {
                for (let i = 0; i < markers[currMarker].length; i++)
                    markers[currMarker][i].setMap(null);
            }

            // updates next markers to be displayd
            markers.current = query;

            // displays cached markers if previously searched
            const allMarkers = markers[query];
            if (allMarkers.length !== 0) {
                for (let i = 0; i < allMarkers.length; i++) allMarkers[i].setMap(map);
                return;
            }

            // creates, displays, and caches markers for new search
            service.textSearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        let place = results[i];
                        // console.log(place);
                        let marker = new google.maps.Marker({
                            animation: google.maps.Animation.DROP,
                            position: new google.maps.LatLng(
                                place.geometry.location.lat(),
                                place.geometry.location.lng()
                            ),
                            title: place.name,
                            icon: {
                                url: icons[request.query],
                                scaledSize: new google.maps.Size(48, 48),
                            },
                        });

                        const contentString =
                            `<h5>${place.name}</h5>` + `<div>${place.formatted_address}</div>`;

                        const infowindow = new google.maps.InfoWindow({
                            content: contentString,
                        });

                        marker.addListener("click", () => {
                            infowindow.open(map, marker);
                        });

                        allMarkers.push(marker);
                        marker.setMap(map);
                    }
                }
            });
        };

        // creates and displays buttons on map - when clicked, buttons direct user
        // to pet-related locations on the map
        const createButton = (props, map, title, query) => {
            const { google } = props;
            const button = document.createElement("div");
            // button.id = query.replace(" ", "");
            // button.style.display = "none";

            const buttonUI = document.createElement("div");
            for (const [key, value] of Object.entries(mapButtonUI)) buttonUI.style[key] = value;
            button.appendChild(buttonUI);

            const buttonText = document.createElement("div");
            for (const [key, value] of Object.entries(mapButtonText)) buttonText.style[key] = value;
            buttonText.innerHTML = title;
            buttonUI.appendChild(buttonText);

            buttonUI.addEventListener("click", () => {
                fetchPlaces(props, map, query);
            });

            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(button);
        };

        for (let i = 0; i < buttonTitles.length; i++)
            createButton(props, map, buttonTitles[i], searchQueries[i]);

        // searchQueries.forEach((query) => {
        //     const id = query.replace(" ", "");
        //     document.getElementById(id).style.display = "inline-block";
        // });
    }

    render() {
        return (
            <Map
                id="map"
                google={this.props.google}
                style={mapStyles}
                zoom={12}
                initialCenter={{ lat: 0, lng: 0 }}
                center={this.state.location}
                onClick={this.onMapClick}
                onReady={this.handleReady}
            >
                <Marker
                    title="Current Location"
                    name={"Current Location"}
                    position={this.state.location}
                    onClick={this.onMarkerClick}
                />

                <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
                    <div>
                        <h5>{this.state.selectedPlace.name}</h5>
                        <div>Look, it's you!</div>
                    </div>
                </InfoWindow>
            </Map>
        );
    }
}

ResourceLocator = GoogleApiWrapper({
    apiKey: APIKey,
})(ResourceLocator);
