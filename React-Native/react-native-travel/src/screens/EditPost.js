import React, { useContext, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from "react-native-maps";
import { PlaceContext } from "../contexts/PlaceContext";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import UUID from "react-native-uuid";
import { useNavigation, useRoute } from "@react-navigation/native";

const EditPost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const post = route.params;
  // console.log(post)
  const [placeList, setPlaceList] = useState(post.placeList);
  const { user } = useContext(UserContext);
  const mapRef = useRef(null);
  const regionRef = useRef({
    latitude: 37.5665,
    longitude: 126.978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [markerPosition, setMarkerPosition] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [postTitle, setPostTitle] = useState(post.postTitle);
  const [postContent, setPostContent] = useState(post?.postContent || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaceList, setFilteredPlaceList] = useState([]);
  const [selectedFilteredPlaces, setSelectedFilteredPlaces] = useState([]);
  const [selectedPlacesList, setSelectedPlacesList] = useState([]);
  const [selectedImages, setSelectedImages] = useState(
    (post?.imageUrls || []).map((uri) => ({
      id: UUID.v4(),
      uri: `http://192.168.3.25:9090${uri}`, // 앞에 base URL을 추가
    })) || []
  );

  const GOOGLE_API_KEY = "AIzaSyDdfuKZuF0IpsUtjlx_Syh-gmJhCE70t-8";

  useEffect(() => {
    if (post?.placeList) {
      const placeListArray = post.placeList.map(place => ({
        id: UUID.v4(),
        name: place
      }));
      setPlaceList(placeListArray);
    }
  }, [post, setPlaceList]);

  useEffect(() => {
    if (post?.placeList && post.placeList.length > 0) {
      // 처음 렌더링될 때 장소 목록을 이미 설정된 placeList에서 설정
      const firstPlace = post.placeList[0];
      setPlaceName(firstPlace); // 첫 번째 장소 이름으로 초기화
    }
  }, [post]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
          params: {
            query: searchQuery,
            key: GOOGLE_API_KEY,
            language: "ko",
          },
        }
      );

      const results = response.data.results;
      const placesWithUuid = results.map((result) => ({
        id: UUID.v4(),
        name: result.name,
        location: result.geometry.location,
      }));

      setFilteredPlaceList(placesWithUuid);
      setSelectedFilteredPlaces([]);

      if (placesWithUuid.length > 0) {
        const firstResult = placesWithUuid[0];
        const { lat, lng } = firstResult.location;

        regionRef.current = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        mapRef.current.animateToRegion(regionRef.current, 1000);
        setMarkerPosition({
          latitude: lat,
          longitude: lng,
        });
        setPlaceName(firstResult.name);
      }
    } catch (error) {
      console.error("Error fetching place data:", error);
      Alert.alert("검색 오류", "장소를 검색하는 중 오류가 발생했습니다.");
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const newPlace = {
      id: UUID.v4(),
      name: "선택된 위치",
      location: { lat: latitude, lng: longitude },
    };
    setMarkerPosition({ latitude, longitude });
    setPlaceName(newPlace.name);
  };

  const handleAddNewPlace = () => {
    if (placeName.trim()) {
      const newPlace = {
        id: UUID.v4(),
        name: placeName.trim(),
      };
      setPlaceList((prev) => [...prev, newPlace]);
      setPlaceName("");
    }
  };

  const handleAddSelectedFilteredPlaces = () => {
    const selectedPlaces = filteredPlaceList.filter((place) =>
      selectedFilteredPlaces.includes(place.id)
    );
    setPlaceList((prev) => [...prev, ...selectedPlaces]);
    setSelectedFilteredPlaces([]);
  };

  const toggleFilteredPlaceSelection = (placeId) => {
    setSelectedFilteredPlaces((prev) =>
      prev.includes(placeId)
        ? prev.filter((p) => p !== placeId)
        : [...prev, placeId]
    );
  };

  const togglePlaceListSelection = (placeId) => {
    setSelectedPlacesList((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleRemoveSelectedFilteredPlaces = () => {
    const remainingFilteredPlaces = filteredPlaceList.filter(
      (place) => !selectedFilteredPlaces.includes(place.id)
    );
    setFilteredPlaceList(remainingFilteredPlaces);
    setSelectedFilteredPlaces([]);
  };

  const handleRemoveSelectedPlaces = () => {
    const remainingPlaces = placeList.filter(
      (place) => !selectedPlacesList.includes(place.id)
    );
    setPlaceList(remainingPlaces);
    setSelectedPlacesList([]);
  };

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "사진 선택을 위해 저장소 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = { id: UUID.v4(), uri: result.assets[0].uri };
        setSelectedImages((prevImages) => [...prevImages, newImage]);
      }
    } catch (error) {
      console.error("사진 선택 오류:", error);
    }
  };

  const handleRemoveImage = (imageId) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId)
    );
  };

  const handleSavePost = async () => {
    if (!postTitle || !postContent) {
      Alert.alert("알림", "제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("postTitle", postTitle);
      formData.append("postContent", postContent);
      formData.append("userNickName", user.userNickName);

      // 장소 목록을 문자열로 변환
      const placeListString =
        placeList.length > 0 ? placeList.map((place) => place.name).join(", ") : "";
      formData.append("placeList", placeListString);

      // 기존 이미지 URL들을 JSON 문자열로 변환
      const existingImageUrls = selectedImages
        .filter(image => image.uri.startsWith("/uploads/"))
        .map(image => image.uri);
      formData.append("existingImageUrls", JSON.stringify(existingImageUrls));

      // 새로 추가된 이미지들만 files로 추가
      const newImages = selectedImages.filter(image => !image.uri.startsWith("/uploads/"));
      newImages.forEach((image, index) => {
        const file = {
          uri: image.uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        };
        formData.append("files", file);
      });

      const response = await axios.put(
        `http://192.168.3.25:9090/api/posts/postEdit/${post.postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("성공", "게시물이 수정되었습니다.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("게시물 수정 오류:", error);
      Alert.alert("오류", "게시물을 수정하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.sectionLabel}>지도</Text>
            <MapView
              ref={mapRef}
              style={styles.map}
              region={regionRef.current}
              onPress={handleMapPress}
            >
              {markerPosition && (
                <Marker coordinate={markerPosition} title={placeName} />
              )}
            </MapView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={placeName}
                onChangeText={setPlaceName}
                placeholder="새 장소 추가"
              />
              <TouchableOpacity style={styles.inputAddButton} onPress={handleAddNewPlace}>
                <Text style={styles.addButtonText}>추가</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="장소 검색"
              />
              <TouchableOpacity style={styles.inputAddButton} onPress={handleSearch}>
                <Text style={styles.addButtonText}>검색</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionLabel}>검색된 장소 목록</Text>
            <FlatList
              data={filteredPlaceList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedFilteredPlaces.includes(item.id) && styles.selectedListItem,
                  ]}
                  onPress={() => toggleFilteredPlaceSelection(item.id)}
                >
                  <Text>{item.name}</Text>
                  {selectedFilteredPlaces.includes(item.id) && (
                    <Text style={styles.selectedText}>(선택됨)</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.addButton,
                  selectedFilteredPlaces.length === 0 && styles.disabledButton,
                ]}
                onPress={handleAddSelectedFilteredPlaces}
                disabled={selectedFilteredPlaces.length === 0}
              >
                <Text style={styles.addButtonText}>검색된 장소 추가</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  selectedFilteredPlaces.length === 0 && styles.disabledButton,
                ]}
                onPress={handleRemoveSelectedFilteredPlaces}
                disabled={selectedFilteredPlaces.length === 0}
              >
                <Text style={styles.removeButtonText}>선택된 장소 삭제</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          <>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionLabel}>전체 장소 목록</Text>
            <FlatList
              data={placeList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    selectedPlacesList.includes(item.id) && styles.selectedListItem,
                  ]}
                  onPress={() => togglePlaceListSelection(item.id)}
                >
                  <Text>{item.name}</Text>
                  {selectedPlacesList.includes(item.id) && (
                    <Text style={styles.selectedText}>(선택됨)</Text>
                  )}
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.removeButton,
                      selectedPlacesList.length === 0 && styles.disabledButton,
                    ]}
                    onPress={handleRemoveSelectedPlaces}
                    disabled={selectedPlacesList.length === 0}
                  >
                    <Text style={styles.removeButtonText}>선택된 장소 삭제</Text>
                  </TouchableOpacity>
                </View>
              }
            />
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionLabel}>글 수정</Text>
            <View style={styles.writeContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.titleInput]}
                  value={postTitle}
                  onChangeText={setPostTitle}
                  placeholder="제목을 입력하세요"
                />
              </View>
              <Text style={styles.userText}>작성자: {user.userNickName}</Text>
              <Text style={styles.listText}>
                여행지: {placeList.map((place) => place.name).join(" -> ")}
              </Text>

              <TouchableOpacity
                style={[styles.addButton, { alignSelf: "flex-end" }]}
                onPress={handleImagePick}
              >
                <Text style={styles.addButtonText}>사진 추가</Text>
              </TouchableOpacity>

              <View style={styles.imagesContainer}>
                <FlatList
                  data={selectedImages}
                  keyExtractor={(item) => item.id}
                  horizontal
                  renderItem={({ item }) => (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.uri }} style={styles.image} />
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleRemoveImage(item.id)}
                      >
                        <Text style={styles.deleteButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  contentContainerStyle={styles.imageListContent}
                />
              </View>

              <TextInput
                style={styles.textArea}
                value={postContent}
                onChangeText={setPostContent}
                placeholder="내용을 입력하세요"
                multiline
              />
              <View style={styles.saveButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSavePost}>
                  <Text style={styles.addButtonText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  map: {
    height: 300,
    marginBottom: 10,
    alignSelf: "center",
    width: "95%",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    maxWidth: 300,
    fontFamily: 'GCB_Bold', // 추가
  },
  titleInput: {
    flex: 1,
    maxWidth: "100%",
  },
  inputAddButton: {
    backgroundColor: "#08AA7A",
    padding: 15,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#08DD7A",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: 'GCB_Bold', // 추가
  },
  removeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  removeButtonText: {
    color: "#fff",
    fontFamily: 'GCB_Bold', // 추가
  },

  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedListItem: {
    backgroundColor: '#e6f2ff',
  },
  selectedText: {
    color: 'green',
    fontFamily: 'GCB_Bold', // 추가
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 15,  // 버튼들 사이 간격 조정
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: 'grey',
    marginVertical: 15,
    paddingTop: 10,
  },
  sectionLabel: {
    fontSize: 16,
    padding: 10,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontFamily: 'GCB_Bold', // 추가
  },
  writeContainer: {
    padding: 10,
    alignItems: 'center',
    fontFamily: 'GCB_Bold', // 추가
  },
  userText: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontFamily: 'GCB_Bold', // 추가
  },
  listText: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
    fontFamily: 'GCB_Bold', // 추가
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    height: "auto",
    textAlignVertical: "auto",
    marginBottom: 10,
    width: '100%',
    marginTop: 20,
    textAlign: "auto",
    fontFamily: 'GCB_Bold', // 추가
  },
  saveButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 100,
  },
  saveButton: {
    backgroundColor: "#08AA7A",
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  imageContainer: {
    margin: 5,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  deleteButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#FF6347",
    borderRadius: 15,
    width: 25,
    height: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontFamily: 'GCB_Bold', // 추가
  },
  imageListContent: {
    flexDirection: "row",
    justifyContent: "flex-start", // 왼쪽 정렬
    alignItems: "center",
  },
  imagesContainer: {
    width: "100%", // 목록이 너비를 차지하도록
    marginTop: 10,
  },
});

export default EditPost;
