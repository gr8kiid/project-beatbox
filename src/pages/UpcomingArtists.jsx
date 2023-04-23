import React from 'react';
import { ArtistCard, Loader } from '../components';

const UpcomingArtists = ({ artistData, isFetchingSongsData }) => {

    if (isFetchingSongsData) return <Loader title="Loading artists..." />;

    // if (error) return <Error />;

    return (
        <div className="flex flex-col">
            <h2 className="font-bold text-3xl text-white text-left mt-4 mb-10">Upcoming artists</h2>

            <div className="flex flex-wrap sm:justify-start justify-center gap-8">
                {artistData?.map((artist, i) => <ArtistCard key={i} artist={artist} />)}
            </div>
        </div>
    );
};

export default UpcomingArtists;
