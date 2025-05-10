import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import { validatePassword } from "../utils/common";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const MyPage = () => {
  // 사용자 컨텍스트와 상태 관리
  const { user, logoutUser, dispatch } = useContext(UserContext);

  // 닉네임 변경 관련 상태
  const [newNickname, setNewNickname] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // 비밀번호 변경 관련 상태
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  // 계정 삭제 관련 상태
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // 모달 애니메이션을 위한 Animated 값 초기화
  const slideAnim = useState(new Animated.Value(0))[0];

  // 네비게이션 훅 사용
  const navigation = useNavigation();

  // 모달 내용 슬라이딩 애니메이션 토글 함수
  const toggleContent = (isVisible) => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 1 : 0,  // 모달 표시/숨김에 따른 애니메이션 값 조정
      useNativeDriver: true,
    }).start();
  };

  // 로그아웃 처리 함수
  const _handleLogOut = async () => {
    await AsyncStorage.clear(); // 저장된 사용자 데이터 초기화
    logoutUser(); // 사용자 로그아웃 처리
    alert('로그아웃 되었습니다.');
  }

  // 모달 상태 변경 시 애니메이션 업데이트
  useEffect(() => {
    toggleContent(modalVisible);
  }, [modalVisible]);

  // 닉네임 저장 처리 함수
  const handleSaveNickname = async () => {
    try {
      // 서버에 새 닉네임 업데이트 요청
      const newUserNickname = { userNickName: newNickname };
      const response = await axios.patch(
        `http://192.168.3.25:9090/travel/userNickNameEdit/${user.id}`,
        newUserNickname,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        // 성공 시 사용자 상태 및 로컬 저장소 업데이트
        const updatedUser = { ...user, userNickName: newNickname };
        dispatch(updatedUser);
      } else {
        console.log("닉네임 변경 실패...");
      }
    } catch (error) {
      console.error("닉네임 변경 실패: ", error);
      alert("닉네임 변경에 실패했습니다.");
    } finally {
      setModalVisible(false); // 모달 닫기
    }
  };

  // 비밀번호 변경 처리 함수
  const handleChangePassword = async () => {

    // 비밀번호 유효성 검사
    if (!validatePassword(newPassword)) {
      setPasswordError("새 비밀번호는 최소 8자 이상이고 특수문자를 포함해야 합니다.");
      return;
    }

    // 새 비밀번호가 확인 비밀번호와 일치하는지 확인
    if (newPassword !== confirmNewPassword) {
      setPasswordError('');
      setPasswordConfirmError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 서버에 비밀번호 변경 요청
      const response = await axios.patch(
        `http://192.168.3.25:9090/travel/userPasswordEdit/${user.id}`,
        {
          userPassword: currentPassword, // 현재 비밀번호
          newPassword: newPassword,     // 새 비밀번호
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
        }
      );

      // 비밀번호 변경 성공 처리
      if (response.status === 200 && response.data === true) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        setPasswordModalVisible(false);
      } else {
        alert("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 변경 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 계정 삭제 처리 함수
  const handleDeleteAccount = async () => {
    try {
      // 비밀번호 입력 확인
      if (!currentPassword) {
        alert("비밀번호를 입력해주세요.");
        return;
      }

      // 서버에 계정 삭제 요청
      const response = await axios.delete(
        `http://192.168.3.25:9090/travel/withdraw/${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`,
          },
          data: {
            userPassword: currentPassword,
          },
        }
      );

      // 계정 삭제 성공 처리
      if (response.status === 200 && response.data === true) {
        alert("계정이 성공적으로 삭제되었습니다.");
        await AsyncStorage.clear(); // 로컬 저장소 초기화
        logoutUser(); // 로그아웃 처리
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      } else {
        alert("계정 삭제에 실패했습니다. 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("계정 삭제 중 오류 발생:", error);
      alert("계정 삭제 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setDeleteModalVisible(false);
    }
  };

  // 프로필 이미지 선택 및 업로드 함수
  const handlePickImage = async () => {
    // 카메라 및 미디어 라이브러리 권한 확인
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== "granted") {
      alert("카메라 접근 권한이 필요합니다.");
      return;
    }
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaLibraryPermission.status !== "granted") {
      alert("미디어 라이브러리 접근 권한이 필요합니다.");
      return;
    }

    // 이미지 선택 
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;

      // 이미지 업로드를 위한 FormData 생성
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImage,
        name: selectedImage.split('/').pop(),
        type: 'image/*',
      });

      try {
        // 서버에 프로필 이미지 업로드 요청
        const response = await axios.patch(
          `http://192.168.3.25:9090/travel/userProfileImageEdit/${user.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${user.token}`,
            },
          }
        );
        // 프로필 이미지 업데이트 성공 처리
        if (response.status === 200) {
          const updatedUser = {
            ...user,
            userProfileImage: `http://192.168.3.25:9090${response.data.userProfileImage}`
          };
          dispatch(updatedUser);
          AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        } else {
          alert("프로필 사진 업데이트 실패");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("이미지 업로드 실패");
      }

    }
  };
  //프로필 이미지 삭제
  const handleProfileImageDelete = async () => {

    try {
      const response = await axios.patch(
        `http://192.168.3.25:9090/travel/userProfileImageDelete/${user.id}`, {},
        {
          headers: {
            "Authorization": `Bearer ${user.token}`,
          }
        })

      if (response.data === true) {
        const updatedUser = {
          ...user,
          userProfileImage: null
        };
        dispatch(updatedUser);
        AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        alert("프로필 이미지가 삭제되었습니다.")
      } else {
        alert("프로필 이미지 삭제 실패")
      }
    } catch (error) {
      console.error("프로필 이미지 삭제 에러: ", error);
      alert("프로필 이미지 삭제에 실패했습니다.")
    }
  }

  // 마이페이지 렌더링
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 헤더 섹션: 프로필 정보와 이미지 표시 */}
      <View style={styles.headerContainer}>
        {/* 프로필 정보 및 이미지 수정 기능 */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.userNickName}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.editProfileText}>닉네임 변경</Text>
          </TouchableOpacity>
        </View>

        {/* 프로필 이미지 컨테이너 */}
        <View style={styles.profileImageContainer}>
          <Image
            source={
              user.userProfileImage && user.userProfileImage !== 'http://192.168.3.25:9090null'
                ? { uri: user.userProfileImage }
                : require("../../assets/profile.jpg")
            }
            style={styles.profileImage}
          />
          {/* 프로필 이미지 수정/삭제 버튼 */}
          <TouchableOpacity
            style={styles.editIcon}
            onPress={handlePickImage}
          >
            <MaterialIcons name="photo-camera" size={20} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteIcon}
            onPress={handleProfileImageDelete}
          >
            <MaterialIcons name="delete" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 계정 설정 메뉴 리스트 */}
      <View style={styles.listContainer}>
        {/* 각 메뉴 항목: 계정 관리, 비밀번호 변경, My Post, 로그아웃, 계정 삭제 */}
        <TouchableOpacity style={styles.listItem}
          onPress={() => console.log(user)}
        >
          <Text style={styles.listItemText}>계정 관리</Text>
          <Text style={styles.idText}>
            {/* user.userName이 있으면 이름 출력, 없으면 빈 문자열 */}
            {user?.userName ? `${user.userName} / ` : ""}
            {/* user.userId가 있으면 아이디 출력, 없으면 "ID 정보 없음" 출력 */}
            {user?.userId || "ID 정보 없음"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.listItemText}>비밀번호 변경</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("MyPost")}
        >
          <Text style={styles.listItemText}>내 기록 보기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={_handleLogOut}
        >
          <Text style={styles.listItemText}>로그아웃</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.listItem}
          onPress={() => setDeleteModalVisible(true)}
        >
          <Text style={styles.listItemText}>계정 삭제</Text>
        </TouchableOpacity>
      </View>

      {/* 모달들: 닉네임 변경, 비밀번호 변경, 계정 삭제 확인 */}
      {/* 각 모달은 슬라이딩 애니메이션과 함께 표시됨 */}
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {/* 닉네임 변경 모달 */}
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>닉네임 변경</Text>
            <TextInput
              style={styles.nicknameInput}
              value={newNickname}
              onChangeText={setNewNickname}
              placeholder="새 닉네임 입력"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveNickname}>
                <Text style={styles.saveButton}>저장</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      {/* 비밀번호 변경 모달 */}
      <Modal
        visible={passwordModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>비밀번호 변경</Text>
            {/* 현재 비밀번호, 새 비밀번호, 새 비밀번호 확인 입력란 */}
            <TextInput
              style={styles.nicknameInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="현재 비밀번호"
              secureTextEntry
            />
            <TextInput
              style={styles.nicknameInput}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="새로운 비밀번호"
              secureTextEntry
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <TextInput
              style={styles.nicknameInput}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="새로운 비밀번호 확인"
              secureTextEntry
            />
            {passwordConfirmError ? <Text style={styles.errorText}>{passwordConfirmError}</Text> : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Text style={styles.cancelButton}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleChangePassword}>
                <Text style={styles.saveButton}>변경</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* 계정 삭제 확인 모달 */}
      <Modal
        visible={deleteModalVisible}
        animationType="none"
        transparent
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>계정 삭제</Text>
            {/* 계정 삭제 경고 문구 */}
            <Text style={styles.confirmText}>계정을 삭제하려면 {"\n"} 비밀번호를 입력하세요.</Text>
            <TextInput
              style={styles.nicknameInput}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="비밀번호"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelButton}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={styles.deleteButton}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// 스타일 정의: 컴포넌트의 모든 UI 요소에 대한 스타일 설정
const styles = StyleSheet.create({
  // 컨테이너 스타일: 전체 화면 레이아웃 설정
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  // 헤더 컨테이너 스타일: 프로필 영역 레이아웃
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  // 프로필 정보 스타일: 닉네임과 편집 텍스트 
  profileInfo: {
    flex: 1,
    alignItems: "center",
    fontFamily: 'GCB_Bold', // 추가
  },

  // 프로필 이름 스타일
  profileName: {
    fontSize: 24,
    marginBottom: 4,
    fontFamily: 'GCB_Bold', // 추가
  },

  // 프로필 편집 텍스트 스타일
  editProfileText: {
    fontSize: 14,
    color: "#CFA636",
    fontFamily: 'GCB_Bold', // 추가
  },

  // 프로필 이미지 컨테이너 스타일
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    alignSelf: "center",
  },

  // 프로필 이미지 스타일
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  // 이미지 편집 아이콘 스타일
  editIcon: {
    position: "absolute",
    backgroundColor: "#f0f0f0",
    bottom: -20,
    left: 15,
    borderRadius: 15,
    padding: 5,
  },

  // 이미지 삭제 아이콘 스타일
  deleteIcon: {
    position: "absolute",
    backgroundColor: "#f0f0f0",
    bottom: -20,
    right: 15,
    borderRadius: 15,
    padding: 5,
  },

  // 메뉴 리스트 컨테이너 스타일
  listContainer: {
    marginTop: 16,
  },

  // 개별 메뉴 아이템 스타일
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  // 메뉴 아이템 텍스트 스타일
  listItemText: {
    fontSize: 16,
    fontFamily: 'GCB_Bold', // 추가
  },

  slideContent: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  nicknameInput: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
    fontFamily: 'GCB_Bold', // 추가
  },

  // 모달 배경 스타일
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  // 모달 컨테이너 스타일
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 8,
    // alignItems: "center",
  },

  // 모달 제목 스타일
  modalTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontFamily: 'GCB_Bold', // 추가
  },

  // 모달 확인 텍스트 스타일
  confirmText: {
    fontSize: 16,
    color: "red",
    marginBottom: 24,
    textAlign: "center",
    fontFamily: 'GCB_Bold', // 추가
  },

  // 모달 버튼 컨테이너 스타일
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  // 취소 버튼 스타일
  cancelButton: {
    fontSize: 16,
    color: "#08D37A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#08D37A",
    marginRight: 20,
    fontFamily: 'GCB_Bold', // 추가
  },
  saveButton: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#08D37A",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#08D37A",
    borderRadius: 5,
    fontFamily: 'GCB_Bold', // 추가
  },
  // 삭제 버튼 스타일
  deleteButton: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#FF5C5C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#FF5C5C",
    borderRadius: 5,
    fontFamily: 'GCB_Bold', // 추가
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'left',
    fontFamily: 'GCB_Bold', // 추가

  },
});

export default MyPage;