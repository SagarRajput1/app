import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NativeWindStyleSheet } from 'nativewind';
import axios from 'axios';

export default function SignInScreen({ navigation }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const signIn = async () => {
        try {
            const response = await axios.post('http://192.168.19.224:5000/signin', {
                email,
                password
            });
            if (response.data.success) {
                Alert.alert('Success', response.data.message);
                navigation.navigate('Home');
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
            <View className="flex-1 bg-[#F5F0EE] justify-center items-center">
                <View className="bg-white p-8 rounded-lg w-4/5">
                    <Text className="text-2xl font-semibold text-center">Sign In</Text>
                    <Text className="text-center text-gray-400 mb-4">Before continue, please Sign In first!</Text>
                    <Text className="mb-1">Email</Text>
                    <TextInput
                        placeholder="hello@example.com"
                        placeholderTextColor="#d3d3d3"
                        className="bg-gray-100 p-2 rounded-lg mb-4"
                        onChangeText={text => setEmail(text)}
                    />
                    <Text className="mb-1">Password</Text>
                    <View className="bg-gray-100 p-2 rounded-lg mb-4 flex-row items-center">
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#d3d3d3"
                            secureTextEntry={true}
                            className="flex-1"
                            onChangeText={text => setPassword(text)}
                        />
                        <Feather name="eye-off" size={20} color="#d3d3d3" />
                    </View>

                    <View className="flex-row items-center mb-4">
                        <Feather name="square" size={20} color="black" />
                        <Text className="ml-2 text-gray-600">Remember Me</Text>
                    </View>

                    <TouchableOpacity onPress={signIn} className="bg-[#F25A3C] p-4 rounded-lg">
                        <Text className="text-white text-center font-semibold">Sign in</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="mt-4">
                        <Text className="text-center text-gray-400">Forgot Password ?</Text>
                    </TouchableOpacity>

                </View>
                <View className="flex-row items-center justify-center my-6 w-[80%]">
                    <View className="h-[1px] bg-black flex-1"></View>
                    <Text className="text-gray-400 mx-4">Or</Text>
                    <View className="h-[1px] bg-black flex-1"></View>
                </View>

                <Text className="text-center text-black font-bold mb-4">Connect with</Text>
                <View className="flex-row justify-center space-x-4">
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-[#F25A3C] p-3 rounded-lg">
                            <MaterialCommunityIcons name="phone" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-center text-black text-sm">Phone</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-[#F25A3C] p-3 rounded-lg">
                            <MaterialCommunityIcons name="email" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-center text-black text-sm">E-mail</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => navigation.navigate("SignIn")} className="bg-[#F25A3C] p-3 rounded-lg">
                            <MaterialCommunityIcons name="dots-horizontal" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-center text-black text-sm">Other</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
NativeWindStyleSheet.create({
    // Add any custom styles if needed
});
