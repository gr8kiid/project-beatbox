import React from 'react';
import { Loader, SongCard } from '../components';

const Discover = ({ songsData, isFetchingSongsData }) => {

  if (isFetchingSongsData) return <Loader title="Loading songs..." />;



  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover</h2>
      </div>

      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songsData?.map((song, i) => (
          <SongCard
            key={i}
            song={song}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
