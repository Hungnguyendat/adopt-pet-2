import { View, Text } from 'react-native'
import React , {useEffect,useState} from 'react'
import {useLocalSearchParams, useNavigation} from'expo-router';
import {addDoc,collection, doc, getDoc, onSnapshot} from 'firebase/firestore';
import {db} from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat } from 'react-native-gifted-chat'
import moment from 'moment';
import { DataConnect } from 'firebase/data-connect';


export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation= useNavigation();
  const {user} = useUser();
  const [messages, setMessages] = useState([])


  useEffect(()=>{
    GetUserDetail();
    const unsubcribe = onSnapshot(collection(db,'Chat',params?.id, 'Messages'),(snapshot)=>{
      const MessageData = snapshot.docs.map((doc)=>({
        _id:doc.id,
        ...doc.data()
      }))
      setMessages(MessageData)
    });
    return()=>unsubcribe();

  },[])

  const GetUserDetail=async()=>{
    const docRef = doc(DataConnect,'Chat',params?.id);
    const docsnap=await getDoc(docRef);

    const result = docsnap.data();
    console.log(result);
    const otherUser = result?.users.filter(item => item.email!= user?.primaryEmailAddress?.emailAddress);
    console.log(otherUser);
    navigation.setOptions({
      headerTitle:otherUser[0].name
    })
  }

    const onSend= async(newMessage)=>{
      setMessages((previousMessage)=>GiftedChat.append(previousMessage,newMessage));
      newMessage[0].createdAt = moment().format('MM-DD-YYYY HH:mm:ss');
      await addDoc(collection(db,'Chat',params.id,'Messages'),newMessage[0])
    }
  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress,
        name:user?.fullName,
        avatar: user?.imageUrl
      }}
    />
  )
}