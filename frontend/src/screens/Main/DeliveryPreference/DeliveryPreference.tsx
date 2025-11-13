import { useCreateOrder } from '@/src/query/Order.query';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { deliveryOptions } from '../../../Data/Delivery';
import { validationSchema } from '../../../helpers/DeliveryPreference.helper';
import { alpha, Colors } from '../../../utils/Colors';

const DeliveryPreference = () => {
  const navigation = useNavigation<any>();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmitForm = (values: any) => {
    let deliveryTimeIso: string | undefined;

    if (values.deliveryDate && values.deliveryTime) {
      deliveryTimeIso = `${values.deliveryDate}T${values.deliveryTime}:00.000Z`;
    }

    const payload: any = {
      delivery_type: values.deliveryOption,
      address:
        values.deliveryOption === 'DELIVERY' || values.deliveryOption === 'CURBSIDE'
          ? values.address.trim()
          : undefined,
      delivery_time:
        values.deliveryOption === 'IN_STORE'
          ? deliveryTimeIso
          : deliveryTimeIso || undefined,

      vehicle_color: values.vehicle_color,
      vehicle_model: values.vehicle_model,
    };

    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    createOrder(payload, {
      onSuccess: (data: any) => {
        console.log('Order created successfully:', data);
        Toast.show({
          type: 'success',
          text1: 'Order Created',
          text2: 'Taking you to summary...',
        });
        navigation.navigate('SummaryDetail', { orderDetail: data?.data });
        showDatePicker && setShowDatePicker(false);
        showTimePicker && setShowTimePicker(false);
      },
      onError: (error: any) => {
        console.error('Order creation failed:', error);
        Toast.show({
          type: 'error',
          text1: 'Order Failed',
          text2:
            error?.response?.data?.error ||
            error?.message ||
            'Please try again later',
        });
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          deliveryOption: '',
          address: '',
          deliveryDate: '',
          deliveryTime: '',
          vehicle_color: 'blue',
          vehicle_model: 'Toyota Camry',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
          isValid,
        }) => {
          const isFormValid = isValid && values.deliveryOption;

          return (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Choose Your Delivery Method</Text>
                <Text style={styles.subtitle}>
                  Select how you would like to receive your order
                </Text>
              </View>

              <View style={styles.optionsContainer}>
                {deliveryOptions.map((option) => {
                  const isSelected = values.deliveryOption === option.id;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.optionCard,
                        isSelected && {
                          borderColor: option.color,
                          backgroundColor: option.lightColor,
                          ...styles.selectedCard,
                        },
                      ]}
                      onPress={() => {
                        setFieldValue('deliveryOption', option.id);
                        setFieldValue('address', '');
                        setFieldValue('deliveryDate', '');
                        setFieldValue('deliveryTime', '');
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionContent}>
                        <View style={styles.optionLeft}>
                          <View
                            style={[
                              styles.iconContainer,
                              { backgroundColor: option.color },
                            ]}
                          >
                            <Ionicons
                              name={option.icon as any}
                              size={moderateScale(24)}
                              color={Colors.WHITE}
                            />
                          </View>
                          <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionDescription}>
                              {option.description}
                            </Text>
                          </View>
                        </View>
                        {isSelected && (
                          <View
                            style={[
                              styles.checkContainer,
                              { backgroundColor: option.color },
                            ]}
                          >
                            <Ionicons
                              name="checkmark"
                              size={moderateScale(20)}
                              color={Colors.WHITE}
                            />
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {(values.deliveryOption === 'DELIVERY' || values.deliveryOption === 'CURBSIDE') && (
                <View style={styles.fieldsContainer}>
                  <TextInput
                    placeholder="Enter delivery address"
                    style={[
                      styles.input,
                      touched.address && errors.address && { borderColor: Colors.RED },
                    ]}
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                  />
                  {touched.address && errors.address && (
                    <Text style={styles.error}>{errors.address}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.input,
                      touched.deliveryDate && errors.deliveryDate && { borderColor: Colors.RED },
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={{ color: values.deliveryDate ? '#111827' : '#9CA3AF' }}>
                      {values.deliveryDate ? values.deliveryDate : 'Select Delivery Date'}
                    </Text>
                  </TouchableOpacity>
                  {touched.deliveryDate && errors.deliveryDate && (
                    <Text style={styles.error}>{errors.deliveryDate}</Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.input,
                      touched.deliveryTime && errors.deliveryTime && { borderColor: Colors.RED },
                    ]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{ color: values.deliveryTime ? '#111827' : '#9CA3AF' }}>
                      {values.deliveryTime ? values.deliveryTime : 'Select Delivery Time'}
                    </Text>
                  </TouchableOpacity>
                  {touched.deliveryTime && errors.deliveryTime && (
                    <Text style={styles.error}>{errors.deliveryTime}</Text>
                  )}
                </View>
              )}

              {values.deliveryOption === 'IN_STORE' && (
                <View style={styles.fieldsContainer}>
                  <TextInput
                    placeholder="Store location (optional)"
                    style={styles.input}
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                  />

                  <TouchableOpacity
                    style={[
                      styles.input,
                      touched.deliveryTime && errors.deliveryTime && { borderColor: Colors.RED },
                    ]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={{ color: values.deliveryTime ? Colors.BLACK : Colors.LABEL }}>
                      {values.deliveryTime ? values.deliveryTime : 'Select Pickup Time'}
                    </Text>
                  </TouchableOpacity>
                  {touched.deliveryTime && errors.deliveryTime && (
                    <Text style={styles.error}>{errors.deliveryTime}</Text>
                  )}
                </View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  value={new Date()}
                  minimumDate={new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === 'ios');
                    if (selectedDate) {
                      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
                      setFieldValue('deliveryDate', dateStr);
                    }
                  }}
                />
              )}

              {showTimePicker && (
                <DateTimePicker
                  mode="time"
                  value={new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(Platform.OS === 'ios');
                    if (selectedTime) {
                      const timeStr = selectedTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      });
                      setFieldValue('deliveryTime', timeStr); // e.g., "14:30"
                    }
                  }}
                />
              )}

              <View style={{ height: verticalScale(100) }} />

              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (!isFormValid || isPending) && styles.continueButtonDisabled,
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={!isFormValid || isPending}
                >
                  <Text style={styles.continueButtonText}>
                    {isPending ? 'Creating Order...' : 'Continue to Summary'}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={moderateScale(20)}
                    color={Colors.WHITE}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

export default DeliveryPreference;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: scale(20)
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30)
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: 'bold',
    color: alpha(Colors.BLACK, 0.8)
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: Colors.LABEL,
    marginTop: verticalScale(4)
  },
  optionsContainer: {
    gap: verticalScale(16),
    marginBottom: verticalScale(24)
  },
  optionCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    borderWidth: 2,
    borderColor: Colors.WHITE_BORDER,
  },
  selectedCard: {
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(16),
  },
  optionText: {
    flex: 1
  },
  optionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.BLACK
  },
  optionDescription: {
    color: Colors.LABEL
  },
  checkContainer: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldsContainer: {
    gap: verticalScale(16)
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    fontSize: moderateScale(16),
  },
  error: {
    fontSize: moderateScale(13),
    color: Colors.RED,
    marginTop: verticalScale(4)
  },
  bottomContainer: {
  },
  continueButton: {
    backgroundColor: Colors.BLUE,
    borderRadius: moderateScale(12),
    padding: moderateScale(18),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#D1D5DB'
  },
  continueButtonText: {
    color: Colors.WHITE,
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginRight: scale(8),
  },
});