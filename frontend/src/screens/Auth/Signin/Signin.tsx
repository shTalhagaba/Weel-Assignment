import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { loginSchema } from '../../../helpers/Auth.helper';
import { Colors } from '../../../utils/Colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useMutation } from '@tanstack/react-query';
import { Login } from '../../../query/Auth.query';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: Login,
    onSuccess: (user) => {
      setLoading(true);
      Toast.show({
        type: 'success',
        text1: 'Login Successful 🎉',
        text2: `Welcome back, ${user.email}!`,
      });
      navigation.navigate('DeliveryPreference');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Invalid email or password',
      });
    },
  });

  const handleLogin = (values: { email: string; password: string }) => {
    mutate(values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="cart" size={40} color={Colors.WHITE} />
              </View>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your shopping</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      touched.email && errors.email && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={errors.email ? Colors.RED : Colors.LABEL}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={Colors.LABEL}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View
                    style={[
                      styles.inputContainer,
                      touched.password && errors.password && styles.inputError,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={errors.password ? Colors.RED : Colors.LABEL}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={Colors.LABEL}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    Toast.show({
                      type: 'info',
                      text1: 'Forgot Password',
                      text2: 'Please check your email for reset link',
                    })
                  }
                  style={styles.forgotPassword}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit as any}
                  activeOpacity={0.8}
                  disabled={Loading}
                >
                  <Text style={styles.loginButtonText}>
                    {Loading ? 'Signing in...' : 'Sign In'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.WHITE} />
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                  <Text style={styles.signUpText}>Do not have an account? </Text>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(24),
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  logoContainer: {
    marginBottom: verticalScale(24),
  },
  logoCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: Colors.BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateScale(32),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.LABEL,
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(16),
  },
  inputError: {
    borderColor: Colors.RED,
  },
  inputIcon: {
    marginRight: scale(2),
  },
  input: {
    flex: 1,
    paddingVertical: verticalScale(16),
    fontSize: moderateScale(16),
    color: '#111827',
  },
  passwordInput: {
    paddingRight: scale(40),
  },
  eyeIcon: {
    position: 'absolute',
    right: scale(16),
    padding: verticalScale(4),
  },
  errorText: {
    fontSize: moderateScale(13),
    color: Colors.RED,
    marginTop: verticalScale(6),
    marginLeft: scale(4),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(24),
  },
  forgotPasswordText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: Colors.BLUE,
  },
  loginButton: {
    backgroundColor: Colors.BLUE,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  loginButtonText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.WHITE,
    marginRight: scale(8),
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: moderateScale(15),
    color: Colors.LABEL,
  },
  signUpLink: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.BLUE,
  },
});

