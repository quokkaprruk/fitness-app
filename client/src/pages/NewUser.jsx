import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; //css file
import Navbar from "../components/Navbar.jsx";
import HomeImg from "../homePicture.png";
import Benefits from "../benefits.png";
import Free from "../free.png";
import Calendar from "../noCommit.png";

const NewUser = () => {
  return (
    <div className="newUser-home">
      <Navbar isLoggedIn={false} />
      <div className="navbar-spacer"></div>
      {/* Hero Section */}
      <header className="hero-section">
        {/*Main top portion */}
        <img
          src={HomeImg}
          alt="Start your fitness journey at the ISGA Gym today!"
          className="home-img"
        />
      </header>

      {/* Class Categories - Cards*/}
      <section className="class-categories">
        <h2>Tailored Workout Classes – Book Your Perfect Session Anytime</h2>
        <div className="categories-grid">
          <div className="category-card">
            <img
              src="https://fitnesslifestyle.mx/wp-content/uploads/2021/05/cardio-fitness-lifestyle.jpg"
              alt="Cardio"
              className="category-img"
            />
            <div className="category-info">
              <h3>Cardio</h3>
              <p>
                Boost your endurance and cardiovascular health with high-energy
                routines.
              </p>
            </div>
          </div>

          <div className="category-card">
            <img
              src="https://1.bp.blogspot.com/-Tzvjww5uyMs/YDr3UB-FeyI/AAAAAAAACPs/7uRHgcRfCTsime9FJDLXdEwZycNMxzsvQCLcBGAsYHQ/s1080/HIIT.jpg"
              alt="HIIT"
              className="category-img"
            />
            <div className="category-info">
              <h3>HIIT</h3>
              <p>
                Push your limits and burn calories fast with high-intensity
                interval training.
              </p>
            </div>
          </div>

          <div className="category-card">
            <img
              src="https://th.bing.com/th/id/OIP.fep2-nccwkwq6gfRFFBvWQAAAA?rs=1&pid=ImgDetMain"
              alt="Yoga"
              className="category-img"
            />
            <div className="category-info">
              <h3>Yoga</h3>
              <p>
                Find balance, flexibility, and inner peace through mindful
                movements and poses.
              </p>
            </div>
          </div>

          <div className="category-card">
            <img
              src="https://static.stacker.com/s3fs-public/croppedshutterstock10389759253CW6jpg.JPEG?token=mpwJdcQo"
              alt="Weight Training"
              className="category-img"
            />
            <div className="category-info">
              <h3>Weight Training</h3>
              <p>
                Build strength and tone your muscles with focused weightlifting
                exercises.
              </p>
            </div>
          </div>

          <div className="category-card">
            <img
              src="https://kingstonphysiotherapy.com/images/pilates-2021-4.jpg"
              alt="Pilates"
              className="category-img"
            />
            <div className="category-info">
              <h3>Pilates</h3>
              <p>
                Strengthen your core and enhance flexibility through mindful
                movements.
              </p>
            </div>
          </div>

          <div className="category-card">
            <img
              src="https://th.bing.com/th/id/OIP.rPo_ReuqocfxEaVEX1fTdAHaE7?rs=1&pid=ImgDetMain"
              alt="Meditation"
              className="category-img"
            />
            <div className="category-info">
              <h3>Meditation</h3>
              <p>
                Find your inner peace and calm your mind with guided relaxation
                techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Link to="/classes">
        <button className="reserve-btn">Reserve a Spot</button>
      </Link>

      <section className="info-bubbles">
        <div className="info-bubble">
          <img src={Benefits} alt="Benefits Icon" className="bubble-icon" />
          <h3>Amazing Benefits</h3>
          <p>
            Enjoy personalized fitness plans + access to top-notch equipment.
          </p>
        </div>
        <div className="info-bubble">
          <img src={Free} alt="Free Workout Icon" className="bubble-icon" />
          <h3>Enjoy free workouts!</h3>
          <p>Join us for a free workout every second and fourth Tuesday!</p>
        </div>
        <div className="info-bubble">
          <img src={Calendar} alt="No Pressure Icon" className="bubble-icon" />
          <h3>You are in charge!</h3>
          <p>Cancel/Change your membership when and how you want.</p>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonials">
        <h2>What Our Members Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <p>
              "I’ve been a member of ISGA Gym for several months, and it’s been
              an amazing experience. The gym is clean, well-equipped, and the
              staff are incredibly friendly and knowledgeable. The variety of
              machines and free weights is perfect for my routine, and the
              atmosphere is motivating. Definitely my favorite place to work
              out!"
            </p>
            <h4>- Alex J.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The ISGA Gym website is incredibly easy to navigate. I can book
              equipment, track my progress, and access fitness resources all in
              one place. It’s clean, intuitive, and responsive. Whether I’m
              using my laptop or phone, the website adapts seamlessly.
              Definitely one of the best gym websites I’ve used."
            </p>
            <h4>- Jamie P.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "I find the ISGA Gym website to be very functional, with a smooth
              user experience. I love how I can view available equipment and
              make reservations effortlessly. My only suggestion would be to add
              more video content for workout guides, but overall it’s a
              fantastic website for gym-goers!"
            </p>
            <h4>- Taylor S.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "I absolutely love ISGA Gym! The variety of classes, the helpful
              trainers, and the wide range of equipment make it a great place to
              work out. I especially enjoy the leg toning classes, and the gym's
              atmosphere is always motivating. I’ve seen great results, and the
              staff is always encouraging. Highly recommend!"
            </p>
            <h4>- Rita Singh.</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 ISGA Gym. All rights reserved.</p>
        <div className="social-links">
          <a href="https://www.instagram.com/">Instagram</a>
          <a href="https://www.facebook.com/">Facebook</a>
          <a href="https://x.com/__x?mx=2">X</a>
        </div>
      </footer>
    </div>
  );
};

export default NewUser;
