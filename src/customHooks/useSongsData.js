import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { toast } from "react-toastify";

const useSongsData = () => {
    const [songsData, setSongsData] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [isFetchingSongsData, setIsFetchingSongsData] = useState(false);

    const getSongsData = async () => {
        setIsFetchingSongsData(true);
        try {
            const artistSnapshot = await getDocs(collection(db, "artist"));
            const songsData = [];
            const artistData = [];

            artistSnapshot.forEach((doc) => {
                const artist = doc.data();
                const artistName = artist.name;
                const artistImage = artist.image;
                artistData.push({ name: artistName, image: artistImage });

                if (Array.isArray(artist.songs)) {
                    artist.songs.forEach((song) => {
                        if (song) {
                            const songWithArtistName = { ...song, artist: artistName };
                            songsData.push(songWithArtistName);
                        }
                    });
                }
            });

            setIsFetchingSongsData(false);
            setSongsData(songsData);
            setArtistData(artistData);
        } catch (error) {
            toast.error(error);
            setIsFetchingSongsData(false);
            return null;
        }
    };

    return { songsData, artistData, isFetchingSongsData, getSongsData };
};

export default useSongsData;
