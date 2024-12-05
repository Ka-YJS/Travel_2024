import React, { useContext, useState } from "react";
import { GoogleMap, Marker, InfoWindow, Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import Write from "./Write";
import TopIcon from "../TopIcon/TopIcon";
import config from "../Apikey";
import { PlaceContext } from "../context/PlaceContext";
import { Button } from "@mui/material";
import { isWriteContext } from "../context/isWriteContext";
import PostEdit from "./PostEdit";


const Map = () => {
    const { placeList, setPlaceList } = useContext(PlaceContext);
    const {isWrite, setIsWrite} = useContext(isWriteContext);

    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 서울 중심 좌표
    const [markerPosition, setMarkerPosition] = useState(null); // 마커 위치
    const [placeName, setPlaceName] = useState(""); // 현재 검색된 장소 이름
    const [searchBox, setSearchBox] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커
    const [photoUrl, setPhotoUrl] = useState(null); // 장소 사진 URL
    const [list, setList] = useState([]);

    // Google Maps API 로드
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: config.MAP_API_KEY,
        libraries: ["places"], // 사용하려는 라이브러리 추가
    });

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    if (loadError) {
        return <div>Google Maps API 로드 중 오류가 발생했습니다.</div>;
    }

    // 지도 클릭 이벤트
    const handleMapClick = async (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        setPlaceName("선택된 위치"); // 클릭한 경우 장소 이름을 기본값으로 설정
        setPhotoUrl(null); // 지도 클릭 시 사진 초기화
        setSelectedMarker({ position: { lat, lng } });
    };

    // 검색창 설정
    const handleSearchBoxLoad = (autocomplete) => {
        setSearchBox(autocomplete);
    };

    // 검색 이벤트
    const handlePlaceChanged = async () => {
        if (searchBox !== null) {
            const place = searchBox.getPlace();
            if (place.geometry) {
                const { location } = place.geometry;
                setCenter({ lat: location.lat(), lng: location.lng() });
                setMarkerPosition({ lat: location.lat(), lng: location.lng() });
                setPlaceName(place.name || "알 수 없는 장소"); // 장소 이름 설정
                if (place.photos && place.photos.length > 0) {
                    const photoReference = place.photos[0].photo_reference;
                    const photoUrl = getPhotoUrl(photoReference);
                    setPhotoUrl(photoUrl);
                } else {
                    setPhotoUrl(null); // 사진이 없는 경우 처리
                }
                setSelectedMarker({ position: { lat: location.lat(), lng: location.lng() } });
            }
        }
    };

    // Place Photo API를 통해 사진 URL 가져오기
    const getPhotoUrl = (photoReference) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${config.MAP_API_KEY}`;
    };

    // To-Do List에 장소 추가
    const handleAddToTodoList = () => {
        if (placeName) {
            setPlaceList((prevList) => [...prevList, placeName]);
            console.log(placeList)
            setPlaceName(""); // 입력 필드 초기화
        }
    };

    // To-Do List에서 항목 삭제
    const handleDeleteFromTodoList = (index) => {
        setPlaceList((prevList) => prevList.filter((_, i) => i !== index));
        setList((prevList) => prevList.filter((_, i) => i !== index));
    };

    return (
        <div style={{ display: "flex", width: "100vw", minHeight: "100vh", flexDirection: "row" }}>
            {/* 지도 영역 */}
            <TopIcon />
            <div
                style={{
                    flex: 1,
                    minHeight: "111vh",
                    borderRight: "1px solid #ddd",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div style={{ flex: 1, padding: "10px", backgroundColor: "#fff", zIndex: 1000 }}>
                    <Autocomplete onLoad={handleSearchBoxLoad} onPlaceChanged={handlePlaceChanged}>
                        <input
                            type="text"
                            placeholder="장소 또는 주소 검색"
                            style={{
                                width: "100%",
                                height: "40px",
                                padding: "10px",
                                marginBottom: "10px",
                                boxSizing: "border-box",
                                borderRadius: "5px",
                                border: "1px solid #ddd",
                            }}
                        />
                    </Autocomplete>
                    {placeName && (
                        <div
                            style={{
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                marginBottom: "10px",
                            }}
                        >
                            <strong>장소 이름:</strong> {placeName}
                            <button
                                onClick={handleAddToTodoList}
                                style={{
                                    marginLeft: "10px",
                                    padding: "5px 10px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                추가
                            </button>
                        </div>
                    )}
                </div>
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                    }}
                    center={center}
                    zoom={14}
                    onClick={handleMapClick}
                    onLoad={(map) => setMap(map)}
                >
                    {markerPosition && (
                        <Marker
                            position={markerPosition}
                            onClick={() =>
                                setSelectedMarker({
                                    position: markerPosition,
                                })
                            }
                        />
                    )}

                    {/* InfoWindow 표시 */}
                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.position}
                            onCloseClick={() => setSelectedMarker(null)} // 닫기 버튼 클릭 시 InfoWindow 닫기
                        >
                            <div>
                                <h3>{placeName}</h3>
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt="장소 사진"
                                        style={{ width: "100%", borderRadius: "5px" }}
                                    />
                                ) : (
                                    <p>사진이 없습니다.</p>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>

                {/* 여행지 리스트 */}
                <div style={{ flex: 1, maxHeight: "50vh", marginTop: "20px" }}>
                    <h3
                        style={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        여행지 List
                        <Button onClick={() => setList([...placeList])}>추가하기</Button>
                    </h3>
                    <ul>
                        {placeList.map((item, index) => (
                            <li
                                title="-"
                                key={index}
                                style={{
                                    marginBottom: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                
                                }}
                            >
                                {item}
                                <button
                                    onClick={() => handleDeleteFromTodoList(index)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "red",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 글쓰기 + To-Do List 영역 */}
            <div style={{ flex: 1, padding: "20px", backgroundColor: "#f9f9f9" }}>
                {isWrite ? <Write List={list} /> : <PostEdit/>}
                
            </div>
        </div>
    );
};

export default Map;
