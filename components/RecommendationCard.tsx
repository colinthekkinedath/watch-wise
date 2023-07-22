import React, { useState, useEffect } from 'react';

interface MovieCardProps {
    title: string;
    description: string;
}

const RecommendationCard = ({ title, description }: MovieCardProps) => {
    const [posterPath, setPosterPath] = useState('');
    const [releaseDate, setreleaseDate] = useState('');


    useEffect(() => {
        // Fetch movie data based on the title
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query=${title}`)
            .then((response) => response.json())
            .then((json) => {
                if (json.results && json.results.length > 0) {
                    setPosterPath(json.results[0].poster_path);
                    setreleaseDate(json.results[0].release_date);
                }
            })
            .catch((error) => {
                // Handle the error if the API call fails
                console.error('Error fetching movie data:', error);
            });
    }, [title]);
    

    return (
        <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition border">
            <div className="flex items-start">
                    {posterPath && (
                    <img
                        src={`http://image.tmdb.org/t/p/w500/${posterPath}`}
                        alt={title}
                        className="w-64 h-64 object-cover rounded-md mr-4"
                    />
                    )}
                    <div className = 'flex flex-col'>
                        <div className = 'text-3xl font-bold'>
                            {title.replace(/"/g, '')}
                        </div>
                        {description}
                        {releaseDate && (
                            <div className = 'text-sm text-gray-500'>
                                Released: {releaseDate}
                            </div>
                        )}
                    </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
