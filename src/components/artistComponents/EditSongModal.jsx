import React, { useState, useContext } from 'react';
import { BiPencil } from 'react-icons/bi'
import { db } from '../../firebase-config'
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDataContext } from '../context/UserDataContext';

const EditSongModal = ({ song, updateSong, i, userData, setLoading }) => {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState(song.title);
    const [imageUpload, setImageUpload] = useState(null);
    const [musicUpload, setMusicUpload] = useState(null);
    const storage = getStorage();
    const { fetchUserData } = useContext(UserDataContext);

    const editSong = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let imageURL = song.coverArt;
        let musicURL = song.music;

        // Check if a new image file was uploaded
        if (imageUpload) {
            const imageRef = ref(storage, `images/songs/${imageUpload.name + v4()}`);
            await uploadBytes(imageRef, imageUpload);
            imageURL = await getDownloadURL(imageRef);
        }

        // Check if a new music file was uploaded
        if (musicUpload) {
            const musicRef = ref(storage, `music/${musicUpload.name + v4()}}`);
            await uploadBytes(musicRef, musicUpload);
            musicURL = await getDownloadURL(musicRef);
        }

        try {
            const artistRef = doc(db, "artist", userData.uid);
            const updatedSongs = [...userData.songs];
            updatedSongs[i] = {
                ...song,
                title: title,
                coverArt: imageURL,
                music: musicURL,
                date: new Date().toLocaleDateString(),
            };
            await updateDoc(artistRef, { songs: updatedSongs });
            setLoading(false);
            toast.success("Song updated successfully", {
                position: "top-center",
            });
            closeModal();
            fetchUserData(userData);
        } catch (e) {
            setLoading(false);
            toast.error("Error updating song: ", e, {
                position: "top-center",
            });
        }
    };


    return (
        <>
            <ToastContainer />
            <button className=" text-cyan-300 hover:text-cyan-600 font-bold mx-6" onClick={editSong} ><BiPencil size={30} /></button>
            {showModal && (

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed opacity-75"></div>
                        <div className="bg-white rounded-lg overflow-hidden w-96">
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                                    <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="music" className="block text-gray-700 font-bold mb-2">Song:</label>
                                    <input onChange={(e) => setMusicUpload(e.target.files[0])} style={{ color: 'black', background: 'transparent', outline: 'none' }} type='file' accept="audio/*" className='border rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="coverArt" className="block text-gray-700 font-bold mb-2">Cover Art:</label>
                                    <input onChange={(e) => setImageUpload(e.target.files[0])} style={{ color: 'black', background: 'transparent', outline: 'none' }} type='file' accept="image/*" className='border rounded-lg py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500' />
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" onClick={closeModal} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancel</button>
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditSongModal;
