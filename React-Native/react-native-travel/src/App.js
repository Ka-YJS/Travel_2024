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
import { ListProvider } from "./contexts/ListContext";
import { PostProvider } from "./contexts/PostContext";
import { ImageProvider } from "./contexts/ImageContext";
import { CopyListProvider } from "./contexts/CopyListContext";

SplashScreen.preventAutoHideAsync();

const cacheResources = async () => {
    const images = [require("../assets/splash.png")];
    const fonts = []; // 필요한 폰트 추가

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
        <PlaceProvider>
            <ListProvider>
                <CopyListProvider>
                    <PostProvider>
                        <ImageProvider>
                            <UserProvider>{/* UserProvider로 Navigation 감싸기 */}
                                <ThemeProvider theme={theme}>
                                    <StatusBar barStyle="dark-content" />
                                    <Navigation />
                                </ThemeProvider>
                            </UserProvider>
                        </ImageProvider>
                    </PostProvider>
                </CopyListProvider>
            </ListProvider>
        </PlaceProvider>

    );
};

export default App;
