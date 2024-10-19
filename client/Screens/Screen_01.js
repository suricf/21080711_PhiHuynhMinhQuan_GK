import React, { useState } from 'react';
import { TouchableOpacity, Image, View, Text, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Screen_01 = ({ navigation }) => {

    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleLogin = () => {
        // Gửi request POST tới server
        fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: inputEmail,
                password: inputPassword,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful') {
                    // Đăng nhập thành công, chuyển hướng sang màn hình khác
                    alert('Login successful');
                    // Thay đổi navigation theo yêu cầu của bạn
                    navigation.navigate('Screen_02');
                } else {
                    alert('Invalid email or password');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    return (
        <View style={{ padding: 20 }}>

            <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <Image
                    source={require('../assets/Data/icon.png')}
                    style={{ width: 100, height: 100 }}
                />
                <Text style={{ fontSize: 30, fontWeight: '600', marginVertical: 10 }}>Hello Again!</Text>
                <Text style={{ fontSize: 15, color: 'gray', textAlign: 'center' }}>Log into your account</Text>
            </View>

            <View style={{ padding: 20 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderRadius: 5, padding: 10 }}>
                    <Image source={require("../assets/Data/Vector.png")} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Enter your password"

                        style={{ flex: 1, outline: 'none' }}
                        value={inputEmail}
                        onChangeText={setInputEmail}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderRadius: 5, padding: 10 }}>
                    <Image source={require("../assets/Data/lock.png")} style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Enter your password"
                        secureTextEntry={!isPasswordVisible}
                        style={{ flex: 1, outline: 'none' }}
                        value={inputPassword}
                        onChangeText={setInputPassword}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                        <Image
                            source={isPasswordVisible
                                ? require("../assets/Data/eye.png")
                                : require("../assets/Data/eyebrow.png")}
                            style={{}}
                        />
                    </TouchableOpacity>
                </View>


                <View>
                    <TouchableOpacity
                        style={{ width: '94%', marginLeft: 16, marginTop: 11, backgroundColor: 'rgb(34, 200, 247)', paddingVertical: 11, borderRadius: 20 }}
                        onPress={handleLogin}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Screen_01;
