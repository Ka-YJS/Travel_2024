import React, { useState, useEffect,useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, Modal, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyPage = () => {
  
  const {user,logoutUser,dispatch} = useContext(UserContext);
  const [nickname, setNickname] = useState(`${user.userNickName}`);
  const [newNickname, setNewNickname] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // 비밀번호 변경 관련 상태
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // 계정 삭제 확인 모달 관련 상태
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // 슬라이딩 애니메이션을 위한 Animated 값
  const slideAnim = useState(new Animated.Value(0))[0];  // 처음에는 content가 보이게 0으로 설정

  const navigation = useNavigation(); // 네비게이션 객체 사용

  // 애니메이션 처리
  const toggleContent = (isVisible) => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 1 : 0,  // 버튼 클릭 시 내용이 나올 때 1로, 사라질 때 0으로
      useNativeDriver: true,
    }).start();
  };

  //로그아웃
  const _handleLogOut = () => {
    AsyncStorage.clear();
    logoutUser(); // 로그아웃 호출
    alert('로그아웃 되었습니다.') // 로그아웃 후 Login 화면으로 이동
}
  useEffect(() => {
    // 애니메이션을 modalVisible 상태에 맞게 업데이트
    toggleContent(modalVisible);
  }, [modalVisible]);


  const handleSaveNickname = async () => {
    try {
      const newUserNickname = { userNickName: newNickname };
  
      const response = await axios.patch(`http://192.168.3.24:9090/travel/userNickNameEdit/${user.id}`, newUserNickname, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
      });

      if (response.status === 200) {
        const updatedUser = { ...user, userNickName: newNickname };
        dispatch(updatedUser); // 닉네임 변경 후 dispatch로 상태 업데이트
        setNickname(newNickname); // 로컬 상태도 업데이트
      } else {
        console.log("닉네임 변경 실패...");
      }
    } catch (error) {
      console.error("닉네임 변경 실패: ", error);
      alert("닉네임 변경에 실패했습니다.");
    } finally {
      setModalVisible(false); // 닫기
    }
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
    } else {
      alert("비밀번호가 변경되었습니다.");
      setPasswordModalVisible(false);
    }
  };

  const handleDeleteAccount = () => {
    alert("계정이 삭제되었습니다.");
        navigation.reset({
          index: 0,

    routes: [{ name: "Login" }],
        });
      };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{nickname}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.editProfileText}>닉네임 변경</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileImageContainer}>
          <Image
            source={require("../../assets/profile.png")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} onPress={() => alert("수정 완료")}>
            <MaterialIcons name="edit" size={20} color="orange" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteIcon} onPress={() => alert("삭제 완료")}>
            <MaterialIcons name="delete" size={20} color="orange" />
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <View style={styles.listContainer}>
      {/* 계정 관리 */}
      <TouchableOpacity style={styles.listItem}>
        <Text style={styles.listItemText}>계정 관리</Text>
      </TouchableOpacity>

        {/* 비밀번호 변경 */}
        <TouchableOpacity
          style={styles.listItem} 
          onPress={() => setPasswordModalVisible(true)}
        >
          <Text style={styles.listItemText}>비밀번호 변경</Text>
        </TouchableOpacity>

        {/* 내 POST */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate("MyPost")}
        >
          <Text style={styles.listItemText}>My Post</Text>
        </TouchableOpacity>

        {/* 로그아웃 */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={_handleLogOut}
        >
          <Text style={styles.listItemText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 계정 삭제 */}
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => setDeleteModalVisible(true)} // 계정 삭제 확인 모달을 표시
        >
          <Text style={styles.listItemText}>계정 삭제</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
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

      <Modal
        visible={passwordModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>비밀번호 변경</Text>
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
            <TextInput
              style={styles.nicknameInput}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="새로운 비밀번호 확인"
              secureTextEntry
            />
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
      <Modal visible={deleteModalVisible} animationType="none" transparent onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={styles.modalBackground}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.modalTitle}>계정 삭제</Text>
            <Text style={styles.confirmText}>정말로 계정을 삭제하시겠습니까?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)}>
                <Text style={styles.cancelButton}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount}>
                <Text style={styles.saveButton}>삭제</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  iconButton: {
    position: "absolute",
    left: 0,
    padding: 8,
  },

  closeButton: {
    fontSize: 18,
    fontWeight: "bold",
  },

  profileInfo: {
    flex: 1,
    alignItems: "center",
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  
  editProfileText: {
    fontSize: 14,
    color: "#007BFF",
  },
  
  profileImageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    alignSelf: "center",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  editIcon: {
    position: "absolute",
    bottom: 2,
    left: 10,
    borderRadius: 15,
    padding: 5,
  },
  
  deleteIcon: {
    position: "absolute",
    bottom: 2,
    right: 10,
    borderRadius: 15,
    padding: 5,
  },

  listContainer: {
    marginTop: 16,
  },
  
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,    
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  
  listItemText: {
    fontSize: 16,
    fontWeight: "bold",
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
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 8,
    alignItems: "center",
  },  

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  confirmText: {
    fontSize: 16,
    color: "red",
    marginBottom: 24,
    textAlign: "center",
  },
  
  modalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  
  cancelButton: {
    fontSize: 16,
    color: "#007BFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#007BFF",
    marginRight: 20,
  },

  saveButton: {
    fontSize: 16,
    color: "#fff",
    backgroundColor: "#FF5C5C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 5,
  },
});

export default MyPage;