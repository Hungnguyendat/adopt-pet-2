import { View, Text, Image, StyleSheet, FlatListComponent, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs } from 'firebase/firestore'
import { db } from './../../config/FirebaseConfig'
import { FlatList } from 'react-native'

export default function Slider() {

    const [sliderList, setSliderList] = useState([])
    useEffect(() => {
        GetSliders();
    }, [])
    const GetSliders = async () => {
        setSliderList([]);
        const snapshot = await getDocs(collection(db, 'Slider'))
        snapshot.forEach((doc) => {
            console.log(doc.data());
            setSliderList(sliderList => [...sliderList, doc.data()])
        })
    }

    return (
        <View style={{
            marginTop: 15
        }}>
            <FlatList
                data={sliderList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <View>
                        <Image source={{ uri: item?.imageUrl }}
                            style={styles.sliderImage}
                        />
                    </View>
                )}
            />

        </View>
    )
}
const styles = StyleSheet.create({
    sliderImage: {
        width: Dimensions.get('screen').width * 0.9,
        height: 170,
        borderRadius: 15,
        marginRight: 15
    },
})