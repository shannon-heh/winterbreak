import React from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { APIKey } from "./GoogleAPIKey";
import Spinner from "react-bootstrap/Spinner";

const mapStyles = {
    position: "relative",
    width: "50%",
    height: "500px",
    marginLeft: "25%",
    marginTop: "5px",
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
    marginLeft: "10px",
    marginBottom: "5px",
    textAlign: "center",
    width: "100px",
};

const mapButtonText = {
    color: "rgb(25,25,25)",
    fontFamily: "Roboto,Arial,sans-serif",
    fontSize: "16px",
    lineHeight: "38px",
    paddingLeft: "5px",
    paddingRight: "5px",
};

// links to marker icons for different place categorise
const icons = {
    Veterinarian: "https://www.flaticon.com/svg/static/icons/svg/2138/2138508.svg",
    "Dog park": "https://www.flaticon.com/svg/static/icons/svg/3048/3048384.svg",
    "Pet store": "https://www.flaticon.com/svg/static/icons/svg/3436/3436255.svg",
    "Pet hotel": "https://www.flaticon.com/svg/static/icons/svg/3884/3884967.svg",
    "Pet grooming": "https://www.flaticon.com/svg/static/icons/svg/3636/3636098.svg",
};

// place category names displayed to user
const buttonTitles = ["Vets", "Dog Parks", "Pet Stores", "Pet Hotels", "Grooming"];

// what is actually entered as search query into google maps API
const searchQueries = ["Veterinarian", "Dog park", "Pet store", "Pet hotel", "Pet grooming"];

export class ResourceLocator extends React.Component {
    state = {
        location: { lat: 0, lng: 0 }, // stores current location of user
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        currentMarkers: [], // stores markers currently displayed on map
    };

    /* fetches user current location after component mount completion */
    componentDidMount() {
        this.getLocation();
    }

    /* updates lat-lon location as stored in this.state */
    updateLocation(currLat, currLng) {
        this.setState(() => {
            return { location: { lat: currLat, lng: currLng } };
        });
    }

    /* uses browser API to fetch current user location */
    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.updateLocation(position.coords.latitude, position.coords.longitude);
                    document.getElementById("map-loading-text").innerHTML = "Resource Locator";
                },
                () => {}
            );
        }
    }

    /* manages creation of loading and places buttons, as well as querying of the Places API and
    creation of markers */
    handleReady(props, map) {
        /* helper method for loading and places button creation */
        const createButtonHelper = (props, map, title) => {
            const button = document.createElement("div");

            const buttonUI = document.createElement("div");
            for (const [key, value] of Object.entries(mapButtonUI)) buttonUI.style[key] = value;
            button.appendChild(buttonUI);

            const buttonText = document.createElement("div");
            for (const [key, value] of Object.entries(mapButtonText)) buttonText.style[key] = value;
            buttonText.innerHTML = title;
            buttonUI.appendChild(buttonText);

            return [button, buttonUI, buttonText];
        };

        /* creates and displays buttons on map for different pet-related location categories */
        const createPlaceButton = (props, map, title, query) => {
            const { google } = props;
            const [button, buttonUI] = createButtonHelper(props, map, title);

            buttonUI.addEventListener("click", () => {
                fetchPlaces(props, map, query);
            });

            map.controls[google.maps.ControlPosition.LEFT_CENTER].push(button);
        };

        let parent = this.parent; // parent refers to ResourceLocator component

        /* displays relevant location markers on map when user clicks on place button */
        const fetchPlaces = (props, map, query) => {
            let places = localStorage.getItem("places");

            if (!places) {
                const newPlaces = {
                    current: "",
                    Veterinarian: [],
                    "Dog park": [],
                    "Pet store": [],
                    "Pet hotel": [],
                    "Pet grooming": [],
                };

                localStorage.setItem("places", JSON.stringify(newPlaces));

                places = newPlaces;
            } else places = JSON.parse(places);

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
            const currMarkers = parent.state.currentMarkers;
            if (currMarkers.length !== 0) {
                for (let i = 0; i < currMarkers.length; i++) currMarkers[i].setMap(null);
                parent.setState({ currentMarkers: [] });
            }

            // updates next place to be displayed
            places.current = query;
            let newMarkers = [];

            // displays markers for cached places if previously searched
            const allPlaces = places[query];
            if (allPlaces.length !== 0) {
                for (let i = 0; i < allPlaces.length; i++) {
                    service.getDetails({ placeId: allPlaces[i] }, (place, status) => {
                        const marker = new google.maps.Marker({
                            map: map,
                            place: {
                                placeId: allPlaces[i],
                                location: place.geometry.location,
                            },
                        });

                        const contentString = `<h5>${place.name}</h5> <div>${place.formatted_address}</div>`;

                        const infowindow = new google.maps.InfoWindow({
                            content: contentString,
                        });

                        marker.addListener("click", () => {
                            infowindow.open(map, marker);
                        });

                        newMarkers.push(marker);
                        marker.setMap(map);
                    });
                }
            } else {
                // creates, displays, and caches markers for new search
                service.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        for (let i = 0; i < results.length; i++) {
                            const place = results[i];

                            const marker = new google.maps.Marker({
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

                            const contentString = `<h5>${place.name}</h5> <div>${place.formatted_address}</div>`;

                            const infowindow = new google.maps.InfoWindow({
                                content: contentString,
                            });

                            marker.addListener("click", () => {
                                infowindow.open(map, marker);
                            });

                            allPlaces.push(place.place_id);
                            newMarkers.push(marker);
                            marker.setMap(map);
                        }
                    }
                });
            }

            parent.setState({ currentMarkers: newMarkers });
            localStorage.setItem("places", JSON.stringify(places));
        };

        // creates buttons for different place categories on left end of map
        for (let i = 0; i < buttonTitles.length; i++)
            createPlaceButton(props, map, buttonTitles[i], searchQueries[i]);
    }

    render() {
        return (
            <div id="map-container">
                <div id="map-loading-text">
                    Locating...{" "}
                    <Spinner
                        id="map-loading-spinner"
                        animation="grow"
                        variant="warning"
                        size="md"
                        style={{ display: "inline-block", color: "#c88719 !important" }}
                    />
                </div>
                <Map
                    id="map"
                    google={this.props.google}
                    style={mapStyles}
                    zoom={12}
                    initialCenter={{ lat: 0, lng: 0 }}
                    center={this.state.location}
                    onReady={this.handleReady}
                    parent={this}
                >
                    <Marker
                        title="Look, it's you!"
                        name={"Current Location"}
                        position={this.state.location}
                    />
                </Map>
            </div>
        );
    }
}

ResourceLocator = GoogleApiWrapper({
    apiKey: APIKey,
})(ResourceLocator);
