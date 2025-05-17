import { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TextInput // Adicionamos TextInput diretamente
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth, createUserWithEmailAndPassword } from '../firebase';
import { PrimaryButton, SecondaryButton } from '../components/Button.js';

export default function RegisterScreen() {
    const navigation = useNavigation();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Função robusta para atualizar e-mail
    const handleEmailChange = (text) => {
        console.log('Email digitado:', text); // Debug
        setEmail(text);
        setErrorMessage(''); // Limpa erros ao digitar
    };

    const register = async () => {
        Keyboard.dismiss();
        
        if (!email || !password) {
            setErrorMessage('Informe o e-mail e senha.');
            return;
        }

        if (!regexEmail.test(email)) {
            setErrorMessage('E-mail inválido');
            return;
        }

        if (!regexPassword.test(password)) {
            setErrorMessage('A senha deve conter no mínimo 8 caracteres, letra maiúscula, minúscula, número e símbolo');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Registro bem-sucedido!');
            navigation.navigate('Home');
        } catch (error) {
            console.error('Erro no registro:', error);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        <Text style={styles.title}>Registrar-se</Text>
                        
                        {/* Substituímos EmailInput por TextInput nativo */}
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu e-mail"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={handleEmailChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        
                        <TextInput
                            style={styles.input}
                            placeholder="Crie uma senha"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!loading}
                        />
                        
                        {errorMessage ? (
                            <Text style={styles.errorMessage}>{errorMessage}</Text>
                        ) : null}
                        
                        {loading ? (
                            <ActivityIndicator size="large" style={styles.loader} />
                        ) : (
                            <PrimaryButton 
                                text={"Registrar-se"} 
                                onPress={register}
                            />
                        )}

                        <Text style={styles.haveAccountText}>Já tem uma conta?</Text>
                        
                        <SecondaryButton 
                            text={'Voltar para Login'} 
                            onPress={navigation.goBack}
                        />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    container: {
        margin: 25,
        paddingBottom: 30
    },
    title: {
        fontSize: 32,
        textAlign: 'center',
        marginVertical: 30,
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#fff'
    },
    errorMessage: {
        fontSize: 14,
        textAlign: 'center',
        color: 'red',
        marginVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ffeeee',
        borderRadius: 5,
        padding: 10
    },
    loader: {
        marginVertical: 20
    },
    haveAccountText: {
        textAlign: 'center',
        marginVertical: 15,
        fontSize: 15,
        color: '#666'
    }
});