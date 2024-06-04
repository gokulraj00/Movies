import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file

const Homes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movies, setMovies] = useState([]);
    const [lists, setLists] = useState([]);
    const [listName, setListName] = useState('');
    const apiKey = '2302d946'; 
    const userId = localStorage.getItem('userId'); 
    const [listId, setListId] = useState("");
    const [listMovies, setListMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/list/${userId}`);
                setLists(response.data);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchLists();
    }, [userId]);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm.trim()}`);
            console.log('Response:', response.data);
            setMovies(response.data.Search || []);
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    };

    const handleCreateList = async () => {
        try {
            const response = await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/list/create', {
                name: listName,
                userId,
                isPublic: true
            });
            setLists([...lists, response.data]);
            setListId(response.data._id);
            setListName('');
        } catch (error) {
            console.error('Error creating list:', error);
        }
    };

    const handleAddToList = async (movieId) => {
        if (!listId) {
            console.error('No list selected');
            return;
        }

        try {
            const response = await axios.put('${process.env.REACT_APP_BACKEND_URL}/api/list/add-movie', {
                listId,
                movies: [movieId] 
            });
            console.log('Movie added to list:', response.data);
            setListMovies(response.data.movies);
        } catch (error) {
            console.error('Error adding movie to list:', error);
        }
    };

    const handleListChange = async (event) => {
        const selectedListId = event.target.value;
        setListId(selectedListId);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/${selectedListId}`);
            setListMovies(response.data.movies || []);
        } catch (error) {
            console.error('Error fetching list movies:', error);
        }
    };

    const moveToList = async() => {
        navigate("/lists");
    }

    return (
        <div className="container">
            <div className="top-bar">
                <div className='header'>
                    <button className='btn'>Home</button>
                    <button className='btn' onClick={moveToList}>My List</button>
                </div>
                <input 
                    type="text" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    placeholder="Search Movies" 
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            {/* <div className="create-list">
                <h2>Create a New List</h2>
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="List Name"
                />
                <button onClick={handleCreateList}>Create List</button>
            </div> */}
            
            <div className="movies-container">
                {movies.map((movie, index) => (
                   <div key={movie.imdbID} className="movie">
                       <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
                       <div className="movie-details">
                           <h2>{movie.Title}</h2>
                           <h2>{movie.Year}</h2>
                       </div>
                       <div className="select-list">
                            <h2>Select a List</h2>
                            <select onChange={handleListChange} value={listId}>
                                <option value="">Select a list</option>
                                {lists.map(list => (
                                    <option key={list._id} value={list._id}>{list.name}</option>
                                ))}
                            </select>
                        </div>
                       <button onClick={() => handleAddToList(movie.imdbID)}>Add to List</button>
                   </div>
                ))}
            </div>
        </div>
    );
};

export default Homes;
