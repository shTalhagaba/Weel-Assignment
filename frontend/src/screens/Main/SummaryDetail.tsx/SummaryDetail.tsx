// SummaryDetail.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { alpha, Colors } from '../../../utils/Colors';
import { useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { deliveryConfig } from '../../../Data/Delivery';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SummaryDetail = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderDetail } = route.params;
  
  const deliveryType = orderDetail?.delivery_type || 'DELIVERY';
  const currentDelivery = deliveryConfig[deliveryType] || deliveryConfig.DELIVERY;

  const formatDeliveryDateTime = (isoString: string) => {
    if (!isoString) return { date: 'Not set', time: 'Not set' };

    const date = new Date(isoString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { date: formattedDate, time: formattedTime };
  };

  const { date: deliveryDate, time: deliveryTime } = orderDetail?.delivery_time
    ? formatDeliveryDateTime(orderDetail.delivery_time)
    : { date: 'Not specified', time: 'Not specified' };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('userToken');
    Toast.show({
      type: 'success',
      text1: 'Signed Out',
      text2: 'You have been logged out successfully.',
    });
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const handleConfirm = () => {
    Toast.show({
      type: 'success',
      text1: 'Order Confirmed!',
      text2: 'You’ll receive a confirmation email shortly.',
      visibilityTime: 4000,
    });

    // Optional: Navigate to home or order history
    setTimeout(() => {
      navigation.navigate('Home'); // or OrderHistory, etc.
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.subtitle}>Review your order details</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIcon, { backgroundColor: Colors.BLUEc }]}>
                <Ionicons name="person" size={20} color={Colors.WHITE} />
              </View>
              <Text style={styles.cardTitle}>Account Information</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{orderDetail?.user?.email || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>#{orderDetail?.id}</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIcon, { backgroundColor: currentDelivery.color }]}>
                <Ionicons name={currentDelivery.icon as any} size={20} color={Colors.WHITE} />
              </View>
              <Text style={styles.cardTitle}>Delivery Method</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <View style={[styles.deliveryBadge, { backgroundColor: currentDelivery.lightColor }]}>
              <Ionicons name={currentDelivery.icon as any} size={16} color={currentDelivery.color} />
              <Text style={[styles.deliveryBadgeText, { color: currentDelivery.color }]}>
                {currentDelivery.title}
              </Text>
            </View>

            {(deliveryType === 'DELIVERY' || deliveryType === 'CURBSIDE') && (
              <>
                {orderDetail?.address && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Delivery Address</Text>
                    <Text style={[styles.infoValue, styles.addressText]}>
                      {orderDetail.address}
                    </Text>
                  </View>
                )}

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estimated Delivery</Text>
                  <Text style={styles.infoValue}>{deliveryDate} at {deliveryTime}</Text>
                </View>
              </>
            )}

            {deliveryType === 'IN_STORE' && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Store Location</Text>
                  <Text style={styles.infoValue}>
                    {orderDetail?.address || 'Main Branch - Downtown'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pickup Time</Text>
                  <Text style={styles.infoValue}>{deliveryTime}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Colors.RED} />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: verticalScale(120) }} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
          <Ionicons name="checkmark-circle" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SummaryDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: scale(20) },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: Colors.BLACK,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: Colors.LABEL,
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
    overflow: 'hidden',
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scale(16),
    backgroundColor: Colors.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.WHITE_BORDER,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: Colors.BLACK,
  },
  cardContent: {
    padding: scale(16),
  },
  infoRow: {
    marginBottom: verticalScale(16),
  },
  infoLabel: {
    fontSize: moderateScale(12),
    color: Colors.LABEL,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: verticalScale(4),
  },
  infoValue: {
    fontSize: moderateScale(16),
    color: Colors.BLACK,
    fontWeight: '500',
    lineHeight: verticalScale(22),
  },
  addressText: {
    lineHeight: verticalScale(24),
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(16),
  },
  deliveryBadgeText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    marginLeft: scale(8),
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha(Colors.RED, 0.1),
    padding: scale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: alpha(Colors.RED, 0.2),
    marginTop: verticalScale(10),
  },
  signOutButtonText: {
    color: Colors.RED,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginLeft: scale(8),
  },
  bottomContainer: {
    backgroundColor: Colors.WHITE,
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: Colors.WHITE_BORDER,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: 'c',
    borderRadius: moderateScale(14),
    paddingVertical: scale(18),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.WHITE,
    fontSize: moderateScale(18),
    fontWeight: '700',
    marginRight: scale(10),
  },
});