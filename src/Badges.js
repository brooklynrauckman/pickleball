import React, { useEffect, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';

const Badges = (props) => {
  const {user} = props;

  const [value] = useCollection(
    firebase.firestore().collection('users').where("userId", "==", user ? user.uid : '')
  );

  const [badges, setBadges] = useState([]);

  const toggleOptions = (options)=>{
    const updatedBadges = badges.map((badge)=>{
      if(badge.title === options.title){
        badge.selected = !badge.selected;
      }
      return badge
    })
    setBadges(updatedBadges)
  }

  async function updateBadges(badge){
    const querySnapshot = await value.docs[0].get('badge');
    const updatedArray = querySnapshot.map((b)=> {
      if(b.title === badge.title){
        // remove unneeded key from UI
        delete b.selected;
        b.completed = !badge.completed;
      }
      return b;
    });
    // after the loop update the loop in its entiretiy
    value.docs[0].ref.update({
      "badge": updatedArray,
    });
  }

  async function deleteBadges(badge){
    const querySnapshot = await value.docs[0].get('badge');
    const updatedArray = querySnapshot.filter((b)=> {
      if(b.title !== badge.title)
      {return b}
    });
    value.docs[0].ref.update({
      "badge": updatedArray,
    });
  }

  useEffect(()=>{
    async function getBadges(){
      // we assume there is only 1 result so hardcode the [0]
      const fetchedBadges = await value.docs[0].get('badge');
      // CHANGE FETCHED BADGES
      const newFetchedBadges = fetchedBadges.map((badge)=>{
        return {
          title: badge.title,
          completed: badge.completed,
          selected: false
        }
      })
      setBadges(newFetchedBadges);
    }
    if(value && value.docs[0] && user){
      getBadges();
    }
  }, [value])

  return (
    <div className="badges-wrapper">
      <div className="badges">
          {badges.length
            ?
              badges.map((badge, index) => (
                <div key={badge.title.toString()} className={badge.completed ? "badge completed" : "badge"}>
                  {badge.selected
                    ?
                      <div className="options-list">
                        <svg className="options"
                             onClick={()=> toggleOptions(badge)}
                             xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        <div className="option"
                             onClick={()=> {toggleOptions(badge); updateBadges(badge);}}
                        >{badge.completed ? "In Progress" : "Acheived!"}</div>
                        <div className="option"
                             onClick={()=> {toggleOptions(badge); deleteBadges(badge);}}
                        >Remove</div>
                      </div>
                    :
                      <React.Fragment>
                        <svg className="options" id={`badge-${index}`}
                            onClick={()=> toggleOptions(badge)}
                           xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                        <div className="challenge">{badge.title}</div>
                      </React.Fragment>
                  }
                </div>
              ))
            : ''
          }
      </div>
    </div>
  );
};

export default Badges;
