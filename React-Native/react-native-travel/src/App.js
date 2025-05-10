import React, { useEffect, useState } from "react";
import { StatusBar, Image } from "react-native";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import Navigation from "./navigations";
import { UserProvider } from "./contexts/UserContext"; // UserProvider 가져오기
import { PlaceProvider } from "./contexts/PlaceContext";
import { PostProvider } from "./contexts/PostContext";
import { ImageProvider } from "./contexts/ImageContext";
import { setCustomText } from 'react-native-global-props';

SplashScreen.preventAutoHideAsync();

const cacheResources = async () => {
    const images = [require("../assets/splash.png")];
    const fonts = [
        { GCB_Bold: require("../assets/fonts/GCB_Bold.ttf")},
        { GCB: require("../assets/fonts/GCB.ttf")}
    ];

    const cacheImages = images.map((image) =>
        typeof image === "string" ? Image.prefetch(image) : Asset.fromModule(image).downloadAsync()
    );
    const cacheFonts = fonts.map((font) => Font.loadAsync(font));

    await Promise.all([...cacheImages, ...cacheFonts]);
};

const App = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const prepareResources = async () => {
            try {
                await cacheResources();
                console.log("폰트 로드 완료");
                setCustomText({
                    style: {
                        fontFamily: 'GCB_Bold',
                    },
                });
            } catch (error) {
                console.warn("Error loading resources:", error);
            } finally {
                setIsReady(true);
            }
        };

        prepareResources();
    }, []);

    useEffect(() => {
        if (isReady) {
            SplashScreen.hideAsync();
        }
    }, [isReady]);

    if (!isReady) {
        return null; // 준비되지 않았을 때 빈 화면
    }

    return (
        <ThemeProvider theme={theme}>
            <UserProvider>
                <PlaceProvider>
                    <PostProvider>
                        <ImageProvider>
                            <StatusBar barStyle="dark-content" />
                            <Navigation />
                        </ImageProvider>
                    </PostProvider>
                </PlaceProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

export default App;
