import React, { useState, useEffect } from 'react'
import axios from "./axios"
import "./Row.css";
import Youtube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {

    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("")

    // a snippet of code runs based on a specific condition
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl)
            // console.log(request);
            setMovies(request.data.results);
        }
        fetchData();
    }, [fetchUrl])       // if dependency array is empty, useEffect will only load once and not again 

    // {// find the youtube trailerURL from youtube for the given movie name
    //      //movie trailer will give us the full URL 
    //      // we have to fetch the TrailerUrl portion and set state variable 
    //     }
    function handleClick(movie) {
        if (trailerUrl) {
            setTrailerUrl("");
        }
        else {
            movieTrailer(movie?.name || "")
                .then(url => {
                    const UrlParams = new URLSearchParams(new URL(url).search)
                    setTrailerUrl(UrlParams.get("v"));
                })
                .catch(err => console.log(err));
        }
    }

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className="row">
            {/* {title} */}
            <h1 className="row_title"> {title} </h1>

            <div className="row_posters">
                {movies.map(movie => {
                    return <img
                        onClick={() => handleClick(movie)}
                        key={movie.id}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} ></img>
                })}
            </div>

            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}

        </div>
    )
}

export default Row