import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { getLanguageFlag } from '@/utils/helpers';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const learningLanguages = user?.learningLanguages || [];

  if (learningLanguages.length <= 1) {
    return null; // Don't show switcher if only one language
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.switcher}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.flag}>{getLanguageFlag(currentLanguage)}</Text>
        <Text style={styles.languageName}>{currentLanguage}</Text>
        <Icon name="chevron-down" size={20} color={Colors.text} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Language</Text>
            <FlatList
              data={learningLanguages}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    item === currentLanguage && styles.languageOptionActive
                  ]}
                  onPress={() => handleLanguageChange(item)}
                >
                  <Text style={styles.optionFlag}>
                    {getLanguageFlag(item)}
                  </Text>
                  <Text style={[
                    styles.optionText,
                    item === currentLanguage && styles.optionTextActive
                  ]}>
                    {item}
                  </Text>
                  {item === currentLanguage && (
                    <Icon name="check" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  switcher: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  flag: {
    fontSize: 20,
    marginRight: Layout.spacing.sm,
  },
  languageName: {
    fontSize: 14,
    color: Colors.text,
    textTransform: 'capitalize',
    marginRight: Layout.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  languageOptionActive: {
    backgroundColor: Colors.surface,
  },
  optionFlag: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
    textTransform: 'capitalize',
  },
  optionTextActive: {
    fontWeight: '600',
    color: Colors.primary,
  },
});