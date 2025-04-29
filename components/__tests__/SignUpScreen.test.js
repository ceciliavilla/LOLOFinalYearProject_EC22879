// app/signup/__tests__/SignUpScreen.test.js


// MOCK Firebase and Expo Router to avoid real network calls

// Mock firebase authentication
jest.mock('firebase/auth', () => ({
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'testuid' } })),
  }));

// Mock Firestore Dataset
jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    setDoc: jest.fn(() => Promise.resolve()),
  }));
  
// Mock Firebase Configuration
jest.mock('../../firebaseConfig', () => ({
    auth: {},
    db: {},
  }));
  
//Mock Expo-Router (navigation)
jest.mock('expo-router', () => ({
    useRouter: () => ({
      replace: jest.fn(),
      push: jest.fn(),
    }),
  }));
  
// Import testing libraries and components
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignUpScreen from '../../app/(auth)/SignUpScreen';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';
  
//Mock Alert.alert to prevent real popups during testing
jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  
// Start Test SignUpScreen
  describe('SignUpScreen', () => {

    // Clear all mocks before each test 
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    // Test 1: Render input fields correctly
    it('renders main input fields', () => {
      const {getByTestId } = render(<SignUpScreen />);
      expect(getByTestId('Email')).toBeTruthy();
      expect(getByTestId('Password')).toBeTruthy();
      expect(getByTestId('Confirm Password')).toBeTruthy();
      expect(getByTestId('Name')).toBeTruthy();
      expect(getByTestId('Last Name')).toBeTruthy();
    });
  
    //// Test 2: Show error if fields are empty
    it('shows error if fields are empty', () => {
      const { getByTestId } = render(<SignUpScreen />);
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(signUpButton);
  
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('fill in all fields')
      );
    });
  
    //Test 3: Show error if passwords do not match
    it('shows error if passwords do not match', () => {
      const { getByTestId, getByPlaceholderText } = render(<SignUpScreen />);

      // Fill in the fields with mismatched passwords
      fireEvent.changeText(getByTestId('Email'), 'test@example.com');
      fireEvent.changeText(getByTestId('Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm Password'), 'password124');
      fireEvent.changeText(getByTestId('Name'), 'Lolo');
      fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      fireEvent.press(getByTestId('birthDateButton'));
  
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(signUpButton);
  
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        expect.stringContaining('Passwords do not match')
      );
    });
  
    // Test 4: Success Registration for Elderly
    it('shows success if all fields are correctly filled (Elderly)', async () => {
      const { getByTestId, getByPlaceholderText } = render(<SignUpScreen />);

      // Fill fields for an Elderly user
      fireEvent.changeText(getByTestId('Email'), 'test@example.com');
      fireEvent.changeText(getByTestId('Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm Password'), 'password123');
      fireEvent.changeText(getByTestId('Name'), 'Lolo');
      fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      fireEvent.press(getByTestId('birthDateButton'));
  
      fireEvent.press(getByTestId('birthDateButton')); 
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(getByTestId('birthDateButton'));  // abrir el date picker
      fireEvent(getByTestId('birthDatePicker'), 'onChange', {
        nativeEvent: {
          timestamp: new Date('2000-01-01'),
        },
      });
            fireEvent.press(signUpButton);      
     
      await waitFor(() => {
        // Verify success alert
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          expect.stringContaining('Account created')
        );
  
        // Verify Firebase Authentication and Firestore calls
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'test@example.com',
          'password123'
        );
        expect(setDoc).toHaveBeenCalled();
      });
    });
  
    // Test 5: Show error if Healthcare user does not fill Speciality
    it('shows error if Healthcare user has no Speciality', async () => {
      const { getByTestId, getByPlaceholderText, getByText } = render(<SignUpScreen />);

      // Fill fields but no Speciality
      fireEvent.changeText(getByTestId('Email'), 'healthcare@example.com');
      fireEvent.changeText(getByTestId('Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm Password'), 'password123');
      fireEvent.changeText(getByTestId('Name'), 'Dr Lolo');
      fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      fireEvent.press(getByText('Healthcare'));
  
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(signUpButton);

  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          expect.stringContaining('speciality')
        );
      });
    });
  
    // Test 6: Show success if Healthcare user fills Speciality
    it('shows success if Healthcare user fills Speciality', async () => {
      const { getByTestId, getByPlaceholderText, getByText } = render(<SignUpScreen />);

      // Fill fields including Speciality
      fireEvent.changeText(getByTestId('Email'), 'healthcare@example.com');
      fireEvent.changeText(getByTestId('Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm Password'), 'password123');
      fireEvent.changeText(getByTestId('Name'), 'Dr. Lolo');
      fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      fireEvent.press(getByText('Healthcare'));
      fireEvent.changeText(getByTestId('Speciality'), 'Cardiology');
  
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(signUpButton);
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          expect.stringContaining('Account created')
        );
      });
    });
  
    // Test 7: Show success if Family user fills basic fields
    it('shows success if Family user fills basic fields', async () => {
      const { getByTestId, getByPlaceholderText, getByText } = render(<SignUpScreen />);

    // Fill fields for a Family user
      fireEvent.changeText(getByTestId('Email'), 'family@example.com');
      fireEvent.changeText(getByTestId('Password'), 'password123');
      fireEvent.changeText(getByTestId('Confirm Password'), 'password123');
      fireEvent.changeText(getByTestId('Name'), 'Lolo');
      fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      fireEvent.press(getByText('Family'));
  
      const signUpButton = getByTestId('signUpButton');
      fireEvent.press(signUpButton);
  
      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Success',
          expect.stringContaining('Account created')
        );
      });
    });

    // Test 8: Shows error if email is already in use
    it('shows error if email is already in use', async () => {
        const { getByTestId } = render(<SignUpScreen />);
      
        // Fill fields
        fireEvent.changeText(getByTestId('Email'), 'existing@example.com');
        fireEvent.changeText(getByTestId('Password'), 'password123');
        fireEvent.changeText(getByTestId('Confirm Password'), 'password123');
        fireEvent.changeText(getByTestId('Name'), 'Lolo');
        fireEvent.changeText(getByTestId('Last Name'), 'Villa');
      
        // Simulate selecting birth date
        fireEvent.press(getByTestId('birthDateButton'));
        fireEvent(getByTestId('birthDatePicker'), 'onChange', { nativeEvent: { timestamp: new Date('2000-01-01') } });
      
        createUserWithEmailAndPassword.mockRejectedValueOnce(
          new Error('Firebase: Error (auth/email-already-in-use).')
        );
      
        fireEvent.press(getByTestId('signUpButton'));
      
        // Now check
        await waitFor(() => {
          expect(Alert.alert).toHaveBeenCalledWith(
            'Error',
            expect.stringContaining('auth/email-already-in-use')
          );
        });
      });
      
  
});
  