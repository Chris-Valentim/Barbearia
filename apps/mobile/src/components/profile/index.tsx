import { UsefulPhone } from "@barba/contracts";
import { StyleSheet, View, Image, Text, Pressable } from "react-native";
import useUser from "@/src/data/hooks/useUser";
import React from "react";

const Profile = ({ navigation }: any) => {
  const { user, getOut } = useUser()

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/avatar.png')} />
      <Text style={styles.highlight}>
        Fala, {user?.name}!
      </Text>
      <Text style={styles.text}>
        E-mail: {user?.email.toLowerCase()}
      </Text>
      <Text style={styles.text}>
        Telefone: {UsefulPhone.format(user?.phone!)}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          getOut()
          navigation.replace('Cadastro')
        }}
      >
        <Text style={styles.textButton}>
          SAIR
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '45%',
    height: '45%',
    borderRadius: 9999,
    marginRight: 12,
  },
  highlight: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    margin: 5,
  },
  text: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '400',
    color: '#a9a9a9',
  },
  button: {
    margin: 30,
    width: '35%',
    height: 45,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  textButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

export default Profile
