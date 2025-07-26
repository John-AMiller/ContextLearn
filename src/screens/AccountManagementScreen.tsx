import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/utils/supabase';

export const AccountManagementScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, updateProfile, signOut } = useAuth();
  
  // State for editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.name || '');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleProfilePicturePress = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose how you want to update your profile picture',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // TODO: Upload to storage and update user profile
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      // TODO: Upload to storage and update user profile
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ name: newDisplayName.trim() });
      setIsEditingName(false);
      Alert.alert('Success', 'Display name updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update display name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
      if (error) throw error;
      
      Alert.alert(
        'Check Your Email', 
        'We sent a confirmation link to your new email address. Please click the link to complete the change.'
      );
      setIsEditingEmail(false);
      setNewEmail('');
    } catch (error) {
      Alert.alert('Error', 'Failed to update email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    Alert.alert(
      'Reset Password',
      'Send a password reset link to your email?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Link',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(user.email);
              if (error) throw error;
              
              Alert.alert('Check Your Email', 'We sent a password reset link to your email address.');
            } catch (error) {
              Alert.alert('Error', 'Failed to send reset email');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your progress and data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'Type "DELETE" to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: async () => {
                    // TODO: Implement account deletion
                    Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleNotificationSettings = () => {
    Alert.alert('Coming Soon', 'Notification settings will be available in a future update');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Coming Soon', 'Privacy settings will be available in a future update');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Account Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Picture Section */}
        <Card style={styles.profileSection}>
          <Text style={styles.sectionTitle}>Profile Picture</Text>
          <TouchableOpacity style={styles.avatarContainer} onPress={handleProfilePicturePress}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Icon name="camera" size={16} color={Colors.background} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Display Name Section */}
        <Card>
          <Text style={styles.sectionTitle}>Display Name</Text>
          {isEditingName ? (
            <View style={styles.editSection}>
              <Input
                value={newDisplayName}
                onChangeText={setNewDisplayName}
                placeholder="Enter your display name"
                style={styles.editInput}
              />
              <View style={styles.editButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setIsEditingName(false);
                    setNewDisplayName(user?.name || '');
                  }}
                  style={styles.editButton}
                />
                <Button
                  title="Save"
                  onPress={handleUpdateDisplayName}
                  loading={isLoading}
                  style={styles.editButton}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.infoRow} onPress={() => setIsEditingName(true)}>
              <Text style={styles.infoText}>{user?.name}</Text>
              <Icon name="pencil" size={20} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </Card>

        {/* Email Section */}
        <Card>
          <Text style={styles.sectionTitle}>Email Address</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.changeButton} onPress={() => setIsEditingEmail(true)}>
            <Text style={styles.changeButtonText}>Change Email</Text>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* Security Section */}
        <Card>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleResetPassword}>
            <Icon name="lock-reset" size={20} color={Colors.primary} />
            <Text style={styles.settingText}>Reset Password</Text>
            <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Preferences Section */}
        <Card>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity style={styles.settingRow} onPress={handleNotificationSettings}>
            <Icon name="bell" size={20} color={Colors.primary} />
            <Text style={styles.settingText}>Notifications</Text>
            <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingRow} onPress={handlePrivacySettings}>
            <Icon name="shield-account" size={20} color={Colors.primary} />
            <Text style={styles.settingText}>Privacy</Text>
            <Icon name="chevron-right" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <Icon name="delete" size={20} color={Colors.danger} />
            <Text style={styles.dangerText}>Delete Account</Text>
          </TouchableOpacity>
        </Card>

        {/* Email Change Modal */}
        <Modal visible={isEditingEmail} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Email</Text>
              <Text style={styles.modalDescription}>
                Enter your new email address. You'll need to verify it before the change takes effect.
              </Text>
              <Input
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter new email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => {
                    setIsEditingEmail(false);
                    setNewEmail('');
                  }}
                  style={styles.modalButton}
                />
                <Button
                  title="Change Email"
                  onPress={handleChangeEmail}
                  loading={isLoading}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.background,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  editSection: {
    gap: Layout.spacing.md,
  },
  editInput: {
    marginBottom: 0,
  },
  editButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  editButton: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Layout.spacing.sm,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  changeButtonText: {
    fontSize: 16,
    color: Colors.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  dangerCard: {
    borderColor: Colors.danger,
    borderWidth: 1,
    backgroundColor: '#ffebee',
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.danger,
    marginBottom: Layout.spacing.md,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
  },
  dangerText: {
    fontSize: 16,
    color: Colors.danger,
    marginLeft: Layout.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.lg,
  },
  modalInput: {
    marginBottom: Layout.spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  modalButton: {
    flex: 1,
  },
});