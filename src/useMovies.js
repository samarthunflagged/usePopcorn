import { useState, useEffect } from "react";
const KEY = 'bec827d1';
export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    useEffect(function () {

        const controller = new AbortController();
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError('');
                const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });

                if (!res.ok) {
                    throw new Error('Something went wrong with fetching movies');
                }

                const data = await res.json();

                if (data.Response === 'False') {
                    throw new Error('Movie not found');
                }

                setMovies(data.Search);
                setError("");
            } catch (err) {
                if (err.name !== "AbortError") {

                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
        if (!query.length) {
            setMovies([]);
            setError('');
            return;
        }
        // handleCloseMovie();
        fetchMovies();

        return function () {
            controller.abort();
        }
    }, [query]);
    return { movies, isLoading, error }
}