import React, { useState, useContext } from 'react'
import { db } from '../../firebase-config'
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from 'uuid';
import Loader from '../Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserDataContext } from '../context/UserDataContext';

const AddNewSong = ({ userData }) => {
    const [title, setTitle] = useState('')
    const [imageUpload, setImageUpload] = useState(null);
    const [musicUpload, setMusicUpload] = useState(null);
    const artistName = userData?.name;
    const storage = getStorage();
    const [loading, setLoading] = useState(false);
    const { fetchUserData } = useContext(UserDataContext);


    const handleSubmit = async () => {
        if (imageUpload === null || musicUpload === null) {
            toast('Please upload a cover art and song', {
                position: toast.POSITION.TOP_CENTER
            })
            return;
        }
        setLoading(true);
        const musicRef = ref(storage, `music/${musicUpload.name + v4()}}`);
        const musicUploadTask = uploadBytes(musicRef, musicUpload);

        const imageRef = ref(storage, `images/songs/${imageUpload.name + v4()}`);
        const imageUploadTask = uploadBytes(imageRef, imageUpload);

        Promise.all([musicUploadTask, imageUploadTask]).then(async () => {
            const musicURL = await getDownloadURL(musicRef);
            const imageURL = await getDownloadURL(imageRef);

            addSong(userData, title, musicURL, imageURL);
        });
    }

    const addSong = async (user, title, musicURL, imageURL) => {
        try {
            const artistRef = doc(db, "artist", user.uid);
            await updateDoc(artistRef, {
                songs: [...user.songs,
                {
                    title: title,
                    music: musicURL,
                    coverArt: imageURL,
                    date: new Date().toLocaleDateString()
                }]
            });

            setLoading(false);
            toast.success('Song added successfully', {
                position: toast.POSITION.TOP_CENTER
            });
            fetchUserData(userData);
        }
        catch (e) {
            setLoading(false);
            toast.error("Error adding song: ", e, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    return (

        <div>
            <ToastContainer />
            {loading && <Loader title={"Uploading"} />}
            <div className='grid grid-cols-2 gap-4 mt-6'>
                <h3 className='text-lg font-bold'>Welcome <span className='text-violet-800'>{artistName}</span>, you can add more songs below</h3>
            </div>
            <div style={{ alignSelf: 'center' }} className='mt-9 w-3/5'>
                <div className='mb-5'>
                    <label className='text-black-100 font-bold'>Title</label>
                    <input value={title} onChange={(e) => { setTitle(e.target.value) }} style={{ color: 'black', background: 'transparent', outline: 'none' }} type='text' className='text-white w-full border-2 border-gray-300 rounded p-2 mt-2' />
                </div>
                <div className='mt-2 mb-5'>
                    <label className='text-black-100 font-bold'>Song</label>
                    <input onChange={(e) => setMusicUpload(e.target.files[0])} style={{ color: 'black', background: 'transparent', outline: 'none' }} type='file' accept="audio/*" className='text-black w-full border-2 border-gray-300 rounded p-2 mt-2' />
                </div>
                <div className='mt-2'>
                    <label className='text-black-100 font-bold'>Cover Art</label>
                    <input onChange={(e) => setImageUpload(e.target.files[0])} style={{ color: 'black', background: 'transparent', outline: 'none' }} type='file' accept="image/*" className='text-black w-full border-2 border-gray-300 rounded p-2 mt-2' />
                </div>

                <button className="bg-cyan-500 hover:bg-cyan-600 mt-3 px-6 py-2 rounded text-white font-bold" onClick={handleSubmit}>ADD NEW SONG</button>
            </div>
        </div>
    )
}

export default AddNewSong
