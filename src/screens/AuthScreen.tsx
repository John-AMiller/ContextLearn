import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Colors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp && !name.trim()) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'Authentication failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
            <Icon name="translate" size={48} color={Colors.primary} />
            <Text style={styles.title}>ContextLearn</Text>
            <Text style={styles.subtitle}>
                Learn what you need, when you need it
            </Text>
            </View>

            <Card style={styles.formCard}>
            <Text style={styles.formTitle}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Text>

            {isSignUp && (
                <Input
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                error={errors.name}
                icon={<Icon name="account" size={20} color={Colors.textSecondary} />}
                />
            )}

            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                icon={<Icon name="email" size={20} color={Colors.textSecondary} />}
            />

            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
                icon={<Icon name="lock" size={20} color={Colors.textSecondary} />}
            />

            {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <Button
                title={isSignUp ? 'Sign Up' : 'Sign In'}
                onPress={handleSubmit}
                loading={isLoading}
                style={styles.submitButton}
            />

            <TouchableOpacity
                onPress={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
                }}
                style={styles.switchButton}
            >
                <Text style={styles.switchText}>
                {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
            </Card>

            <View style={styles.features}>
            <Text style={styles.featuresTitle}>Why ContextLearn?</Text>
            <View style={styles.featureItem}>
                <Icon name="lightning-bolt" size={24} color={Colors.primary} />
                <Text style={styles.featureText}>
                Learn practical phrases for real-world situations
                </Text>
            </View>
            <View style={styles.featureItem}>
                <Icon name="map-marker" size={24} color={Colors.primary} />
                <Text style={styles.featureText}>
                Context-aware lessons based on your location
                </Text>
            </View>
            <View style={styles.featureItem}>
                <Icon name="download" size={24} color={Colors.primary} />
                <Text style={styles.featureText}>
                Download lessons for offline practice
                </Text>
            </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: Layout.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Layout.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  formCard: {
    marginBottom: Layout.spacing.lg,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: Layout.spacing.md,
  },
  switchButton: {
    marginTop: Layout.spacing.lg,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: Colors.primary,
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
  },
  features: {
    marginBottom: Layout.spacing.xl,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
  },
  demoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});