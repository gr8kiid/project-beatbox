import React, { useState, useEffect, useRef, useContext } from 'react'
import { MdOutlineDeleteOutline } from 'react-icons/md'
import { useNavigate } from "react-router-dom";
import { db } from '../../firebase-config'
import { doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase-config'
import Loader from '../Loader';
import EditSongModal from './EditSongModal';
import { v4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDataContext } from '../context/UserDataContext';


const AllSongs = ({ userData }) => {
    const [songs, setSongs] = useState([]);
    const [imageUpload, setImageUpload] = useState(null);
    const artistInputRef = useRef(null);
    const { fetchUserData } = useContext(UserDataContext);

    useEffect(() => {
        if (userData?.songs) {
            setSongs(userData.songs);
        }
    }, [userData])

    const [loading, setLoading] = useState(false);
    const artistName = userData?.name;

    const deleteSong = async (index) => {
        const song = userData.songs[index];

        setLoading(true);
        // Delete song's image file from Cloud Storage
        const imageRef = ref(storage, song.coverArt);
        await deleteObject(imageRef);

        // Delete song's audio file from Cloud Storage
        const audioRef = ref(storage, song.music);
        await deleteObject(audioRef);

        const updatedSongs = [...songs];
        updatedSongs.splice(index, 1);
        setSongs(updatedSongs);

        try {
            const artistRef = doc(db, "artist", userData.uid);
            await updateDoc(artistRef, {
                songs: updatedSongs
            });

            setLoading(false);
            toast.success('Song deleted successfully', {
                position: "top-center"
            });
            fetchUserData(userData);
        }
        catch (e) {
            setLoading(false);
            toast.error("Error deleting song: ", e, {
                position: "top-center"
            });
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (imageUpload !== null) {
            setLoading(true);
            const imageRef = ref(storage, `images/artists/${imageUpload.name + v4()}`);
            const imageUploadTask = uploadBytes(imageRef, imageUpload);

            Promise.all([imageUploadTask]).then(async () => {
                const imageURL = await getDownloadURL(imageRef);

                try {
                    const artistRef = doc(db, "artist", userData.uid);

                    await updateDoc(artistRef, { image: imageURL });
                    setLoading(false);
                    toast.success("Profile image updated successfully", {
                        position: "top-center"
                    });
                    fetchUserData(userData);
                } catch (e) {
                    setLoading(false);
                    toast.error("Error updating profile image: ", e, {
                        position: "top-center"
                    });
                }
            });
        }
    }, [imageUpload]);

    const changeArtistImage = async () => {
        artistInputRef.current.click();
    }

    const handleClick = () => {
        navigate("/addSong");
    }

    const Header = () => {
        return (
            <>
                <ToastContainer />
                {loading && <Loader title={"Updating"} />}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center mt-6">
                    <div className="col-span-1 md:col-span-1">
                        {userData && (
                            <img
                                className="w-50 h-60 object-cover"
                                src={userData?.image}
                                alt={`${userData.name}'s banner`}
                            />
                        )}
                    </div>
                    <h3 className="col-span-1 md:col-span-1 text-lg font-bold text-center mt-4 md:mt-0 max-w-xs md:max-w-full">
                        Welcome{" "}
                        <span className="text-violet-800">{artistName}</span>, here's the
                        list of the songs uploaded
                    </h3>
                    <div className="col-span-1 md:col-span-1 flex flex-col md:flex-row mt-4 md:mt-0">
                        <button className="w-full max-w-xs md:max-w-none bg-cyan-500 hover:bg-cyan-600 p-2 px-5 text-black font-bold rounded mb-2 md:mb-0 md:mr-2" onClick={handleClick}>
                            Add New Song
                        </button>
                        <button className="w-full max-w-xs md:max-w-none bg-cyan-500 hover:bg-cyan-600 p-2 px-5 text-black font-bold rounded" onClick={changeArtistImage}>
                            Change Profile Image
                        </button>
                        <input
                            ref={artistInputRef}
                            onChange={(e) => setImageUpload(e.target.files[0])}
                            type="file"
                            accept="image/*"
                            className="hidden"
                        />
                    </div>
                </div>
            </>
        )
    }

    if (!userData) {
        return (
            <Header />
        );
    }

    return (
        <div className='flex flex-col'>
            <Header />
            <div className="overflow-x-auto overflow-y-auto max-w-[330px] md:max-w-full">
                <table className="table-auto md:table-auto md:w-full mt-6">
                    <thead className="border-b-2 border-t-2 border-gray-300">
                        <tr>
                            <th className="text-center text-black-400 p-6">Title</th>
                            <th className="text-center text-black-400">Audio</th>
                            <th className="text-center text-black-400">Cover Art</th>
                            <th className="text-center text-black-400">Date Added</th>
                            <th className="text-center text-black-400"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs &&
                            Array.isArray(songs) &&
                            songs.map((song, index) => (
                                <tr key={index}>
                                    <td className="text-center py-3 border-b-2 border-gray-400 p-2">
                                        {song?.title}
                                    </td>
                                    <td className="text-center py-3 border-b-2 border-gray-400 p-2">
                                        <audio className="mx-auto" src={song?.music} controls />
                                    </td>
                                    <td className="text-center py-3 border-b-2 border-gray-400 p-2">
                                        <img
                                            className="h-[70px] w-[70px] mx-auto"
                                            src={song?.coverArt}
                                            alt="cover_art"
                                        />
                                    </td>
                                    <td className="text-center py-3 border-b-2 border-gray-400 p-2">
                                        {song?.date}
                                    </td>
                                    <td className="text-center py-3 border-b-2 border-gray-400 p-2">
                                        <EditSongModal
                                            song={song}
                                            i={index}
                                            userData={userData}
                                            setLoading={setLoading}
                                        />
                                        <button
                                            onClick={() => deleteSong(index)}
                                            className="text-red-500 hover:text-red-300 font-bold mx-6"
                                        >
                                            <MdOutlineDeleteOutline size={30} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AllSongs
