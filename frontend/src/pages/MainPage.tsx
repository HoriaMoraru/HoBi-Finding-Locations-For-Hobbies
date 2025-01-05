import React from "react";
import Header from "../organisms/header/Header";
import StartExploringButton from "../atoms/buttons/StartExploringButton.tsx";

const MainPage: React.FC = () => {
    return (
        <div>
            <Header />
            <main className="container mt-4">
                {/* Hero Section */}
                <section className="text-center py-5 bg-light">
                    <h1 className="display-4 fw-bold">Explore Your Hobbies. Anywhere, Anytime.</h1>
                    <p className="lead">
                        Discover nearby locations tailored to your favorite activities with HoBi.
                    </p>
                    <StartExploringButton>Start Exploring</StartExploringButton>
                </section>

                {/* Features Section */}
                <section className="py-5">
                    <h2 className="text-center mb-4">Why Choose HoBi?</h2>
                    <div className="row text-center">
                        <div className="col-md-3">
                            <h3>Search by Hobby</h3>
                            <p>Find swimming pools, hiking trails, and more with a single search.</p>
                        </div>
                        <div className="col-md-3">
                            <h3>Interactive Map</h3>
                            <p>Explore nearby locations on a beautifully designed map.</p>
                        </div>
                        <div className="col-md-3">
                            <h3>Personalized Recommendations</h3>
                            <p>Get tailored suggestions based on your preferences.</p>
                        </div>
                        <div className="col-md-3">
                            <h3>Global Reach</h3>
                            <p>Discover hobby spots anywhere in the world.</p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-light py-5">
                    <h2 className="text-center mb-4">How It Works</h2>
                    <div className="row text-center">
                        <div className="col-md-4">
                            <h3>1. Enter Your Hobby</h3>
                            <p>Type your favorite hobby into the search bar.</p>
                        </div>
                        <div className="col-md-4">
                            <h3>2. Explore Locations</h3>
                            <p>View nearby spots on the map.</p>
                        </div>
                        <div className="col-md-4">
                            <h3>3. Plan Your Visit</h3>
                            <p>Get directions and details to make the most of your time.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MainPage;
