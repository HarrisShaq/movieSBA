import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';

const API_KEY = 'ac622c68';

const defaultMovies = [
    { Title: 'Step Brothers', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0879833' },
    { Title: 'The 40-Year-Old Virgin', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0405422' },
    { Title: 'Superbad', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0829482' },
    { Title: 'Anchorman', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0357413' },
    { Title: 'Talladega Nights', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0410146' },
    { Title: 'Coming to America', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0094898' },
    { Title: 'Hitch', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0386588' },
    { Title: 'Scarface', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0086250' },
    { Title: 'Paid in Full', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0302010' },
    { Title: 'The Dark Knight', Poster: 'https://via.placeholder.com/150', imdbID: 'tt0468569' },
];

const Carousel = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState(defaultMovies);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetchMovies('batman');
        loadLocalStorageData();
    }, []);

    const fetchMovies = async (term) => {
        try {
            const response = await axios.get(`http://www.omdbapi.com/?s=${term}&apikey=${API_KEY}`);
            if (response.data.Search) {
                const detailedMovies = await Promise.all(
                    response.data.Search.map(async (movie) => {
                        const detailResponse = await axios.get(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
                        return detailResponse.data;
                    })
                );
                setMovies(detailedMovies);
            } else {
                setMovies(defaultMovies);
            }
        } catch (error) {
            console.error('Error fetching movie data:', error);
            setMovies(defaultMovies);
        }
    };

    const loadLocalStorageData = () => {
        const storedLikes = JSON.parse(localStorage.getItem('likes')) || {};
        const storedComments = JSON.parse(localStorage.getItem('comments')) || {};
        setLikes(storedLikes);
        setComments(storedComments);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 2) {
            fetchMovies(e.target.value);
        } else {
            setMovies(defaultMovies);
        }
    };

    const toggleLike = (imdbID) => {
        const updatedLikes = { ...likes, [imdbID]: !likes[imdbID] };
        setLikes(updatedLikes);
        localStorage.setItem('likes', JSON.stringify(updatedLikes));
    };

    const handleCommentChange = (imdbID, comment) => {
        const updatedComments = { ...comments, [imdbID]: comment };
        setComments(updatedComments);
        localStorage.setItem('comments', JSON.stringify(updatedComments));
    };

    const filteredMovies = movies.filter(movie =>
        movie.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredMovies.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + filteredMovies.length) % filteredMovies.length
        );
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '20px', padding: '10px', width: '80%' }}
            />
            <div style={{ position: 'relative', overflow: 'hidden', width: '80%', margin: '0 auto' }}>
                <button onClick={prevSlide} style={{ ...buttonStyle, left: '10px' }}>❮</button>
                {filteredMovies.length > 0 && (
                    <div style={{
                        display: 'flex',
                        transition: 'transform 0.5s ease',
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}>
                        {filteredMovies.map((movie, index) => (
                            <div key={index} style={{ minWidth: '100%', textAlign: 'center' }}>
                                <div
                                    onMouseEnter={() => setHoveredMovie(movie)}
                                    onMouseLeave={() => setHoveredMovie(null)}
                                    style={{ position: 'relative', display: 'inline-block' }}
                                >
                                    <img src={movie.Poster} alt={movie.Title} style={{ width: '100%', height: 'auto' }} />
                                    {hoveredMovie && hoveredMovie.imdbID === movie.imdbID && (
                                        <div className="tooltip">
                                            <h3>{movie.Title}</h3>
                                            <p>{movie.Plot}</p>
                                        </div>
                                    )}
                                </div>
                                <h3>{movie.Title}</h3>
                                <button onClick={() => toggleLike(movie.imdbID)}>
                                    {likes[movie.imdbID] ? 'Unlike' : 'Like'}
                                </button>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={comments[movie.imdbID] || ''}
                                        onChange={(e) => handleCommentChange(movie.imdbID, e.target.value)}
                                        className="comment-input"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button onClick={nextSlide} style={{ ...buttonStyle, right: '10px' }}>❯</button>
            </div>
        </div>
    );
};

const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '10px',
    zIndex: 1,
};

export default Carousel;
