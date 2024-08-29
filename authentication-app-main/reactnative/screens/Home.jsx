import { View, Text } from 'react-native'
import React from 'react'
import { NativeWindStyleSheet } from 'nativewind';
// 192.168.100.21
export default function Home() {
    return (
        <View className="flex-1 bg-[#F25A3C] justify-center items-center">
            <Text className="text-2xl text-white font-semibold">Logged In Successfully</Text>
        </View>
    )
}
NativeWindStyleSheet.create({
    // Add any custom styles if needed
});