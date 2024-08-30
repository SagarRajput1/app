import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export default function OTPVerificationScreen({ navigation }) {
    const [otp1, setOtp1] = React.useState();
    const [otp2, setOtp2] = React.useState();
    const [otp3, setOtp3] = React.useState();
    const [otp4, setOtp4] = React.useState();
    const verifyOTP = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            const response = await axios.post("http://192.168.19.224:5000/verify-otp", {
                email,
                otp: otp1 + otp2 + otp3 + otp4
            });
            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                navigation.navigate('SignIn');
            } else {
                Alert.alert('Error', response.data.message);
            }
        }
        catch (error) {
            console.log(error);
            Alert.alert('Error', error.response.data.message);
        }
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={false}>
            <View className="flex-1 bg-[#F25A3C] justify-center items-center">
                <View className="bg-white p-8 rounded-lg w-4/5">
                    <Text className="text-2xl font-semibold text-center">OTP</Text>
                    <Text className="text-center text-gray-400 mb-4">We sent you OTP to verify</Text>

                    <Text className="text-gray-600 mb-2">Enter OTP :</Text>
                    <View className="flex-row justify-between mb-4">
                        <TextInput
                            style={{ textAlign: 'center' }}
                            className="bg-gray-100 p-4 rounded-lg w-1/5"
                            keyboardType="numeric"
                            maxLength={1}
                            onChangeText={text => setOtp1(text)}
                        />
                        <TextInput
                            style={{ textAlign: 'center' }}
                            className="bg-gray-100 p-4 rounded-lg w-1/5"
                            keyboardType="numeric"
                            maxLength={1}
                            onChangeText={text => setOtp2(text)}
                        />
                        <TextInput
                            style={{ textAlign: 'center' }}
                            className="bg-gray-100 p-4 rounded-lg w-1/5"
                            keyboardType="numeric"
                            maxLength={1}
                            onChangeText={text => setOtp3(text)}
                        />
                        <TextInput
                            style={{ textAlign: 'center' }}
                            className="bg-gray-100 p-4 rounded-lg w-1/5"
                            keyboardType="numeric"
                            maxLength={1}
                            onChangeText={text => setOtp4(text)}
                        />
                    </View>

                    <TouchableOpacity>
                        <Text className="text-center text-gray-500 mb-4">
                            Didn’t receive Email,
                            <Text className="text-[#F25A3C] font-semibold">send again</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={verifyOTP} className="bg-[#F25A3C] p-4 rounded-lg">
                        <Text className="text-white text-center font-semibold">Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
NativeWindStyleSheet.create({
    // Add any custom styles if needed
});
