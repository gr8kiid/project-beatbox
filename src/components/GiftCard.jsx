import React from 'react'
import cardImage from '../assets/giftcard.webp'
import 'tw-elements';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from '../firebase-config'
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GiftCard({ cost, isRedeemed, couponCode, points, updatePoints, user, i }) {

    const updatePointsFireStore = async (user, points, index) => {
        try {
            const userRef = doc(db, "listener", user.uid);
            const userDoc = await getDoc(userRef);
            const listenerData = userDoc.data();
            const giftCards = listenerData.giftCards;
            const updatedGiftCards = [...giftCards]; // create a new copy of the array
            updatedGiftCards[index] = {
                ...updatedGiftCards[index],
                isRedeemed: true,
            };
            await updateDoc(userRef, {
                points: points,
                giftCards: updatedGiftCards
            });
        }
        catch (e) {
            toast.error("Error updating points: ", e, {
                position: "top-center",
            });
        }
    }

    let cardClass = isRedeemed ? "group object-scale-down h-full w-96 opacity-100" : "group object-scale-down h-full w-96  blur-[1px] opacity-75";
    let cardBtn = isRedeemed ? "hidden" : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-center hidden group-hover:block bg-black bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded";

    return (
        <>
            <div className=" w-[250px] md:w-1/5 group relative hover:shadow-lg">

                <img className={cardClass} alt='gift_card_image' src={cardImage} />
                <h2 className={"text-lg font-bold text-white mb-2 text-center"}>{`${cost} points`}</h2>
                <Modal cardBtn={cardBtn} couponCode={couponCode} points={points} cost={cost} user={user} i={i} updatePointsFireStore={updatePointsFireStore} updatePoints={updatePoints} />
            </div>

        </>
    )
}

export default GiftCard