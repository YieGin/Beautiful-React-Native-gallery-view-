import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import axios from "axios";

const { width, height } = Dimensions.get("screen");
const IMAGE_SIZE = 80;
export default function App() {
  const [data, setData] = React.useState(false);

  useEffect(() => {
    async function getStoreData() {
      const response = await axios.get("https://fakestoreapi.com/products");
      setData(response.data);
    }
    getStoreData();
  }, []);
  const topRef = React.useRef();
  const thumbRef = React.useRef();
  const [ActiveIndex, setActiveIndex] = React.useState(0);

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + 20) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + 20) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={topRef}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width)
          );
        }}
        renderItem={({ item }) => {
          return (
            <View style={{ width, height }}>
              <Image
                style={[StyleSheet.absoluteFillObject]}
                source={{ uri: item.image }}
              />
            </View>
          );
        }}
      />
      <FlatList
        ref={thumbRef}
        keyExtractor={(item) => item.id.toString()}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: 80 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
              <Image
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                  borderRadius: 12,
                  marginRight: 20,
                  borderWidth: 5,
                  borderColor: ActiveIndex === index ? "#fff" : "transparent",
                }}
                source={{ uri: item.image }}
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
