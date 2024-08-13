import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/loader.json'; // Adjust the path accordingly

const Preloader = () => {
  return (
    <div style={styles.loaderContainer}>
      <Lottie animationData={animationData} style={styles.loader} />
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
    backgroundColor: 'transparent',
  },
  loader: {
    width: '50px',
    height: '50px',
  },
};

export default Preloader;
