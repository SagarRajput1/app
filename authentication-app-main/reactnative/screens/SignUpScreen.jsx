import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ProgressBarAndroid, ProgressViewIOS, Platform } from 'react-native';
import zxcvbn from 'zxcvbn';
import { NativeWindStyleSheet } from 'nativewind';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordStrengthText, setPasswordStrengthText] = useState('');

    const signUp = async () => {
        try {
            const response = await axios.post('http://192.168.19.224:5000/signup', {
                email,
                username,
                password
            });
            if (response.data.success) {
                await AsyncStorage.setItem('email', email);
                Alert.alert('Success', response.data.message);
                navigation.navigate('OTPVerification');
            } else {
                Alert.alert('Error', response.data.message);
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.response.data.message);
        }
    };

    const checkPasswordStrength = (password) => {
        const strength = zxcvbn(password);
        setPasswordStrength(strength.score / 4); // Normalize score to a range between 0 and 1

        let strengthText = '';
        switch (strength.score) {
            case 0:
                strengthText = 'Very Weak';
                break;
            case 1:
                strengthText = 'Weak';
                break;
            case 2:
                strengthText = 'Fair';
                break;
            case 3:
                strengthText = 'Good';
                break;
            case 4:
                strengthText = 'Strong';
                break;
            default:
                strengthText = '';
        }
        setPasswordStrengthText(strengthText);
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}>
            <View className="flex-1 bg-[#F25A3C] justify-center items-center">
                <View className="bg-white p-8 rounded-lg w-4/5">
                    <Text className="text-2xl font-semibold text-center">Sign Up</Text>
                    <Text className="text-center text-gray-400 mb-4">Before continue, please Sign In first!</Text>
                    <Text className="mb-1">Email</Text>
                    <TextInput
                        placeholder="hello@example.com"
                        placeholderTextColor="#d3d3d3"
                        className="bg-gray-100 p-2 rounded-lg mb-4"
                        onChangeText={text => setEmail(text)}
                    />
                    <Text className="mb-1">Username</Text>
                    <TextInput
                        placeholder="Student"
                        placeholderTextColor="#d3d3d3"
                        className="bg-gray-100 p-2 rounded-lg mb-4"
                        onChangeText={text => setUsername(text)}
                    />
                    <Text className="mb-1">Password</Text>
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#d3d3d3"
                        secureTextEntry={true}
                        className="bg-gray-100 p-2 rounded-lg mb-4"
                        onChangeText={text => {
                            setPassword(text);
                            checkPasswordStrength(text);
                        }}
                    />
                    <View className="mb-4">
                        <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={passwordStrength}
                            color={passwordStrength >= 0.75 ? '#4CAF50' : passwordStrength >= 0.5 ? '#FFC107' : '#F44336'}
                        />

                        <Text className="text-center mt-2">{passwordStrengthText}</Text>
                    </View>
                    <TouchableOpacity onPress={signUp} className="bg-[#F25A3C] p-4 rounded-lg">
                        <Text className="text-white text-center font-semibold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-center my-6 w-[80%]">
                    <View className="h-[1px] bg-white flex-1"></View>
                    <Text className="text-white mx-4">Or</Text>
                    <View className="h-[1px] bg-white flex-1"></View>
                </View>
                <Text className="text-center text-white mb-4">Connect with</Text>
                <View className="flex-row justify-center space-x-4">
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-white p-3 rounded-lg">
                            <MaterialCommunityIcons name="phone" size={24} color="#F25A3C" />
                        </TouchableOpacity>
                        <Text className="text-center text-white text-sm">Phone</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-white p-3 rounded-lg">
                            <MaterialCommunityIcons name="email" size={24} color="#F25A3C" />
                        </TouchableOpacity>
                        <Text className="text-center text-white text-sm">E-mail</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-white p-3 rounded-lg">
                            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#F25A3C" />
                        </TouchableOpacity>
                        <Text className="text-center text-white text-sm">Other</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

NativeWindStyleSheet.create({
    // Add any custom styles if needed
});
