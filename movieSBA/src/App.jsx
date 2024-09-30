import React from 'react';
import Carousel from './Carousel';
import './App.css';

const App = () => {
    return (
        <div>
            <h1 style={titleStyle}>Movie Carousel</h1>
            <Carousel />
            <footer style={footerStyle}>
                <p>© {new Date().getFullYear()} Shaquille Harris</p>
            </footer>
        </div>
    );
};

const titleStyle = {
    textAlign: 'center',
    margin: '20px 0',
};

const footerStyle = {
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '10px 0',
    position: 'relative',
    bottom: 0,
    width: '100%',
};

export default App;
